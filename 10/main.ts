import * as fs from 'fs';

type cell = '.' | 'S' | 'L' | '7' | 'F' | 'J' | '|' | '-'
type Grid = cell[][];
type left = [-1, 0];
type right = [1, 0];
type up = [0, -1];
type down = [0, 1];
type dir = up | down | left | right;

const left: left = [-1, 0];
const right: right = [1, 0];
const down: down = [0, 1];
const up: up = [0, -1];
const allDirs: [up, right, down, left] = [up, right, down, left];


const rots = new Map<dir, {[cell: string]: dir}>([
    [up, {'7': left, 'F': right, '|': up}],
    [right, {'7': down, 'J': up, '-': right}],
    [down, {'L': right, 'J': left, '|': down}],
    [left, {'L': up, 'F': down, '-': left}],
]);
const allowed = new Map<dir, cell[]>([...rots.entries()].map(([dir, rotMap]) => [dir, [...Object.keys(rotMap)] as cell[]]));

const debugStr = '';

main(`.${debugStr}/inex1.txt`);
main(`.${debugStr}/inex2.txt`);
main(`.${debugStr}/inex3.txt`);
main(`.${debugStr}/inex4.txt`);
main(`.${debugStr}/in.txt`);

function main(path: fs.PathOrFileDescriptor) {
    const input = fs.readFileSync(path, 'utf-8');

    const grid = input.split('\r\n').map(line => line.split('')) as Grid;
    const startLoc = findStartLoc(grid);
    
    for (const startingDir of allowed.keys()) {
        if (!allowed.get(startingDir).includes(cellAt(move(startLoc, startingDir)))) {
            continue;
        }

        let currDir = startingDir;
        let currLoc = move(startLoc, startingDir);
        let steps = 1;
        while (cellAt(currLoc) !== 'S') {
            currDir = rotate(currDir, cellAt(currLoc));
            currLoc = move(currLoc, currDir);
            steps++;
        }

        console.log(Math.ceil(steps / 2));
        break;
    }
    
    function cellAt(loc: [number, number]) : cell {
        if (loc[0] < 0 || loc[1] < 0 || loc[0] >= grid[0].length || loc[1] >= grid.length) {
            return '.';
        }

        return grid[loc[1]][loc[0]];
    }
}
function rotate(dir: dir, cell: cell) {
    return rots.get(dir)[cell];
}

function move(currLoc: [number, number], dir: dir) : [number, number] {
    return [currLoc[0] + dir[0], currLoc[1] + dir[1]];
}

function findStartLoc(grid: Grid) : [number, number] {
    for (let y = 0; y < grid.length; y++) {
        const row = grid[y];
        for (let x = 0; x < row.length; x++) {
            if (row[x] === 'S') {
                return [x, y];
            }
        }
    }
}
