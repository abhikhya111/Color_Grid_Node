const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "250mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000'
}));
const PORT = process.env.PORT || 5000;



app.post('/colors', (req, res) => {
  console.log("params",req.body);

  let squares = JSON.parse(req.body?.squares);
  let color = req.body?.color
  
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
      [row, col + 1], // right
      [row + 1, col], // down
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

    return largestRegion;
  }

  let lr = findLargestRegion(squares, color)
  res.send({region_size: lr, color_name: color})  // <==== req.body will be a parsed JSON object
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});