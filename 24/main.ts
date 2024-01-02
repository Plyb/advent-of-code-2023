import * as fs from 'fs';
import Decimal from 'decimal.js';

Decimal.set({ precision: 100 })

const input = fs.readFileSync('./24/in.txt', 'utf-8');

type pos = [Decimal, Decimal, Decimal];
type velocity = [Decimal, Decimal, Decimal];
type line = {
    startPos: pos,
    velocity: velocity,
};

const hailstones: line[] = input.split('\r\n').map(inputLine => {
    const [posString, velocityString] = inputLine.split(' @ ');
    const pos: pos = posString.split(', ').map(numStr => new Decimal(numStr.trim())) as pos;
    const velocity = velocityString.split(', ').map(numStr => new Decimal(+numStr.trim())) as velocity;
    return {
        startPos: pos,
        velocity,
    };
});

type plane = {
    n: [number, number, number],
    p: [number, number, number],
}

const a: line = hailstones[0];
const b: line = hailstones[1];
const c: line = hailstones[2];

// coordinate shift to make it so hailstone 'a' is stationary at the origin
// d is b shifted and f is c shifted
const d: line = {
    startPos: minus(b.startPos, a.startPos),
    velocity: minus(b.velocity, a.velocity),
};
const f: line = {
    startPos: minus(c.startPos, a.startPos),
    velocity: minus(c.velocity, a.velocity),
};

// n1 and n2 represent two planes, one for the plane defined by the origin (a) and d,
// the other the origin and f. l is then the line of intersection between these two planes.
// Because the planes contain d and f, l will intersect d, f, and the origin
const n1 = cross(posAtTime(d, new Decimal(0)), posAtTime(d, new Decimal(1)));
const n2 = cross(posAtTime(f, new Decimal(0)), posAtTime(f, new Decimal(1)));
const l = cross(n1, n2);

// Get the times at which the hailstones moving along d and f reach the intersection
// point with l
const t1 = ((d.startPos[2].div(l[2])).minus((d.startPos[0].div(l[0]))))
    .div((d.velocity[0].div(l[0])).minus((d.velocity[2].div(l[2]))));
const t2 = ((f.startPos[2].div(l[2])).minus((f.startPos[0].div(l[0]))))
    .div((f.velocity[0].div(l[0])).minus((f.velocity[2].div(l[2]))));

// back in canonical space, get the position of the hailstones at those times
const p1 = posAtTime(b, t1);
const p2 = posAtTime(c, t2);

// We now have two points at two times, which we can use to define a line that will intersect
// those points at those times. We only need its starting position, so just compute that.
const startPos = add(p1, mult(t1.neg(), mult(new Decimal(1).div(t2.minus(t1)), minus(p2, p1))));

console.log(startPos);
console.log(sum(startPos).toFixed());

function minus(a: [Decimal, Decimal, Decimal], b: [Decimal, Decimal, Decimal]): [Decimal, Decimal, Decimal] {
    return [a[0].minus(b[0]), a[1].minus(b[1]), a[2].minus(b[2])];
}

function add(a: [Decimal, Decimal, Decimal], b: [Decimal, Decimal, Decimal]): [Decimal, Decimal, Decimal] {
    return [a[0].add(b[0]), a[1].add(b[1]), a[2].add(b[2])];
}

function mult(a: Decimal, b: [Decimal, Decimal, Decimal]): [Decimal, Decimal, Decimal] {
    return [a.mul(b[0]), a.mul(b[1]), a.mul(b[2])];
}

function posAtTime(stone: line, time: Decimal) {
    return add(stone.startPos, mult(time, stone.velocity));
}

function cross(a: [Decimal, Decimal, Decimal], b: [Decimal, Decimal, Decimal]): [Decimal, Decimal, Decimal] {
    return [a[1].mul(b[2]).minus(a[2].mul(b[1])), a[2].mul(b[0]).minus(a[0].mul(b[2])), a[0].mul(b[1]).minus(a[1].mul(b[0]))];
}


function sum(arr: Decimal[]) {
    return arr.reduce((acc, curr) => acc.add(curr), new Decimal(0));
}
