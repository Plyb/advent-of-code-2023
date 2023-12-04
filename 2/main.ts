import * as fs from 'fs';

const inputPath = './in.txt';
const input = fs.readFileSync(inputPath, 'utf8');

const lines = input.split('\n');

let total = 0;
for (const line of lines) {
    const digitPattern = /\d|(one)|(two)|(three)|(four)|(five)|(six)|(seven)|(eight)|(nine)/;
    const reversedDigitPattern = /\d|(eno)|(owt)|(eerht)|(ruof)|(evif)|(xis)|(neves)|(thgie)|(enin)/;
    const firstMatch = digitPattern.exec(line)[0];
    const lastMatch = reversedDigitPattern.exec(line.split('').reverse().join(''))[0].split('').reverse().join('');

    const lookup = {
        'one': '1',
        'two': '2',
        'three': '3',
        'four': '4',
        'five': '5',
        'six': '6',
        'seven': '7',
        'eight': '8',
        'nine': '9',
    };
    const first = lookup[firstMatch] ?? firstMatch;
    const last = lookup[lastMatch] ?? lastMatch;

    const lineNumber = +(first + last);
    total += lineNumber;
}

console.log(total);