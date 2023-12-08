import * as fs from 'fs';

const input = fs.readFileSync('./in.txt', 'utf-8');
const [instructionsString, nodesString] = input.split('\r\n\r\n');

type instruction = 'L' | 'R';
const instructions = instructionsString.split('') as instruction[];

type NodeMap = {
    [source: string]: {L: string, R: string}
};
const nodeMap: NodeMap = Object.fromEntries(nodesString.split('\r\n').map(nodeLineString => {
    const [source, destsString] = nodeLineString.split(' = ');
    const [left, right] = destsString.substring(1, destsString.length - 1).split(', ');
    return [source, { L: left, R: right}];
}));

let numSteps = 0;
let currNode = 'AAA';
while (currNode !== 'ZZZ') {
    const instruction = instructions[numSteps % instructions.length];
    currNode = nodeMap[currNode][instruction];
    numSteps++;
}

console.log(numSteps);
