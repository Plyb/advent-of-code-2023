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

const startNodes = Object.keys(nodeMap).filter(node => node[2] === 'A');

const loopInfos = startNodes.map(startNode => {
    let numSteps = 0;
    let currNode = startNode;
    const visitedNodes: {[node: string]: number} = {};
    let numStepsToLoop = -1;
    let loopLength = -1;
    while (true) {
        const instruction = instructions[numSteps % instructions.length];
        currNode = nodeMap[currNode][instruction];
        const stepLabel = currNode + (numSteps % instructions.length);
        numSteps++;

        if (visitedNodes[stepLabel] !== undefined) {
            loopLength = numSteps - visitedNodes[stepLabel];
            numStepsToLoop = numSteps - loopLength;
            break;
        }

        visitedNodes[stepLabel] = numSteps;
    }

    console.log(startNode, numStepsToLoop, loopLength / instructions.length);
    console.log(Object.keys(visitedNodes).filter(node => node[2] === 'Z').map(node => [node, visitedNodes[node]]))
    return {
        numStepsToLoop,
        loopLength: loopLength
    };
});


const longestLoop = loopInfos.sort((a, b) => b.loopLength - a.loopLength)[0];
let loopSkip = BigInt(longestLoop.loopLength);
let largestNumZeros = 1;
for (let i = BigInt(longestLoop.loopLength + longestLoop.numStepsToLoop); true; i += loopSkip) {
    const loopSteps = loopInfos.map(loopInfo => (i - BigInt(loopInfo.numStepsToLoop)) % BigInt(loopInfo.loopLength))
    // console.log(i, loopSteps);

    // const numZeros = loopSteps.filter(loopStep => loopStep === BigInt(0)).length;
    // if (numZeros > largestNumZeros) {
    //     loopSkip = i - BigInt(longestLoop.numStepsToLoop);
    //     console.log(loopSkip, i, loopSteps);
    //     largestNumZeros = numZeros;
    // }

    if (loopSteps.reduce((acc, loopStep) => acc && loopStep === BigInt(0), true)) {
        console.log(i);
        break;
    }
}
