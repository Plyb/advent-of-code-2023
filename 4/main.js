"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const input = fs.readFileSync('./in.txt', 'utf-8');
const inputLines = input.split('\r\n');
const cards = inputLines.map(inputLine => {
    const [cardIdString, numbersString] = inputLine.split(':');
    const [_, idString] = cardIdString.split(' ');
    const [winningNumbersString, myNumbersString] = numbersString.split('|');
    const winningNumbers = toSet(winningNumbersString);
    const myNumbers = toSet(myNumbersString);
    const intersection = getIntersection(winningNumbers, myNumbers);
    const numMatches = intersection.size;
    // part one
    // const worth = numOverlapping
    //     ? Math.pow(2, (numOverlapping - 1))
    //     : 0;
    const worth = 1;
    return {
        id: +idString,
        worth,
        numMatches,
    };
});
for (let i = cards.length - 1; i >= 0; i--) {
    const card = cards[i];
    for (let j = 0; j < card.numMatches; j++) {
        const duplicateCard = cards[i + j + 1];
        if (duplicateCard === undefined) {
            continue;
        }
        card.worth += duplicateCard.worth;
    }
}
const totalWorth = cards.reduce((prev, curr) => prev + curr.worth, 0);
console.log(totalWorth);
function toSet(numString) {
    return new Set(numString.trim().split(' ').map(numString => +numString).filter(x => x && !Number.isNaN(x)));
}
function getIntersection(set1, set2) {
    const ans = new Set();
    for (let i of set2) {
        if (set1.has(i)) {
            ans.add(i);
        }
    }
    return ans;
}
//# sourceMappingURL=main.js.map