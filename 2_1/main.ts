import * as fs from 'fs';

const inputPath = './in.txt';
const input = fs.readFileSync(inputPath, 'utf-8');

const gameStrings = input.split('\n');
const games = gameStrings.map(gameString => {
    const [gameIdString, handsString] = gameString.split(':');
    const [_, idString] = gameIdString.split(' ');
    const id = +idString;
    const handStrings = handsString.split(';')
    const hands = handStrings.map(handString => {
        const hand = {
            red: 0,
            green: 0,
            blue: 0,
        };

        const cubeCountStrings = handString.split(',');
        for (const cubeCountString of cubeCountStrings) {
            const [countString, color] = cubeCountString.trim().split(' ');
            hand[color] = +countString;
        }

        return hand;
    });

    const minCubes = hands.reduce((prev, curr) => ({
        red: Math.max(prev.red, curr.red),
        green: Math.max(prev.green, curr.green),
        blue: Math.max(prev.blue, curr.blue),
    }), { red: 0, green: 0, blue: 0 });
    
    return {
        id,
        minCubes
    }
});

const threshold = {
    red: 12,
    green: 13,
    blue: 14,
};

const validGames = games.filter(game => game.minCubes.red <= threshold.red && game.minCubes.green <= threshold.green && game.minCubes.blue <= threshold.blue);

const sum = validGames.reduce((prev, curr) => prev + curr.id, 0);

console.log(sum);
