import * as fs from 'fs';

const inputPath = './in.txt';
const input = fs.readFileSync(inputPath, 'utf8');

const lines = input.split('\n');

let total = 0;
for (const line of lines) {
    let first = undefined;
    let last = undefined;
    for (const char of line) {
        const int = parseInt(char);
        if (isNaN(int)) {
            continue;
        }

        first = first ?? int;
        last = int;
    }

    const lineNumber = +((first + '') + (last + ''));
    total += lineNumber;
}

console.log(total);