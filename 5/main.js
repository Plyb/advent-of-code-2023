"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class RangeMap {
    constructor(shifts) {
        this.shifts = shifts;
    }
    get(key) {
        for (const shift of this.shifts) {
            if (key >= shift.from && key < shift.from + shift.length) {
                return shift.to + (key - shift.from);
            }
        }
        return key;
    }
}
const input = fs.readFileSync('./in.txt', 'utf-8');
const [seedsStringWithLabel, ...mapStrings] = input.split('\r\n\r\n');
const [_, seedsString] = seedsStringWithLabel.split(':');
const seeds = seedsString.trim().split(' ').map(seedString => +seedString);
const maps = mapStrings.map(mapString => {
    const [_, ...shiftStrings] = mapString.split('\r\n');
    const shifts = shiftStrings.map(shiftString => {
        const [to, from, length] = shiftString.split(' ').map(shiftNumberString => +shiftNumberString);
        return {
            from,
            to,
            length,
        };
    });
    return new RangeMap(shifts);
});
const locations = seeds.map(seed => maps.reduce((prev, map) => map.get(prev), seed));
const minimumLocation = Math.min(...locations);
console.log(minimumLocation);
//# sourceMappingURL=main.js.map