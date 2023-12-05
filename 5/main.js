"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const max = 10000000000;
const input = fs.readFileSync('./in.txt', 'utf-8');
class RangeMap {
    constructor(shifts) {
        this.shifts = shifts.sort((a, b) => a.from - b.from);
    }
    get(key) {
        const results = [];
        let endOfLastRange = key.start;
        let hasFoundIntersection = false;
        for (const shift of this.shifts) {
            if (endOfLastRange < shift.from && endOfLastRange < key.start + key.length) {
                results.push({
                    start: endOfLastRange,
                    length: shift.from - endOfLastRange,
                });
            }
            const intersection = rangeIntersection(this._rangeShiftToSourceRange(shift), key);
            if (intersection === null) {
                if (hasFoundIntersection) {
                    break;
                }
                else {
                    continue;
                }
            }
            hasFoundIntersection = true;
            results.push({
                start: shift.to + (intersection.start - shift.from),
                length: intersection.length,
            });
            endOfLastRange = shift.from + shift.length;
        }
        if (endOfLastRange < key.start + key.length) {
            results.push({
                start: endOfLastRange,
                length: (key.start + key.length) - endOfLastRange,
            });
        }
        return results;
    }
    _rangeShiftToSourceRange(shift) {
        return {
            start: shift.from,
            length: shift.length
        };
    }
}
const CSS_COLOR_NAMES = Object.keys({
    AliceBlue: '#F0F8FF',
    AntiqueWhite: '#FAEBD7',
    Aqua: '#00FFFF',
    Aquamarine: '#7FFFD4',
    Azure: '#F0FFFF',
    Beige: '#F5F5DC',
    Bisque: '#FFE4C4',
    Black: '#000000',
    BlanchedAlmond: '#FFEBCD',
    Blue: '#0000FF',
    BlueViolet: '#8A2BE2',
    Brown: '#A52A2A',
    BurlyWood: '#DEB887',
    CadetBlue: '#5F9EA0',
    Chartreuse: '#7FFF00',
    Chocolate: '#D2691E',
    Coral: '#FF7F50',
    CornflowerBlue: '#6495ED',
    Cornsilk: '#FFF8DC',
    Crimson: '#DC143C',
    Cyan: '#00FFFF',
    DarkBlue: '#00008B',
    DarkCyan: '#008B8B',
    DarkGoldenRod: '#B8860B',
    DarkGray: '#A9A9A9',
    DarkGrey: '#A9A9A9',
    DarkGreen: '#006400',
    DarkKhaki: '#BDB76B',
    DarkMagenta: '#8B008B',
    DarkOliveGreen: '#556B2F',
    DarkOrange: '#FF8C00',
    DarkOrchid: '#9932CC',
    DarkRed: '#8B0000',
    DarkSalmon: '#E9967A',
    DarkSeaGreen: '#8FBC8F',
    DarkSlateBlue: '#483D8B',
    DarkSlateGray: '#2F4F4F',
    DarkSlateGrey: '#2F4F4F',
    DarkTurquoise: '#00CED1',
    DarkViolet: '#9400D3',
    DeepPink: '#FF1493',
    DeepSkyBlue: '#00BFFF',
    DimGray: '#696969',
    DimGrey: '#696969',
    DodgerBlue: '#1E90FF',
    FireBrick: '#B22222',
    FloralWhite: '#FFFAF0',
    ForestGreen: '#228B22',
    Fuchsia: '#FF00FF',
    Gainsboro: '#DCDCDC',
    GhostWhite: '#F8F8FF',
    Gold: '#FFD700',
    GoldenRod: '#DAA520',
    Gray: '#808080',
    Grey: '#808080',
    Green: '#008000',
    GreenYellow: '#ADFF2F',
    HoneyDew: '#F0FFF0',
    HotPink: '#FF69B4',
    IndianRed: '#CD5C5C',
    Indigo: '#4B0082',
    Ivory: '#FFFFF0',
    Khaki: '#F0E68C',
    Lavender: '#E6E6FA',
    LavenderBlush: '#FFF0F5',
    LawnGreen: '#7CFC00',
    LemonChiffon: '#FFFACD',
    LightBlue: '#ADD8E6',
    LightCoral: '#F08080',
    LightCyan: '#E0FFFF',
    LightGoldenRodYellow: '#FAFAD2',
    LightGray: '#D3D3D3',
    LightGrey: '#D3D3D3',
    LightGreen: '#90EE90',
    LightPink: '#FFB6C1',
    LightSalmon: '#FFA07A',
    LightSeaGreen: '#20B2AA',
    LightSkyBlue: '#87CEFA',
    LightSlateGray: '#778899',
    LightSlateGrey: '#778899',
    LightSteelBlue: '#B0C4DE',
    LightYellow: '#FFFFE0',
    Lime: '#00FF00',
    LimeGreen: '#32CD32',
    Linen: '#FAF0E6',
    Magenta: '#FF00FF',
    Maroon: '#800000',
    MediumAquaMarine: '#66CDAA',
    MediumBlue: '#0000CD',
    MediumOrchid: '#BA55D3',
    MediumPurple: '#9370DB',
    MediumSeaGreen: '#3CB371',
    MediumSlateBlue: '#7B68EE',
    MediumSpringGreen: '#00FA9A',
    MediumTurquoise: '#48D1CC',
    MediumVioletRed: '#C71585',
    MidnightBlue: '#191970',
    MintCream: '#F5FFFA',
    MistyRose: '#FFE4E1',
    Moccasin: '#FFE4B5',
    NavajoWhite: '#FFDEAD',
    Navy: '#000080',
    OldLace: '#FDF5E6',
    Olive: '#808000',
    OliveDrab: '#6B8E23',
    Orange: '#FFA500',
    OrangeRed: '#FF4500',
    Orchid: '#DA70D6',
    PaleGoldenRod: '#EEE8AA',
    PaleGreen: '#98FB98',
    PaleTurquoise: '#AFEEEE',
    PaleVioletRed: '#DB7093',
    PapayaWhip: '#FFEFD5',
    PeachPuff: '#FFDAB9',
    Peru: '#CD853F',
    Pink: '#FFC0CB',
    Plum: '#DDA0DD',
    PowderBlue: '#B0E0E6',
    Purple: '#800080',
    RebeccaPurple: '#663399',
    Red: '#FF0000',
    RosyBrown: '#BC8F8F',
    RoyalBlue: '#4169E1',
    SaddleBrown: '#8B4513',
    Salmon: '#FA8072',
    SandyBrown: '#F4A460',
    SeaGreen: '#2E8B57',
    SeaShell: '#FFF5EE',
    Sienna: '#A0522D',
    Silver: '#C0C0C0',
    SkyBlue: '#87CEEB',
    SlateBlue: '#6A5ACD',
    SlateGray: '#708090',
    SlateGrey: '#708090',
    Snow: '#FFFAFA',
    SpringGreen: '#00FF7F',
    SteelBlue: '#4682B4',
    Tan: '#D2B48C',
    Teal: '#008080',
    Thistle: '#D8BFD8',
    Tomato: '#FF6347',
    Turquoise: '#40E0D0',
    Violet: '#EE82EE',
    Wheat: '#F5DEB3',
    White: '#FFFFFF',
    WhiteSmoke: '#F5F5F5',
    Yellow: '#FFFF00',
    YellowGreen: '#9ACD32',
}).sort(() => Math.random() - 0.5);
const [seedsStringWithLabel, ...mapStrings] = input.split('\r\n\r\n');
const [_, seedsString] = seedsStringWithLabel.split(':');
const seedNumbers = seedsString.trim().split(' ').map(seedString => +seedString);
const seedRanges = seedNumbers
    .map((seedNumber, i) => i % 2 === 0
    ? { start: seedNumber, length: seedNumbers[i + 1] }
    : null)
    .filter(range => range);
