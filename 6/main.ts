import * as fs from 'fs';

const input = fs.readFileSync('./in.txt', 'utf-8');
const [timeLine, distanceLine] = input.split('\r\n');
const timeStrings = timeLine.split(':')[1].trim().split(' ').filter(str => str);
const distanceStrings = distanceLine.split(':')[1].trim().split(' ').filter(str => str);
// const times = timeStrings.map(str => +str);
// const distances = distanceStrings.map(str => +str);
const time = +timeStrings.join('');
const distance = +distanceStrings.join('');

// type Race = {
//     time: number,
//     recordDistance: number,
// };

// // const races : Race[] = zip(times, distances, (time, distance) => ({ time, recordDistance: distance }));
// const race: Race = {
//     time,
//     recordDistance: distance
// };

// // const numWaysToWin = races.map(race => new Array(race.time + 1).fill(null).filter((_, i) => getDistance(race.time, i) > race.recordDistance).length);
// // const result = numWaysToWin.reduce((prev, curr) => prev * curr, 1);
// const result = new Array(race.time + 1).fill(null).filter((_, i) => getDistance(race.time, i) > race.recordDistance).length;
// console.log(result);

// function getDistance(totalTime: number, buttonTime: number) {
//     return buttonTime * (totalTime - buttonTime);
// }

// function zip<T1, T2, TRet>(a: Array<T1>, b: Array<T2>, map: (a: T1, b: T2) => TRet) {
//     const result = [] as TRet[];
//     for (let i = 0; i < a.length; i++) {
//         result.push(map(a[i], b[i]));
//     }
//     return result;
// }

// How to not brute force it:
// 1. way one: binary search the upper and lower bounds, then take the difference
// 2. way two: use some algebra to find the intersections between the record distance and the distance parabola, ceiling both, and subtract
// let t be the total time for the race and b be the time pressing the button. let r be the record distance, and d be distance. Find the intersections between d = r and d = b * (t - b), solving for b.
// r = b * (t - b) -> r = -b^2 + tb -> r = -b^2 + tb + (t^2)/4 - (t^2)/4
// -r = b^2 - tb + (t^2)/4 - (t^2)/4 -> -r = (b - t/2)^2 - (t^2)/4 -> +-sqrt((t^2)/4 - r) = b - t/2
// b = t/2 +- sqrt((t^2)/4 - r)

const lowerBound = Math.ceil((time/2) - Math.sqrt(((time * time)/4) - distance));
const upperBound = Math.ceil((time/2) + Math.sqrt(((time * time)/4) - distance));
console.log(upperBound - lowerBound)
