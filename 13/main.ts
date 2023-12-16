import * as fs from 'fs';

const input = fs.readFileSync('./in.txt', 'utf-8');
const patternStrings = input.split('\r\n\r\n');

type cell = '.' | '#';
type pattern = cell[][];
const patterns: pattern[] = patternStrings.map(patternString =>
    patternString.split('\r\n').map(patternLineString => patternLineString.split('') as cell[])
);

const scores = patterns.map(pattern => {
    const horizReflIndex = getHorizReflIndex(pattern);
    if (horizReflIndex !== -1) {
        return 100 * (horizReflIndex + 1);
    }

    const vertReflIndex = getHorizReflIndex(transpose(pattern));
    return (vertReflIndex + 1);
});

console.log(scores);
console.log(scores.reduce((acc, curr) => acc + curr, 0));

function transpose(pattern: pattern) : pattern {
    return new Array(pattern[0].length).fill(null).map((_, i) =>
        pattern.map((_, j) => pattern[j][i])
    )
}

function toString(pattern: pattern): string {
    return pattern.map(row => row.join('')).join('\r\n');
}

function arrayEquals<T>(a: T[], b: T[]) {
    if (a.length !== b.length) {
        return false;
    }

    return a.every((_, i) => a[i] === b[i]);
}

function getHorizReflIndex(pattern: pattern) {
    return pattern.findIndex((_, reflIndex) => {
        if (reflIndex === pattern.length - 1) {
            return false;
        }

        return pattern.slice(0, reflIndex + 1).every((row, i) => {
            const reflectedRow = pattern[reflIndex + 1 + (reflIndex - i)];
            if (reflectedRow === undefined) {
                return true;
            }

            return arrayEquals(row, reflectedRow);
        })
    })
}