const maps = mapStrings.map(mapString => {
    const [_, ...shiftStrings] = mapString.split('\r\n');
    const shifts = shiftStrings.map(shiftString => {
        const [to, from, length] = shiftString.split(' ').map(shiftNumberString => +shiftNumberString);
        return {
            from,
            to,
            length,
        };
    });
    return new RangeMap(shifts);
});
const locationRanges = maps.reduce((prev, map) => {
    console.log(`Num ranges: ${prev.length}`);
    displayShifts(prev, []);
    const ranges = prev.flatMap(prevRange => map.get(prevRange));
    return unify(ranges);
}, seedRanges);
displayShifts(locationRanges, []);
const minimumLocation = Math.min(...locationRanges.map(locationRange => locationRange.start));
console.log(minimumLocation);
function unify(ranges) {
    const sortedRanges = ranges.sort((a, b) => a.start - b.start);
    const unifiedRanges = [];
    for (let i = 0; i < sortedRanges.length; i++) {
        const lastUnifiedRange = unifiedRanges[unifiedRanges.length - 1];
        if (lastUnifiedRange === undefined) {
            unifiedRanges.push(sortedRanges[i]);
            continue;
        }
        const intersection = rangeIntersection(lastUnifiedRange, sortedRanges[i]);
        if (intersection === null) {
            unifiedRanges.push(sortedRanges[i]);
            continue;
        }
        unifiedRanges.pop();
        unifiedRanges.push({
            start: lastUnifiedRange.start,
            length: sortedRanges[i].length + (sortedRanges[i].start - lastUnifiedRange.start)
        });
    }
    return unifiedRanges;
}
function rangeIntersection(a, b) {
    if (b.start < a.start) {
        return rangeIntersection(b, a);
    }
    if (b.start >= a.start + a.length) {
        return null;
    }
    if (b.start + b.length < a.start + a.length) {
        return {
            start: b.start,
            length: b.length,
        };
    }
    return {
        start: b.start,
        length: a.start + a.length - b.start,
    };
}
function displayShifts(before, after) {
    const stringLength = 100;
    let beforeStr = new Array(stringLength).fill(' ').join('');
    for (const range of before) {
        const startIndex = Math.floor(range.start * stringLength / max);
        const endIndex = Math.floor((range.start + range.length) * stringLength / max);
        beforeStr = beforeStr.substring(0, startIndex) + new Array(endIndex - startIndex).fill('-').join('') + beforeStr.substring(endIndex);
    }
    console.log(beforeStr);
}
function sortRanges(ranges) {
    return ranges.sort((a, b) => a.start = b.start);
}
// range map needs to return a set of ranges, possibly splitting a range into multiple groups
//  this includes a range intersection operation
// for efficiency: after each mapping, we should run a unify operation to combine overlapping ranges (also one at the beginning)
//  we'd need to sort them by starting number first
//# sourceMappingURL=main.js.map