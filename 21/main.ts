import * as fs from 'fs';

const input = fs.readFileSync('./in.txt', 'utf-8');
type cell = '.' | 'O' | 'X' | '#';
type grid = {
    numFilled: number,
    numXs: number,
    numOs: number,
    cells: cell[][],
    coord: loc,
};
type loc = [number, number];
const cells = input.split('\r\n').map(inputLine => inputLine.split('') as cell[]);
const totalNumCells = sum(cells.map(row => row.length));
const numPounds = sum(cells.map(row => row.filter(cell => cell === '#').length));
let grid: grid = {
    cells,
    numFilled: numPounds + 1,
    numXs: 0,
    numOs: 0,
    coord: [0, 0],
};

const totalDist = 26_501_365;
const gridSize = grid.cells.length;
const cellsToEdge = Math.floor(gridSize / 2);

const centerO = fillGrid(grid, 0, totalDist, [cellsToEdge, cellsToEdge]);
const centerX = fillGrid(grid, 1, totalDist, [cellsToEdge, cellsToEdge]);

const up = fillGrid(grid, totalDist - gridSize + 1, totalDist, [gridSize - 1, cellsToEdge]);
const down = fillGrid(grid, totalDist - gridSize + 1, totalDist, [0, cellsToEdge]);
const left = fillGrid(grid, totalDist - gridSize + 1, totalDist, [cellsToEdge, gridSize - 1]);
const right = fillGrid(grid, totalDist - gridSize + 1, totalDist, [cellsToEdge, 0]);

const ulBig = fillGrid(grid, totalDist - cellsToEdge - gridSize + 1, totalDist, [gridSize - 1, 0]);
const ulSmall = fillGrid(grid, totalDist - cellsToEdge + 1, totalDist, [gridSize - 1, 0]);
const urBig = fillGrid(grid, totalDist - cellsToEdge - gridSize + 1, totalDist, [gridSize - 1, gridSize - 1]);
const urSmall = fillGrid(grid, totalDist - cellsToEdge + 1, totalDist, [gridSize - 1, gridSize - 1]);
const dlBig = fillGrid(grid, totalDist - cellsToEdge - gridSize + 1, totalDist, [0, gridSize - 1]);
const dlSmall = fillGrid(grid, totalDist - cellsToEdge + 1, totalDist, [0, gridSize - 1]);
const drBig = fillGrid(grid, totalDist - cellsToEdge - gridSize + 1, totalDist, [0, 0]);
const drSmall = fillGrid(grid, totalDist - cellsToEdge + 1, totalDist, [0, 0]);

function triangle(n: number) {
    return (n*n + n) / 2;
}

const numGridsToEdge = (totalDist - cellsToEdge) / gridSize;
const numOGridsInStraightAway = Math.floor((numGridsToEdge - 1) / 2);
const numXGridsInStraightAway = Math.ceil((numGridsToEdge - 1) / 2);
const numQuadrants = 4;
const numTriangleOGrids = 2 * triangle((numGridsToEdge - 4) / 2) + Math.ceil((numGridsToEdge - 2) / 2);
const numTriangleXGrids = 2 * triangle((numGridsToEdge - 2) / 2);
const numSmalls = numGridsToEdge;
const numBigs = numGridsToEdge - 1;
console.log(numGridsToEdge, numOGridsInStraightAway, numXGridsInStraightAway, numTriangleOGrids, numTriangleXGrids, numSmalls, numBigs)

const straightAwayOs = (centerO * BigInt(numOGridsInStraightAway)) * BigInt(numQuadrants);
const straightAwayXs = (centerX * BigInt(numXGridsInStraightAway)) * BigInt(numQuadrants);
const triangleOs = (centerO * BigInt(numTriangleOGrids)) * BigInt(numQuadrants);
const triangleXs = (centerX * BigInt(numTriangleXGrids)) * BigInt(numQuadrants);
const tips = up + down + left + right;
const ulTotal = ulSmall * BigInt(numSmalls) + ulBig * BigInt(numBigs);
const urTotal = urSmall * BigInt(numSmalls) + urBig * BigInt(numBigs);
const dlTotal = dlSmall * BigInt(numSmalls) + dlBig * BigInt(numBigs);
const drTotal = drSmall * BigInt(numSmalls) + drBig * BigInt(numBigs);

const total = centerO + straightAwayOs + straightAwayXs + triangleOs + triangleXs
    + tips + urTotal + ulTotal + dlTotal + drTotal;
console.log('total: ', total)

function fillGrid(grid: grid, startStep: number, endStep: number, startLoc: loc) {
    const startOdd = !!(startStep % 2);
    grid = {
        ...grid,
        cells: grid.cells.map(row => row.map(cell => cell)),
    }
    grid.cells[startLoc[0]][startLoc[1]] = startOdd ? 'X' : 'O';
    if (startOdd) {
        grid.numXs++;
    } else {
        grid.numOs++;
    }
    
    for (let i = startStep; i < endStep; i++) {
        grid = tick(grid, i);
        if (grid.numFilled === totalNumCells) {
            break;
        }
    }
    
    return BigInt(grid.numXs);
    
    function tick(grid: grid, i: number) {
        const odd = !!(i % 2);
        let newlyFilled = 0;
        const updatedCells = grid.cells.map((row, y) => row.map((cell, x) => {
            const updatedCell = getUpdatedCell(grid, [y, x], odd);
            if (cell === '.' && updatedCell !== '.') {
                newlyFilled++;
            }
            return updatedCell;
        }));
    
        const updatedGrid = {
            cells: updatedCells,
            numFilled: newlyFilled === 0
                ? totalNumCells // edge case where .s are totally surrounded
                : grid.numFilled + newlyFilled,
            numXs: grid.numXs + (odd ? 0 : newlyFilled),
            numOs: grid.numOs + (odd ? newlyFilled : 0),
            coord: grid.coord,
        };
    
        return updatedGrid;
    }
    
    function getUpdatedCell(grid: grid, cellLoc: loc, odd: boolean): cell {
        const cell = getCell(grid, cellLoc);
        if (cell === '#' || cell === 'O' || cell === 'X') {
            return cell;
        }
    
        const neighbors = getNeighbors(grid, cellLoc);
        if (neighbors.indexOf('O') !== -1 || neighbors.indexOf('X') !== -1) {
            return odd ? 'O' : 'X';
        } else {
            return '.';
        }
    }
    
    function getNeighbors(grid: grid, loc: loc) {
        return [
            getCell(grid, addLoc(loc, [-1, 0])),
            getCell(grid, addLoc(loc, [0, -1])),
            getCell(grid, addLoc(loc, [0, 1])),
            getCell(grid, addLoc(loc, [1, 0])),
        ]
    }
    
    function addLoc(a: loc, b: loc): loc {
        return [a[0] + b[0], a[1] + b[1]];
    }
    
    function getCell(grid: grid, loc: loc): cell {
        if (grid === undefined) {
            return '#';
        }
    
        if (loc[0] < 0) {
            return '#';
        } else if (loc[0] >= grid.cells.length) {
            return '#';
        } else if(loc[1] < 0) {
            return '#';
        } else if(loc[1] >= grid.cells[0].length) {
            return '#';
        }
    
        return grid.cells[loc[0]][loc[1]];
    }
}

function sum(arr: number[]) {
    return arr.reduce((acc, curr) => acc + curr, 0);
}
