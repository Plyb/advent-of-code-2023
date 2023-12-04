"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var inputPath = './in.txt';
var input = fs.readFileSync(inputPath, 'utf8');
var lines = input.split('\n');
var total = 0;
for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
    var line = lines_1[_i];
    var digitPattern = /\d|(one)|(two)|(three)|(four)|(five)|(six)|(seven)|(eight)|(nine)/;
    var reversedDigitPattern = /\d|(eno)|(owt)|(eerht)|(ruof)|(evif)|(xis)|(neves)|(thgie)|(enin)/;
    var firstMatch = digitPattern.exec(line)[0];
    var lastMatch = reversedDigitPattern.exec(line.split('').reverse().join(''))[0].split('').reverse().join('');
    var lookup = {
        'one': '1',
        'two': '2',
        'three': '3',
        'four': '4',
        'five': '5',
        'six': '6',
        'seven': '7',
        'eight': '8',
        'nine': '9',
    };
    var first = (_a = lookup[firstMatch]) !== null && _a !== void 0 ? _a : firstMatch;
    var last = (_b = lookup[lastMatch]) !== null && _b !== void 0 ? _b : lastMatch;
    var lineNumber = +(first + last);
    total += lineNumber;
}
console.log(total);
//# sourceMappingURL=main.js.map