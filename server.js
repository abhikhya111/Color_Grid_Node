const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "250mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000'
}));
const PORT = process.env.PORT || 5001;



app.post('/colors', (req, res) => {
  console.log("params", req.body);
  let { no_of_colors, height, width } = req.body;
  console.log(no_of_colors, 'colors');

  function getColor(n, x, y) {
    let colorArray = [];
    let sqrs = [];

    let i = 0;
    while (i < n) {
      var randomColor = Math.floor(Math.random() * 16777215).toString(16);
      if (!colorArray.includes(randomColor)) {
        colorArray.push("#" + randomColor);
        i++;
      }
    }
    for (let i = 0; i < x; i++) {
      let row = [];
      for (let j = 0; j < y; j++) {
        let randomClrIdx = Math.floor(Math.random() * n);
        row.push(colorArray[randomClrIdx]);
      }
      sqrs.push(row);
    }
    return { colorArray, sqrs };
  }


  function isWithinGrid(row, col, numRows, numCols) {
    return row >= 0 && row < numRows && col >= 0 && col < numCols;
  }

  function searchRegion(row, col, grid, visited, color) {
    const numRows = grid.length;
    const numCols = grid[0].length;
    let regionSize = 1;
    visited[row][col] = true;

    const neighbors = [
      [row - 1, col], // up
      [row - 1, col + 1], // diagonal up right
      [row - 1, col - 1], // diagonla up left
      [row, col + 1], // right
      [row + 1, col], // down
      [row + 1, col - 1], // diagonal down left
      [row + 1, col + 1], // diagonal down right
      [row, col - 1], // left
    ];

    for (const neighbor of neighbors) {
      const [r, c] = neighbor;
      if (
        isWithinGrid(r, c, numRows, numCols) &&
        !visited[r][c] &&
        grid[r][c] === color
      ) {
        regionSize += searchRegion(r, c, grid, visited, color);
      }
    }

    return regionSize;
  }


  function findLargestRegion(grid, color) {
    console.log(grid,color,'area');
    const numRows = grid.length;
    const numCols = grid[0].length;
    const visited = new Array(numRows)
      .fill()
      .map(() => new Array(numCols).fill(false));
    let largestRegion = 0;

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (!visited[row][col] && grid[row][col] === color) {
          const regionSize = searchRegion(row, col, grid, visited, color);
          if (regionSize > largestRegion) {
            largestRegion = regionSize;
          }
        }
      }
    }
    console.log('region ', largestRegion);
    return largestRegion;
  }


  let { colorArray, sqrs } = getColor(no_of_colors, height, width);
  let largestColorData = 0;
  let colorName = "";
  colorArray.forEach((el) => {
    let largerScore = findLargestRegion(sqrs, el);
    colorName = largestColorData < largerScore ? el : colorName;
    largestColorData = largestColorData < largerScore ? largerScore : largestColorData;
  });

 console.log(colorName, largestColorData,'data');
  res.send({ region_size: largestColorData, region_color: colorName, colorArray, sqrs  })  // ==== req.body will be a parsed JSON object
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});