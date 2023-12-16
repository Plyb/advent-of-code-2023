import * as fs from 'fs';

const input = fs.readFileSync('./in.txt', 'utf-8');
const steps = input.split(',');
const stepsWithHashes = steps.map(step => ({
    step,
    hash: hash(step.includes('-')
        ? step.slice(0, step.length - 1)
        : step.slice(0, step.length - 2))
}));

type lens = {
    focalLength: number,
    slotOrder: number,
}

class Box {
    lenses: {[label: string]: lens} = {};
    lastLens = 0;

    add(label: string, focalLength: number) {
        if (this.lenses[label]) {
            this.lenses[label].focalLength = focalLength;
        } else {
            this.lenses[label] = {
                focalLength,
                slotOrder: ++this.lastLens,
            };
        }
    }

    remove(label: string) {
        delete this.lenses[label];
    }

    getLensFocalLengthsOrdered(): number[] {
        return Object.values(this.lenses)
            .sort((a, b) => a.slotOrder - b.slotOrder)
            .map(lens => lens.focalLength);
    }
}

const boxes = new Array(256).fill(null).map(() => new Box());
for (const { step, hash } of stepsWithHashes) {
    if (step.includes('-')) {
        const [label] = step.split('-');
        boxes[hash].remove(label);
        continue;
    }

    const [label, focalLengthString] = step.split('=');
    boxes[hash].add(label, +focalLengthString);
}

const boxFocusingPowers = boxes.map((box, boxNum) => box
    .getLensFocalLengthsOrdered()
    .map((focalLength, slotNum) => (boxNum + 1) * (slotNum + 1) *  focalLength)
    .reduce((acc, slotFocusingPower) => acc + slotFocusingPower, 0));
const totalFocusingPower = boxFocusingPowers.reduce((acc, boxFocusingPower) => acc + boxFocusingPower, 0);
console.log(totalFocusingPower);

function hash(str: string) {
    let result = 0;
    for (const char of str.split('')) {
        result += char.charCodeAt(0);
        result *= 17;
        result %= 256;
    }
    return result;
}
