import * as fs from 'fs';

type cell = '.' | '|' | '-' | '7' | 'J' | 'L' | 'F';
type grid = cell[][];
type left = [0, -1];
type right = [0, 1];
type up = [-1, 0];
type down = [1, 0];
type dir = up | down | left | right;
type instruction = {
    dir: dir,
    dist: number,
};
type loc = [number, number];
type line = {
    x: number,
    yStart: number,
    len: number,
    prev: line,
    prevConnection: 'top' | 'bottom'
};
type linePart = 'top' | 'bottom' | 'middle'

const left: left = [0, -1];
const right: right = [0, 1];
const down: down = [1, 0];
const up: up = [-1, 0];
const dirMap = {
    [0]: right,
    [1]: down,
    [2]: left,
    [3]: up,
};

type lineStatus = 'in' | 'out';
const debugStr = '';

main(`.${debugStr}/inex2.txt`, 100);
main(`.${debugStr}/inex.txt`, 3_000_000);
main(`.${debugStr}/in.txt`, 30_000_000);

function main(path: fs.PathOrFileDescriptor, scale: number) {
    const input = fs.readFileSync(path, 'utf-8');

    const inputLines = input.split('\r\n');
    const instructions: instruction[] = inputLines.map(inputLine => {
        const [_, _0, code] = inputLine.split(' ');
        const distStr = code.slice(2, code.length - 2);
        const dirStr = code.charAt(code.length - 2);
        return {
            dir: dirMap[+dirStr],
            dist: parseInt(distStr, 16),
        };
    });

    const lines: line[] = [];
    let x = 0;
    let y = 0;
    for (let i = 0; i < instructions.length; i += 2) {
        const horiz = instructions[i];
        const vert = instructions[i + 1];
        x += horiz.dir === left ? -horiz.dist : horiz.dist;
        const deltaY = vert.dir === up ? -vert.dist : vert.dist;
        lines.push({
            x,
            yStart: vert.dir === down ? y : y + deltaY,
            len: vert.dir === down ? deltaY : -deltaY,
            prev: lines[(i / 2) - 1],
            prevConnection: vert.dir === down ? 'top' : 'bottom'
        });
        y += deltaY;
    }
    lines[0].prev = lines[lines.length - 1];
    const sortedLines = lines.sort((a, b) => a.x - b.x);

    const ys = lines.flatMap(line => [line.yStart, line.yStart + line.len]);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    draw(instructions, scale);
    let totalVolume = BigInt(0);
    for (let y = minY; y <= maxY; y++) {
        const relevantLines = sortedLines.filter(line => line.yStart <= y && line.yStart + line.len >= y);

        let status: lineStatus = 'out';
        for (let i = 0; i < relevantLines.length - 1; i++) {
            const line = relevantLines[i];
            const nextLine = relevantLines[i+ 1];
            const linePart: linePart = y === line.yStart ? 'top' : (y === line.yStart + line.len ? 'bottom' : 'middle');
            const nextLinePart: linePart = y === nextLine.yStart ? 'top' : (y === nextLine.yStart + nextLine.len ? 'bottom' : 'middle');

            const otherLineIsConnected = (nextLine.prev === line && nextLine.prevConnection === nextLinePart )
                || (line.prev === nextLine && line.prevConnection === linePart);
            if (otherLineIsConnected || ((linePart !== 'top') === (status === 'out'))) {
                totalVolume += BigInt(Math.abs(nextLine.x - line.x));
            } else {
                totalVolume++;
            }

            if (linePart !== 'top') {
                status = status === 'out' ? 'in' : 'out';
            }
        }

        totalVolume++;
    }
    console.log(totalVolume);
}

function draw(instructions: instruction[], scale: number) {
    const grid = new Array(100).fill(null).map(() => new Array(100).fill('.'));
    let x = Math.floor(scale / 2);
    let y = Math.floor(scale / 2);
    for (const instr of instructions) {
        fillLine(grid, [Math.floor(y / (scale / 100)), Math.floor(x / (scale / 100))], instr.dir, Math.floor(instr.dist / (scale / 100)), up);
        x += instr.dir === right ? instr.dist : (instr.dir === left ? -instr.dist : 0);
        y += instr.dir === down ? instr.dist : (instr.dir === up ? -instr.dist : 0);
    }
    console.log(grid.map(row => row.join('')).join('\n'));
}

function sum(arr: number[]) {
    return arr.reduce((acc, curr) => acc + curr, 0);
}

function fillLine(grid: grid, start: loc, dir: dir, dist: number, prevDir: dir) {
    const symbols = new Map<dir, cell>([
        [up, '|'],
        [down, '|'],
        [right, '-'],
        [left, '-'],
    ]);
    const symbol = symbols.get(dir);

    let distRemaining = dist + 1;
    let currLoc = start;
    let prevLoc = start;
    while (distRemaining) {
        prevLoc = currLoc;
        const cell = cellAt(grid, currLoc);
        if (currLoc === start) {
            const corner = getCornerSymbol(dir, prevDir);
            grid[currLoc[0]][currLoc[1]] = corner;
        } else if (cell === '.') {
            grid[currLoc[0]][currLoc[1]] = symbol;
        }
        distRemaining--;
        currLoc = move(currLoc, dir);
    }
    return prevLoc;
}

function getCornerSymbol(dir: dir, prevDir: dir): cell {
    switch(dir) {
        case up: switch(prevDir) {
            case right: return 'J';
            case left: return 'L';
        }
        case down: switch(prevDir) {
            case right: return '7';
            case left: return 'F';
        }
        case left: switch(prevDir) {
            case up: return '7';
            case down: return 'J';
        }
        case right: switch(prevDir) {
            case up: return 'F';
            case down: return 'L';
        }
    }
}

function cellAt<T>(grid: T[][], loc: loc) {
    if (loc[0] < 0 || loc[0] >= grid.length || loc[1] < 0 || loc[1] >= grid[0].length) {
        return null;
    }

    return grid[loc[0]][loc[1]];
}

function move(loc: loc, dir: dir) : loc {
    return [loc[0] + dir[0], loc[1] + dir[1]];
}
