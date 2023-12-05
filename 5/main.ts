import * as fs from 'fs';

const max = 10_000_000_000;
const input = fs.readFileSync('./in.txt', 'utf-8');

type RangeShift = {
    from: number,
    to: number,
    length: number,
}

type Range = {
    start: number,
    length: number,
}

class RangeMap {
    shifts: RangeShift[]

    constructor(shifts: RangeShift[]) {
        this.shifts = shifts.sort((a, b) => a.from - b.from);
    }

    get(key: Range) : Range[] {
        const results = [] as Range[];
        let endOfLastRange = key.start;
        let hasFoundIntersection = false;
        for (const shift of this.shifts) {
            if (endOfLastRange < shift.from && endOfLastRange < key.start + key.length) {
                results.push({
                    start: endOfLastRange,
                    length: shift.from - endOfLastRange,
                });
            }
            const intersection = rangeIntersection(this._rangeShiftToSourceRange(shift), key)
            if (intersection === null) {
                if (hasFoundIntersection) {
                    break;
                } else {
                    continue;
                }
            }
            hasFoundIntersection = true;

            results.push({
                start: shift.to + (intersection.start - shift.from),
                length: intersection.length,
            });
            endOfLastRange = shift.from + shift.length;
        }

        if (endOfLastRange < key.start + key.length) {
            results.push({
                start: endOfLastRange,
                length: (key.start + key.length) - endOfLastRange,
            });
        }

        return results;
    }

    _rangeShiftToSourceRange(shift: RangeShift) : Range {
        return {
            start: shift.from,
            length: shift.length
        };
    }
}

const [seedsStringWithLabel, ...mapStrings] = input.split('\r\n\r\n');

const [_, seedsString] = seedsStringWithLabel.split(':');
const seedNumbers = seedsString.trim().split(' ').map(seedString => +seedString);
const seedRanges : Range[] = seedNumbers
    .map((seedNumber, i) => i % 2 === 0
        ? { start: seedNumber, length: seedNumbers[i + 1] }
        : null)
    .filter(range => range);

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

const locationRanges = maps.reduce((prev : Range[], map) => {
    console.log(`Num ranges: ${prev.length}`);
    displayShifts(prev);
    const ranges = prev.flatMap(prevRange => map.get(prevRange));
    return unify(ranges);
}, seedRanges);
displayShifts(locationRanges);
const minimumLocation = Math.min(...locationRanges.map(locationRange => locationRange.start));

console.log(minimumLocation);

function unify(ranges: Range[]) {
    const sortedRanges = ranges.sort((a, b) => a.start - b.start);
    const unifiedRanges = [] as Range[];
    for (let i = 0; i < sortedRanges.length; i++) {
        const lastUnifiedRange = unifiedRanges[unifiedRanges.length - 1];
        if (lastUnifiedRange === undefined) {
            unifiedRanges.push(sortedRanges[i]);
            continue;
        }

        const intersection = rangeIntersection(lastUnifiedRange, sortedRanges[i]);
        if (intersection === null) {
            unifiedRanges.push(sortedRanges[i]);
            continue;
        }

        unifiedRanges.pop();
        unifiedRanges.push({
            start: lastUnifiedRange.start,
            length: sortedRanges[i].length + (sortedRanges[i].start - lastUnifiedRange.start)
        });
    }
    return unifiedRanges;
}

function rangeIntersection(a: Range, b: Range): Range | null {
    if (b.start < a.start) {
        return rangeIntersection(b, a);
    }

    if (b.start >= a.start + a.length) {
        return null;
    }

    if (b.start + b.length < a.start + a.length) {
        return {
            start: b.start,
            length: b.length,
        };
    }

    return {
        start: b.start,
        length: a.start + a.length - b.start,
    };
}

function displayShifts(ranges: Range[]) {
    const stringLength = 100;
    let beforeStr = new Array(stringLength).fill(' ').join('');
    for (const range of ranges) {
        const startIndex = Math.floor(range.start * stringLength / max);
        const endIndex = Math.floor((range.start + range.length) * stringLength / max);
        beforeStr = beforeStr.substring(0, startIndex) + new Array(endIndex - startIndex).fill('-').join('') + beforeStr.substring(endIndex); 
    }
    console.log(beforeStr);
}
