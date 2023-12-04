"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const inputPath = './in.txt';
const input = fs.readFileSync(inputPath, 'utf-8');
const inputLines = input.split('\n').map(line => line.trim());
const schematic = inputLines.map(line => new Array(line.length).fill(null));
for (let y = 0; y < schematic.length; y++) {
    const line = schematic[y];
    const inputLine = inputLines[y];
    for (let x = 0; x < line.length; x++) {
        if (!line[x] && isNumber(inputLine[x])) {
            const fullNumber = parseInt(inputLine.substring(x));
            const length = (fullNumber + '').length;
            const partNumber = {
                id: fullNumber,
                hasBeenIncluded: false,
            };
            for (let i = 0; i < length; i++) {
                line[x + i] = partNumber;
            }
        }
    }
}
let sum = 0;
const partNumberSet = new Set();
for (let y = 0; y < schematic.length; y++) {
    const line = schematic[y];
    for (let x = 0; x < line.length; x++) {
        const char = inputLines[y][x];
        if (char !== '*') {
            continue;
        }
        const partNumbers = getNeighbors(x, y).filter(x => x);
        const uniquePartNumbers = [...new Set(partNumbers)];
        if (uniquePartNumbers.length !== 2) {
            continue;
        }
        const gearRatio = uniquePartNumbers[0].id * uniquePartNumbers[1].id;
        sum += gearRatio;
        // For part one:
        // for (const partNumber of partNumbers) {
        //     if (!partNumber.hasBeenIncluded) {
        //         sum +=partNumber.id;
        //         partNumber.hasBeenIncluded = true;
        //         partNumberSet.add(partNumber);
        //     }
        // }
    }
}
// debug help
const output = inputLines.map((line, y) => line.split('').map((char, x) => {
    if (isNumber(char)) {
        return schematic[y][x].hasBeenIncluded ? 't' : 'f';
    }
    else {
        return char;
    }
}).join('')).join('\n');
fs.writeFileSync('./out.txt', output);
console.log(sum);
function isNumber(char) {
    return char >= '0' && char <= '9';
}
function getAt(x, y) {
    if (x < 0 || x >= schematic[0].length || y < 0 || y >= schematic.length) {
        return null;
    }
    return schematic[y][x];
}
function getNeighbors(x, y) {
    return [
        getAt(x - 1, y - 1),
        getAt(x - 1, y),
        getAt(x - 1, y + 1),
        getAt(x, y - 1),
        getAt(x, y + 1),
        getAt(x + 1, y - 1),
        getAt(x + 1, y),
        getAt(x + 1, y + 1),
    ];
}
//# sourceMappingURL=main.js.map