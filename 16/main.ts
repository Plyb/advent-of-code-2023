import * as fs from 'fs';

const input = fs.readFileSync('./in.txt', 'utf-8');
type cell = '.' | '|' | '-' | '/' | '\\';
type grid = cell[][];
type dir = [1, 0] | [-1, 0] | [0, 1] | [0, -1];
type turtle = {
    dir: dir,
    loc: [number, number],
};

const left: dir = [0, -1];
const up: dir = [-1, 0];
const right: dir = [0, 1];
const down: dir = [1, 0];

const grid: grid = input.split('\r\n').map(inputLine => inputLine.split('') as cell[]);

const startingTurtles: turtle[] = [
    ...grid.map((_, y) => ({ loc: [y, 0], dir: right} as turtle)),
    ...grid.map((_, y) => ({ loc: [y, grid[0].length - 1], dir: left } as turtle)),
    ...grid[0].map((_, x) => ({ loc: [0, x], dir: down } as turtle)),
    ...grid[0].map((_, x) => ({ loc: [grid.length - 1, x], dir: up} as turtle)),
];

const litPortions = startingTurtles.map((startingTurtle, i) => {
    if (i % 10 === 0) {
        console.log(i);
    }
    return runLight(startingTurtle);
});
console.log(litPortions);
console.log(Math.max(...litPortions));

function runLight(startingTurtle: turtle) {
    const lit: boolean[][] = new Array(grid.length).fill(null).map(() => new Array(grid[0].length).fill(false));
    const turtles: turtle[] = [startingTurtle];
    
    const pastTurtles = new Set<string>();
    while (turtles.length > 0) {
        const turtle = turtles.pop();
        if (cellAt(turtle.loc) === null) {
            continue;
        }
        lit[turtle.loc[0]][turtle.loc[1]] = true;
    
        const newTurtles = move(turtle);
        for (const newTurtle of newTurtles) {
            const turtleString = JSON.stringify(newTurtle);
            if (pastTurtles.has(turtleString)) {
                continue;
            }
            pastTurtles.add(turtleString);
            turtles.push(newTurtle);
        }
        // console.log(lit.map(row => row.map(cell => cell ? '#' : '.').join('')).join('\n'));
        // console.log(turtles);
    }
    
    const numLitCells = lit.flat().filter(litCell => litCell).length;
    return numLitCells;
    
    function litAt(location: [number, number]) {
        if (location[0] < 0 || location[0] >= lit.length || location[1] < 0 || location[1] >= lit[0].length) {
            return true;
        }
    
        return lit[location[0]][location[1]];
    }
}

function cellAt(location: [number, number]): cell | null {
    if (location[0] < 0 || location[0] >= grid.length || location[1] < 0 || location[1] >= grid[0].length) {
        return null;
    }

    return grid[location[0]][location[1]];
}

function move(turtle: turtle): turtle[] {
    const cell = cellAt(turtle.loc);
    if (cell === '.') {
        return [moveForward(turtle)];
    } else if (cell === '-') {
        if (turtle.dir === up || turtle.dir === down) {
            return [
                moveForward({ loc: turtle.loc, dir: right }),
                moveForward({ loc: turtle.loc, dir: left }),
            ];
        } else {
            return [moveForward(turtle)];
        }
    } else if (cell === '|') {
        if (turtle.dir === left || turtle.dir === right) {
            return [
                moveForward({ loc: turtle.loc, dir: up }),
                moveForward({ loc: turtle.loc, dir: down}),
            ];
        } else {
            return [moveForward(turtle)];
        }
    } else {
        const swapper = cell === '/'
            ? [down, right, left, up]
            : [down, left, right, up];
        const swappedDir = swapper[(swapper.indexOf(turtle.dir) + 2) % 4];
        return [moveForward({ loc: turtle.loc, dir: swappedDir })];
    }
}

function moveForward(turtle: turtle): turtle {
    return { loc: coordAdd(turtle.loc, turtle.dir), dir: turtle.dir};
}

function surroundingLocs(loc: [number, number]): [number, number][] {
    return [coordAdd(loc, up), coordAdd(loc, down), coordAdd(loc, right), coordAdd(loc, left)]
}

function coordAdd(loc: [number, number], dir: dir): [number, number] {
    return [loc[0] + dir[0], loc[1] + dir[1]];
}
