"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const input = fs.readFileSync('./in.txt', 'utf-8');
const [timeLine, distanceLine] = input.split('\r\n');
const timeStrings = timeLine.split(':')[1].trim().split(' ').filter(str => str);
const distanceStrings = distanceLine.split(':')[1].trim().split(' ').filter(str => str);
// const times = timeStrings.map(str => +str);
// const distances = distanceStrings.map(str => +str);
const time = +timeStrings.join('');
const distance = +distanceStrings.join('');
// const races : Race[] = zip(times, distances, (time, distance) => ({ time, recordDistance: distance }));
const race = {
    time,
    recordDistance: distance
};
// const numWaysToWin = races.map(race => new Array(race.time + 1).fill(null).filter((_, i) => getDistance(race.time, i) > race.recordDistance).length);
// const result = numWaysToWin.reduce((prev, curr) => prev * curr, 1);
const result = new Array(race.time + 1).fill(null).filter((_, i) => getDistance(race.time, i) > race.recordDistance).length;
console.log(result);
function getDistance(totalTime, buttonTime) {
    return buttonTime * (totalTime - buttonTime);
}
function zip(a, b, map) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
        result.push(map(a[i], b[i]));
    }
    return result;
}
//# sourceMappingURL=main.js.map