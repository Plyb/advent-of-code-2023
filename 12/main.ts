import * as fs from 'fs';

const input = fs.readFileSync('./12/in.txt', 'utf-8');
const inputLines = input.split('\r\n');

type record = {
    segments: string[],
    groups: number[],
    // display: string,
}

const records: record[] = inputLines.map(inputLine => {
    const [conditionsStringRaw, groupsStringRaw] = inputLine.split(' ');
    const conditionsString = new Array(5).fill(conditionsStringRaw).join('?');
    const groupsString = new Array(5).fill(groupsStringRaw).join(',');
    const segments = conditionsString.split('.').filter(segment => segment.length > 0);
    const groups = groupsString.split(',').map(groupString => +groupString);
    return {
        segments,
        groups,
        // display: conditionsString,
    };
});

type subRecord = {
    leftCapped: boolean,
    rightCapped: boolean,
    groups: number[],
    display: string
}

// class TrieNode<T> {
//     map: { [key: string]: TrieNode<T> | null}
//     depth: number
//     item: T | null

//     constructor(map: { [key: string]: TrieNode<T> | null}, depth: number, item: T | null) {
//         this.map = map;
//         this.depth = depth;
//         this.item = item;
//     }

//     get(key: string) {
//         if (key.length > cachingThreshold) {
//             return null;
//         }

//         return this.getNode(key).item;
//     }

//     set(key: string, val: T) {
//         if (key.length > cachingThreshold) {
//             return;
//         }

//         this.getNode(key).item = val;
//     }

//     getNode(key: string) {
//         if (key.length === 0) {
//             return this.item;
//         }
//         if (this.map[0] === null) {
//             this.map[0] = new TrieNode<T>({}, this.depth + 1, null);
//         }

//         return this.map[key[0]].getNode(key.substring(1));
//     }
// }

const cachingThreshold = 10;
const cache: {[key: string]: number} = {};

let totalValidPossibilities = 0;
const validPossiblitiesPerRecord: string[][] = [];
let lineNumber = 1;
for (const record of records.slice(71, 72)) {
    const newPossibilities = getPossibilities(record)
    totalValidPossibilities += newPossibilities;
    console.log(lineNumber++, newPossibilities, Object.keys(cache).length);


    // const possibilities = getPossibilities(record.display, record.groups, true);
    // const validPossibilities = possibilities.filter(possibility => arrayEqual(record.groups, possibility.groups))
    // console.log(possibilities.length, validPossibilities.length);
    // validPossiblitiesPerRecord.push(validPossibilities.map(x => x.display));
    // totalValidPossibilities += validPossibilities.length;

    // for (const key in cache) {
    //     delete cache[key];
    // }

    // const possibilities = [record];
    // validPossiblitiesPerRecord.push([]);
    // while (possibilities.length > 0) {
    //     const possibility = possibilities.pop();
    //     if (possibility.segments.length === 0) {
    //         if (possibility.groups.length === 0) {
    //             totalValidPossibilities++;
    //             validPossiblitiesPerRecord[validPossiblitiesPerRecord.length - 1].push(possibility.display);
    //         }

    //         continue; // invalid
    //     }

    //     const firstSegment = possibility.segments[0];
    //     const firstUnknown = firstSegment.indexOf('?');
    //     if (firstUnknown === -1) {
    //         if (firstSegment.length === possibility.groups[0] && firstSegment.split('').every(char => char === '#')) {
    //             if (possibility.groups.length === 1 && possibility.segments.length === 1) {
    //                 totalValidPossibilities++;
    //                 validPossiblitiesPerRecord[validPossiblitiesPerRecord.length - 1].push(possibility.display);
    //             } else {
    //                 possibilities.push({
    //                     segments: possibility.segments.slice(1),
    //                     groups: possibility.groups.slice(1),
    //                     display: possibility.display,
    //                 });
    //             }
    //         } // otherwise it is invalid, don't add another possibility
    //     } else {
    //         const splitFirst = firstSegment.slice(0, firstUnknown);
    //         const splitSecond = firstSegment.slice(firstUnknown + 1);

    //         const firstUnknownDisplay = possibility.display.indexOf('?');
    //         possibilities.push({
    //             segments: [...(splitFirst ? [splitFirst] : []), ...(splitSecond ? [splitSecond] : []) , ...possibility.segments.slice(1)],
    //             groups: possibility.groups,
    //             display: possibility.display.slice(0, firstUnknownDisplay) + '.' + possibility.display.slice(firstUnknownDisplay + 1),
    //         });
    //         possibilities.push({
    //             segments: [splitFirst + '#' + splitSecond, ...possibility.segments.slice(1)],
    //             groups: possibility.groups,
    //             display: possibility.display.slice(0, firstUnknownDisplay) + '#' + possibility.display.slice(firstUnknownDisplay + 1),
    //         })
    //     }
    // }
}

console.log(validPossiblitiesPerRecord.map(possibilities => possibilities));
console.log(totalValidPossibilities);

// function getPossibilities(record: record) {

//     if (record.segments.length === 0 && record.groups.length === 0) {
//         return 1;
//     }

//     if (record.segments.length === 0 && record.groups.length > 0) {
//         return 0;
//     }

//     if (record.groups.length === 0 && record.segments.find(segment => segment.indexOf('#') !== -1)) {
//         return 0;
//     }

//     if (record.groups.length === 0) {
//         return 1;
//     }
    
//     const cached = cache[JSON.stringify(record)];
//     if (cached) {
//         return cached;
//     }

