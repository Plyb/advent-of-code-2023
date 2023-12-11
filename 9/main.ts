import * as fs from 'fs';

const input = fs.readFileSync('./in.txt', 'utf-8');
const inputLines = input.split('\r\n');

type sequence = number[][];

const inputSequences: sequence[] = inputLines.map(inputLine => {
    const numbers = inputLine.split(' ').map(numString => +numString);
    return [numbers];
})

const differentiatedSequences = inputSequences.map(getDifferentiatedSequence);

const predictedSequences = differentiatedSequences.map(predictPrev);

const result = predictedSequences.reduce((acc, curr) => acc + curr[0][0], 0);
console.log(result);

function predictPrev(sequence: sequence) {
    sequence[sequence.length - 1].unshift(0);

    for (let i = sequence.length - 2; i >= 0; i--) {
        const differentiationLevel = sequence[i];
        const nextDiffLevel = sequence[i + 1]
        differentiationLevel.unshift(differentiationLevel[0] - nextDiffLevel[0])
    }
    return sequence;
}

function getDifferentiatedSequence(sequence: sequence) {
    while (!isAllZeros(sequence[sequence.length - 1])) {
        sequence.push(getDifferenceArray(sequence[sequence.length  -1]));
    }
    return sequence;
}

function getDifferenceArray(numbers: number[]) {
    return numbers.slice(0, numbers.length - 1).map((val, i) => numbers[i + 1] - val);
}

function isAllZeros(numbers: number[]) {
    for (const num of numbers) {
        if (num) {
            return false;
        }
    }
    return true;
}