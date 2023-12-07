import * as fs from 'fs';

const input = fs.readFileSync('./in.txt', 'utf-8');
const inputLines = input.split('\r\n');

type handCards = [number, number, number, number, number];
type hand = {
    cards: handCards,
    type: number,
};
type handBid = {
    hand: hand,
    bid: number,
}
const strengths = {
    'T': 10,
    'J': 11,
    'Q': 12,
    'K': 13,
    'A': 14,
};

const handBids: handBid[] = inputLines.map(inputLine => {
    const [handString, bidString] = inputLine.split(' ');
    const bid = +bidString;
    const cards = (handString.split('')).map(char => strengths[char] ?? +char) as handCards;
    const type = handType(cards);
    return {
        hand: {
            cards,
            type,
        },
        bid,
    };
});

const sortedHandBids = handBids.sort(handBidComparer);
const numHands = sortedHandBids.length;
const winningsPerHand = sortedHandBids.map((handBid, i) => ((numHands - i) * handBid.bid));
const totalWinnings = winningsPerHand.reduce((acc, winnings) => acc + winnings, 0);
console.log(totalWinnings);

function handBidComparer(a: handBid, b: handBid) {
    return handComparer(a.hand, b.hand);
}

function handComparer(a: hand, b: hand) {
    const typeDifference = b.type - a.type;
    if (typeDifference !== 0) {
        return typeDifference;
    }

    for (let i = 0; i < a.cards.length; i++) {
        const cardDifference = b.cards[i] - a.cards[i];
        if (cardDifference !== 0) {
            return cardDifference;
        }
    }
    return 0;
}

function handType(cards: handCards) {
    const valueToCounts: {[value: number]: number} = {};
    for (const card of cards) {
        if (valueToCounts[card] === undefined) {
            valueToCounts[card] = 0;
        }

        valueToCounts[card]++;
    }
    const counts = Object.values(valueToCounts).sort((a, b) => b - a);

    if (counts[0] === 5) {
        return 6; // five of a kind
    } else if (counts[0] === 4) {
        return 5; // four of a kind
    } else if (counts[0] === 3 && counts[1] === 2) {
        return 4; // full house
    } else if (counts[0] === 3) {
        return 3; // three of a kind
    } else if (counts[0] === 2 && counts[1] === 2) {
        return 2; // two pair
    } else if (counts[0] === 2) {
        return 1; // one pair
    } else {
        return 0; // high card
    }
}