//     const max = Math.max(0, ...record.groups);
//     const indexOfMax = record.groups.indexOf(max);
//     let numPossibilities = 0;
//     for (let s = 0; s < record.segments.length; s++) {
//         const segment = record.segments[s];
//         if (segment.length < max) {
//             continue;
//         }

//         for (let c = 0; c < segment.length + 1 - max; c++) {
//             if (segment[c - 1] === '#' || segment[c + max] === '#') {
//                 continue;
//             }

//             const before = segment.substring(0, c - 1);
//             const after = segment.substring(c + max + 1);
//             const beforeSegments = [...record.segments.slice(0, s), ...(before.length ? [before] : [])];
//             const afterSegments = [...(after.length ? [after] : []), ...record.segments.slice(s + 1)];
//             const beforeGroups = record.groups.slice(0, indexOfMax);
//             const afterGroups = record.groups.slice(indexOfMax + 1);

//             const beforeRecord : record = {
//                 segments: beforeSegments,
//                 groups: beforeGroups,
//                 // display: beforeSegments.join('.'),
//             };
//             const afterRecord : record = {
//                 segments: afterSegments,
//                 groups: afterGroups,
//                 // display: afterSegments.join('.'),
//             };

//             const newPossibilities = getPossibilities(beforeRecord) * getPossibilities(afterRecord);
//             numPossibilities += newPossibilities;

//             if (numPossibilities) {
//                 // console.log(numPossibilities, record);
//             }
//         }
//     }

//     cache[JSON.stringify(record)] = numPossibilities;

//     return numPossibilities;
// }

// function getPossibilities(conditionsString: string, targetGroups: number[], filterTargetGroups: boolean): subRecord[] {
//     if (cache[conditionsString]) {
//         return cache[conditionsString];
//     }

//     if (conditionsString.length === 1) {
//         if (conditionsString === '.') {
//             return [{
//                 leftCapped: false,
//                 rightCapped: false,
//                 groups: [],
//                 display: '.'
//             }];
//         } else if (conditionsString === '#') {
//             return [{
//                 leftCapped: true,
//                 rightCapped: true,
//                 groups: [1],
//                 display: '#'
//             }];
//         } else { // conditionsString === '?'
//             return [{
//                 leftCapped: false,
//                 rightCapped: false,
//                 groups: [],
//                 display: '.'
//             }, {
//                 leftCapped: true,
//                 rightCapped: true,
//                 groups: [1],
//                 display: '#'
//             }];
//         }
//     } else {
//         for (let i = 0; i < conditionsString.length && conditionsString.length < cachingThreshold; i++) {
//             const cached = cache[conditionsString.substring(i)]
//             if (cached) {
//                 const left = getPossibilities(conditionsString.substring(0, i), targetGroups, filterTargetGroups);
//                 const right = cached;
//                 const result = cross(left, right);
//                 if (conditionsString.length < cachingThreshold) {
//                     cache[conditionsString] = result;
//                 }
//                 return result;
//             }
//         }

//         const midPoint = Math.ceil(conditionsString.length / 2);
//         const left = getPossibilities(conditionsString.substring(0, midPoint), targetGroups, filterTargetGroups)
//             .filter(possibility => arrayIsSubArray(targetGroups, possibility.groups.slice(1, -1)));
//         const right = getPossibilities(conditionsString.substring(midPoint), targetGroups, false)
//             .filter(possibility => arrayIsSubArray(targetGroups, possibility.groups.slice(1, -1)));;
//         const result = cross(left, right);
//         if (conditionsString.length < cachingThreshold) {
//             cache[conditionsString] = result;
//         }
//         return result;
//     }
// }

// function cross(lefts: subRecord[], rights: subRecord[]) {
//     return distinct(lefts.flatMap(left => rights.map(right => merge(left, right))));
// }

// function distinct(subRecords: subRecord[]) {
//     const map : {[key: string]: subRecord} = {};
//     for (const subRecord of subRecords) {
//         map[JSON.stringify(subRecord)] = subRecord;
//     }
//     return Object.values(map);
// }

// function merge(left: subRecord, right: subRecord): subRecord {
//     if (left.rightCapped && right.leftCapped) {
//         return {
//             leftCapped: left.leftCapped,
//             rightCapped: right.rightCapped,
//             groups: [...left.groups.slice(0, left.groups.length -1), left.groups[left.groups.length - 1] + right.groups[0], ...right.groups.slice(1)],
//             display: left.display + right.display,
//         };
//     } else {
//         return {
//             leftCapped: left.leftCapped,
//             rightCapped: right.rightCapped,
//             groups: [...left.groups, ...right.groups],
//             display: left.display + right.display,
//         };
//     }
// }

// function partialArrayEqual<T>(target: Array<T>, actual: Array<T>) {
//     if (actual.length > target.length) {
//         return false;
//     }

//     for (let i = 0; i < actual.length; i++) {
//         if (target[i] !== actual[i]) {
//             return false;
//         }
//     }

//     return true;
// }

// function arrayIsSubArray<T>(target: Array<T>, actual: Array<T>) {
//     for (let start = 0; start < target.length; start++) {
//         if (start + actual.length > target.length) {
//             return false;
//         }

//         if (partialArrayEqual(target.slice(start), actual)) {
//             return true;
//         }
//     }
//     return false;
// }

// function arrayEqual<T>(a: Array<T>, b: Array<T>) {
//     if (a.length !== b.length) {
//         return false;
//     }

//     for (let i = 0; i < a.length; i++) {
//         if (a[i] !== b[i]) {
//             return false;
//         }
//     }
//     return true;
// }
