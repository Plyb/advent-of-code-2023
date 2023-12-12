import * as fs from 'fs';

const input = fs.readFileSync('./in.txt', 'utf-8');
const inputLines = input.split('\r\n');

type record = {
    segments: string[],
    groups: number[],
    display: string,
}

const records: record[] = inputLines.map(inputLine => {
    const [conditionsString, groupsString] = inputLine.split(' ');
    const segments = conditionsString.split('.').filter(segment => segment.length > 0);
    const groups = groupsString.split(',').map(groupString => +groupString);
    return {
        segments,
        groups,
        display: conditionsString,
    };
});

let totalValidPossibilities = 0;
const validPossiblitiesPerRecord: string[][] = [];
for (const record of records) {
    const possibilities = [record];
    validPossiblitiesPerRecord.push([]);
    while (possibilities.length > 0) {
        const possibility = possibilities.pop();
        if (possibility.segments.length === 0) {
            if (possibility.groups.length === 0) {
                totalValidPossibilities++;
                validPossiblitiesPerRecord[validPossiblitiesPerRecord.length - 1].push(possibility.display);
            }

            continue; // invalid
        }

        const firstSegment = possibility.segments[0];
        const firstUnknown = firstSegment.indexOf('?');
        if (firstUnknown === -1) {
            if (firstSegment.length === possibility.groups[0] && firstSegment.split('').every(char => char === '#')) {
                if (possibility.groups.length === 1 && possibility.segments.length === 1) {
                    totalValidPossibilities++;
                    validPossiblitiesPerRecord[validPossiblitiesPerRecord.length - 1].push(possibility.display);
                } else {
                    possibilities.push({
                        segments: possibility.segments.slice(1),
                        groups: possibility.groups.slice(1),
                        display: possibility.display,
                    });
                }
            } // otherwise it is invalid, don't add another possibility
        } else {
            const splitFirst = firstSegment.slice(0, firstUnknown);
            const splitSecond = firstSegment.slice(firstUnknown + 1);

            const firstUnknownDisplay = possibility.display.indexOf('?');
            possibilities.push({
                segments: [...(splitFirst ? [splitFirst] : []), ...(splitSecond ? [splitSecond] : []) , ...possibility.segments.slice(1)],
                groups: possibility.groups,
                display: possibility.display.slice(0, firstUnknownDisplay) + '.' + possibility.display.slice(firstUnknownDisplay + 1),
            });
            possibilities.push({
                segments: [splitFirst + '#' + splitSecond, ...possibility.segments.slice(1)],
                groups: possibility.groups,
                display: possibility.display.slice(0, firstUnknownDisplay) + '#' + possibility.display.slice(firstUnknownDisplay + 1),
            })
        }
    }
}

console.log(validPossiblitiesPerRecord.map(possibilities => possibilities.length));
console.log(totalValidPossibilities);
