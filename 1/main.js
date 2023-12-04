"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var inputPath = './in.txt';
var input = fs.readFileSync(inputPath, 'utf8');
var lines = input.split('\n');
var total = 0;
for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
    var line = lines_1[_i];
    var first = undefined;
    var last = undefined;
    for (var _a = 0, line_1 = line; _a < line_1.length; _a++) {
        var char = line_1[_a];
        var int = parseInt(char);
        if (isNaN(int)) {
            continue;
        }
        first = first !== null && first !== void 0 ? first : int;
        last = int;
    }
    var lineNumber = +((first + '') + (last + ''));
    total += lineNumber;
}
console.log(total);
//# sourceMappingURL=main.js.map