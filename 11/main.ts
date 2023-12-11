import * as fs from 'fs';

type cell = '.' | '#' | 'E';
type grid = cell[][];

const input = fs.readFileSync('./in.txt', 'utf-8');
const lines = input.split('\r\n');
const grid: grid = lines.map(line => line.split('')) as grid;

// Expand
for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    if (row.every(cell => cell !== '#')) {
        grid.splice(y, 1, row.map(_ => 'E'));
        y++;
    }
}

for (let x = 0; x < grid[0].length; x++) {
    const col = grid.map(row => row[x]);
    if (col.every(cell => cell !== '#')) {
        for (const row of grid) {
            row.splice(x, 1, 'E');
        }
        x++;
    }
}

// console.log(grid.map(row => row.join('')).join('\n'));
const galaxyCoords: [number, number][] = [];
for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (cell === '#') {
            galaxyCoords.push([x, y]);
        }
    }
}

// console.log(galaxyCoords);

const expansionFactor = 1_000_000;
let totalDistance = 0;
for (let i = 0; i < galaxyCoords.length; i++) {
    const galaxyA = galaxyCoords[i];
    for (let j = i + 1; j < galaxyCoords.length; j++) {
        const galaxyB = galaxyCoords[j];
        
        const row = grid[galaxyA[1]];
        const aIsLeft = galaxyA[0] < galaxyB[0];
        const horizSlice = row.slice(aIsLeft ? galaxyA[0] : galaxyB[0], aIsLeft ? galaxyB[0] : galaxyA[0]);
        const numHorizExpanded = horizSlice.filter(cell => cell === 'E').length;
        totalDistance += (numHorizExpanded * expansionFactor) + (Math.abs(galaxyB[0] - galaxyA[0]) - numHorizExpanded);

        const col = grid.map(row => row[galaxyA[0]]);
        const aIsAbove = galaxyA[1] < galaxyB[1];
        const vertSlice = col.slice(aIsAbove ? galaxyA[1] : galaxyB[1], aIsAbove ? galaxyB[1] : galaxyA[1]);
        const numVertExpanded = vertSlice.filter(cell => cell === 'E').length;
        totalDistance += (numVertExpanded * expansionFactor) + (Math.abs(galaxyB[1] - galaxyA[1]) - numVertExpanded);

        // totalDistance += Math.abs(galaxyB[1] - galaxyA[1]) + Math.abs(galaxyB[0] - galaxyA[0]);
    }
}

console.log(totalDistance);