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

    const power = minCubes.red * minCubes.green * minCubes.blue;
    
    return {
        id,
        power
    }
});

const sum = games.reduce((prev, curr) => prev + curr.power, 0);

console.log(sum);

