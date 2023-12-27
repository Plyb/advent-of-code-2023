import * as fs from 'fs';

const labelLen = 1;
const input = fs.readFileSync('./in.txt', 'utf-8');
const inputLines = input.split('\r\n');

type coord = [number, number, number];
type brick = {
    label: number,
    max: coord,
    min: coord,
    supporters: brick[],
    supportees: brick[],
};
type space = (brick | null)[][][];

//get bricks
const bricks: brick[] = inputLines.map((inputLine, i) => {
    const [minStr, maxStr] = inputLine.split('~');
    return {
        label: i,
        max: stringToCoord(maxStr),
        min: stringToCoord(minStr),
        supportees: [],
        supporters: [],
    };
}).sort((a, b) => a.min[2] - b.min[2]);

// console.log(bricks.map(brick => brick.min[2]).join(','));

if (!bricks.every(brick => brick.min[0] <= brick.max[0] && brick.min[1] <= brick.max[1] && brick.min[2] <= brick.max[2])) {
    console.log('assert violation: order')
}

function stringToCoord(coordStr: string) {
    return coordStr.split(',').map(numStr => +numStr) as coord;
}

// fill space
const maxX = Math.max(...bricks.map(brick => brick.max[0]));
const maxY = Math.max(...bricks.map(brick => brick.max[1]));
const maxZ = Math.max(...bricks.map(brick => brick.max[2]));

const width = 1 + maxX;
const depth = 1 + maxY ;
const height = 1 + maxZ;

const space: space = new Array(width).fill(null).map(() =>
    new Array(depth).fill(null).map(() =>
        new Array(height).fill(null)
    )
);

for (const brick of bricks) {
    fillSpaceAt(brick, brick);
}

function fillSpaceAt(brick: brick, fillWith: brick | null) {
    for (let x = brick.min[0]; x <= brick.max[0]; x++) {
        for (let y = brick.min[1]; y <= brick.max[1]; y++) {
            for (let z = brick.min[2]; z <= brick.max[2]; z++) {
                space[x][y][z] = fillWith;
            }
        }
    }
}

// printSpace(space, labelLen);

// find supporters and settle

for (const brick of bricks) {
    const supporters = getSupportersOf(brick, space);
    if (supporters.length > 0) {
        if (!supporters.every(supporter => supporter.max[2] === supporters[0].max[2])) {
            console.log('assert violation: supporter max')
        }

        dropOnto(brick, supporters[0].max[2]);
    } else {
        dropOnto(brick, 0);
    }

    brick.supporters.push(...supporters);
    for (const supporter of supporters) {
        supporter.supportees.push(brick);
    }
}

function dropOnto(brick: brick, z: number) {
    const dropBy = brick.min[2] - z - 1;
    fillSpaceAt(brick, null);
    brick.max[2] -= dropBy;
    brick.min[2] -= dropBy;
    fillSpaceAt(brick, brick);
}

function getSupportersOf(brick: brick, space: space) {
    const supporters = new Set<brick>();
    for (let z = brick.min[2] - 1; z > 0 && supporters.size === 0; z--) {
        for (let x = brick.min[0]; x <= brick.max[0]; x++) {
            for (let y = brick.min[1]; y <= brick.max[1]; y++) {
                if (space[x][y][z] !== null) {
                    supporters.add(space[x][y][z]);
                }
            }
        }
    }
    return [...supporters];
}

// console.log('after');
// printSpace(space, labelLen);

// check for redundant supporters

const redundantSupporters = bricks.filter(brick =>
    brick.supportees.every(supportee => supportee.supporters.length > 1)
);

console.log('disintigratable:', redundantSupporters.length);
// console.log(redundantSupporters.map(brick => brick.label.toString()).join(','))

function printSpace(space: space, labelLen: number) {
    for (let x = 0; x < space.length; x++) {
        const slice = space[x];
        const sliceStr = transpose(slice).map(row =>
            row.map(cell => cell !== null
                ? cell.label.toString().padStart(labelLen, '0')
                : new Array(labelLen).fill('.').join('')
            ).join(' ')
        ).join('\n');
        console.log(x);
        console.log(sliceStr);
    }
}

function transpose<T>(pattern: T[][]) : T[][] {
    return new Array(pattern[0].length).fill(null).map((_, i) =>
        pattern.map((_, j) => pattern[j][i])
    )
}