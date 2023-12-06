import * as fs from 'fs';

const input = fs.readFileSync('./in.txt', 'utf-8');
const [timeLine, distanceLine] = input.split('\r\n');
const timeStrings = timeLine.split(':')[1].trim().split(' ').filter(str => str);
const distanceStrings = distanceLine.split(':')[1].trim().split(' ').filter(str => str);
// const times = timeStrings.map(str => +str);
// const distances = distanceStrings.map(str => +str);
const time = +timeStrings.join('');
const distance = +distanceStrings.join('');

type Race = {
    time: number,
    recordDistance: number,
};

// const races : Race[] = zip(times, distances, (time, distance) => ({ time, recordDistance: distance }));
const race: Race = {
    time,
    recordDistance: distance
};

// const numWaysToWin = races.map(race => new Array(race.time + 1).fill(null).filter((_, i) => getDistance(race.time, i) > race.recordDistance).length);
// const result = numWaysToWin.reduce((prev, curr) => prev * curr, 1);
const result = new Array(race.time + 1).fill(null).filter((_, i) => getDistance(race.time, i) > race.recordDistance).length;
console.log(result);

function getDistance(totalTime: number, buttonTime: number) {
    return buttonTime * (totalTime - buttonTime);
}

function zip<T1, T2, TRet>(a: Array<T1>, b: Array<T2>, map: (a: T1, b: T2) => TRet) {
    const result = [] as TRet[];
    for (let i = 0; i < a.length; i++) {
        result.push(map(a[i], b[i]));
    }
    return result;
}
