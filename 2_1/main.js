"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var inputPath = './in.txt';
var input = fs.readFileSync(inputPath, 'utf-8');
var gameStrings = input.split('\n');
var games = gameStrings.map(function (gameString) {
    var _a = gameString.split(':'), gameIdString = _a[0], handsString = _a[1];
    var _b = gameIdString.split(' '), _ = _b[0], idString = _b[1];
    var id = +idString;
    var handStrings = handsString.split(';');
    var hands = handStrings.map(function (handString) {
        var hand = {
            red: 0,
            green: 0,
            blue: 0,
        };
        var cubeCountStrings = handString.split(',');
        for (var _i = 0, cubeCountStrings_1 = cubeCountStrings; _i < cubeCountStrings_1.length; _i++) {
            var cubeCountString = cubeCountStrings_1[_i];
            var _a = cubeCountString.trim().split(' '), countString = _a[0], color = _a[1];
            hand[color] = +countString;
        }
        return hand;
    });
    var minCubes = hands.reduce(function (prev, curr) { return ({
        red: Math.max(prev.red, curr.red),
        green: Math.max(prev.green, curr.green),
        blue: Math.max(prev.blue, curr.blue),
    }); }, { red: 0, green: 0, blue: 0 });
    return {
        id: id,
        minCubes: minCubes
    };
});
var threshold = {
    red: 12,
    green: 13,
    blue: 14,
};
var validGames = games.filter(function (game) { return game.minCubes.red <= threshold.red && game.minCubes.green <= threshold.green && game.minCubes.blue <= threshold.blue; });
var sum = validGames.reduce(function (prev, curr) { return prev + curr.id; }, 0);
console.log(sum);
//# sourceMappingURL=main.js.map