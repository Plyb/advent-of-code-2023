import * as fs from 'fs';

const input = fs.readFileSync('./in.txt', 'utf-8');
const minX = 200_000_000_000_000;
const minY = 200_000_000_000_000;
const maxX = 400_000_000_000_000;
const maxY = 400_000_000_000_000;

type pos = [number, number];
type velocity = [number, number];
type hailstone = {
    startPos: pos,
    velocity: velocity,
};

const hailstones: hailstone[] = input.split('\r\n').map(inputLine => {
    const [posString, velocityString] = inputLine.split(' @ ');
    const pos: pos = posString.split(', ').map(numStr => +numStr.trim()) as pos;
    const velocity = velocityString.split(', ').map(numStr => +numStr.trim()) as velocity;
    return {
        startPos: pos,
        velocity,
    };
});

type pointSlopeLine = {
    slope: number,
    point: {
        x: number,
        y: number,
    },
}

const hailstoneLinePairs: [pointSlopeLine, hailstone][] = hailstones.map(hailstone => [{
    slope: hailstone.velocity[1] / hailstone.velocity[0],
    point: {
        x: hailstone.startPos[0],
        y: hailstone.startPos[1],
    }
}, hailstone]);

const numIntersectionsByLine = hailstoneLinePairs.map(([aLine, aStone], i) => {
    const intersectingLines = hailstoneLinePairs.slice(i + 1).filter(([bLine, bStone]) => {
        if (aLine.slope === bLine.slope) {
            return false;
        }

        const intersectionX = (aLine.slope*aLine.point.x - bLine.slope*bLine.point.x
                + bLine.point.y - aLine.point.y)
            / (aLine.slope - bLine.slope);

        const aXDir = aStone.velocity[0] < 0 ? -1 : 1;
        const bXDir = bStone.velocity[0] < 0 ? -1 : 1

        if (intersectionX < minX || intersectionX >= maxX
            || aXDir * (aLine.point.x - intersectionX) > 0
            || bXDir * (bLine.point.x - intersectionX) > 0
        ) {
            return false;
        }

        const intersectionY = aLine.slope*(intersectionX - aLine.point.x) + aLine.point.y;
        return intersectionY >= minY && intersectionY < maxY;
    })
    return intersectingLines.length;
});

console.log(numIntersectionsByLine);

function sum(arr: number[]) {
    return arr.reduce((acc, curr) => acc + curr, 0);
}

const totalNumIntersections = sum(numIntersectionsByLine);
console.log(totalNumIntersections);
