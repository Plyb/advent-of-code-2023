import * as fs from 'fs';

type RangeShift = {
    from: number,
    to: number,
    length: number,
}

class RangeMap {
    shifts: RangeShift[]

    constructor(shifts: RangeShift[]) {
        this.shifts = shifts;
    }

    get(key: number) {
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
    const shifts : RangeShift[] = shiftStrings.map(shiftString => {
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
