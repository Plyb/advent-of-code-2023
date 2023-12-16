import * as fs from 'fs';

const input = fs.readFileSync('./in.txt', 'utf-8');
type cell = '.' | '#' | 'O';
type dir = 'N' | 'W' | 'S' | 'E';
type platform = cell[][];
let platform: platform = input.split('\r\n').map(inputLine => inputLine.split('') as cell[]);

const stateTimes: {[platform: string]: number} = {};
let extraCycles = 0;
for (let i = 0; i < 1_000_000_000; i++) {
    platform = cycle(platform);
    const platformString = toString(platform);
    if (stateTimes[platformString] !== undefined) {
        extraCycles = (1_000_000_000 - i - 1) % (i - stateTimes[platformString]);
        break;
    }
    stateTimes[platformString] = i;
}

for (let i = 0; i < extraCycles; i++) {
    platform = cycle(platform);
}

const numRoundRocksInRows = platform.map(row => row.filter(cell => cell === 'O').length);
const numRows = platform.length;
const rowWeights = numRoundRocksInRows.map((numRocksInRow, i) => numRocksInRow * (numRows - i));
const totalWeight = rowWeights.reduce((acc, curr) => acc + curr, 0);
console.log(totalWeight);

function transpose(pattern: platform) : platform {
    return new Array(pattern[0].length).fill(null).map((_, i) =>
        pattern.map((_, j) => pattern[j][i])
    )
}

function toString(pattern: platform): string {
    return pattern.map(row => row.join('')).join('\r\n');
}

function tilt(platform: platform, dir: dir): platform {
    const transposer = dir === 'N' || dir === 'S'
        ? transpose
        : (platform: platform) => platform;

    const reverser = dir === 'N' || dir === 'W' ? -1 : 1;

    return transposer(transposer(platform).map(row => row
        .join('')
        .split('#')
        .map(openSegment => openSegment
            .split('')
            .sort((a, b) => {
                const aEmpty = a === '.' ? 1 : 0;
                const bEmpty = b === '.' ? 1 : 0;
                return (bEmpty - aEmpty) * reverser;
            })
            .join(''))
        .join('#')
        .split('') as cell[]));
}

function cycle(platform: platform): platform {
    return tilt(tilt(tilt(tilt(platform, 'N'), 'W'), 'S'), 'E');
}

function platformEquals(a: platform, b: platform): boolean {
    return a.every((_, i) => a[i].every((_, j) => a[i][j] === b[i][j]));
}
