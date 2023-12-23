import * as fs from 'fs';

const input = fs.readFileSync('./in.txt', 'utf-8');
type cell = '.' | 'O' | '#';
type grid = cell[][];
type loc = [number, number];

let grid: grid = input.split('\r\n').map(inputLine => inputLine.split('') as cell[]);

const numSteps = 64;
for (let i = 0; i < numSteps; i++) {
    grid = tick(grid);
    console.log('tick:' + i);
    // console.log(grid.map(row => row.join('')).join('\n'));
}

const numReachablePlots = sum(grid.map(row => row.filter(cell => cell === 'O').length));
console.log(numReachablePlots);

function tick(grid: grid): grid {
    return grid.map((row, y) => row.map((cell, x) => updatedCell(grid, [y, x])));
}

function updatedCell(grid: grid, loc: loc): cell {
    const cell = getCell(grid, loc);
    if (cell === '#') {
        return '#';
    }

    const neighbors = getNeighbors(grid, loc);
    if (neighbors.indexOf('O') !== -1) {
        return 'O';
    } else {
        return '.';
    }
}

function getNeighbors(grid: grid, loc: loc) {
    return [
        // getCell(grid, addLoc(loc, [-1, -1])),
        getCell(grid, addLoc(loc, [-1, 0])),
        // getCell(grid, addLoc(loc, [-1, 1])),
        getCell(grid, addLoc(loc, [0, -1])),
        getCell(grid, addLoc(loc, [0, 1])),
        // getCell(grid, addLoc(loc, [1, -1])),
        getCell(grid, addLoc(loc, [1, 0])),
        // getCell(grid, addLoc(loc, [1, 1])),
    ]
}

function addLoc(a: loc, b: loc): loc {
    return [a[0] + b[0], a[1] + b[1]];
}

function getCell(grid: grid, loc: loc): cell {
    if (loc[0] < 0 || loc[0] >= grid.length || loc[1] < 0 || loc[1] >= grid[0].length) {
        return '#';
    }

    return grid[loc[0]][loc[1]];
}

function sum(arr: number[]) {
    return arr.reduce((acc, curr) => acc + curr, 0);
}
