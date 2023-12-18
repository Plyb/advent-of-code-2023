import * as fs from 'fs';
import MinHeap from './minheap';

const input = fs.readFileSync('./in.txt', 'utf-8');
type city = number[][];
const cityMap: city = input.split('\r\n').map(inputLine =>
    inputLine.split('').map(char => +char)
);

type dir = [1, 0] | [-1, 0] | [0, 1] | [0, -1];

const left: dir = [0, -1];
const up: dir = [-1, 0];
const right: dir = [0, 1];
const down: dir = [1, 0];

type loc = [number, number];
type straight = 0 | 1 | 2 | 3 | 4;
type Path = {
    loc: loc,
    dir: dir,
    straight: straight,
    cost: number,
    pred: Path | null,
}

class PathCosts {
    _pathCosts: Map<dir, {[straight: number]: Path}>[][];
    _pathHeap: MinHeap<Path> = new MinHeap<Path>((a, b) => ((b.cost + this._heuristic(b)) - (a.cost + this._heuristic(a)))
        || (a.dir === b.dir ? b.straight - a.straight : 0));

    _heuristic(path: Path) {
        return (this._pathCosts.length - path.loc[0]) + (this._pathCosts[0].length - path.loc[1])
    }

    constructor(city: city) {
        this._pathCosts = new Array(city.length).fill(null).map(() =>
            new Array(city[0].length).fill(null).map(() => {
                const map = new Map<dir, {[straight: number]: Path}>();
                map.set(up, {});
                map.set(down, {});
                map.set(left, {});
                map.set(right, {});
                return map;
            })
        )
    }

    getCost(loc: loc, dir: dir, straight: straight) {
        return getAt(this._pathCosts, loc)?.get(dir)?.[straight] ?? Number.POSITIVE_INFINITY;
    }

    setCost(loc: loc, dir: dir, straight: straight, cost: number, pred: Path | null) {
        const straightMap = getAt(this._pathCosts, loc).get(dir);
        if (cost < (straightMap[straight]?.cost ?? Number.POSITIVE_INFINITY)) {
            straightMap[straight] = { loc, dir, straight, cost, pred };
            this._pathHeap.add({
                loc,
                dir,
                straight,
                cost,
                pred,
            });
        }
    }

    popMinPath(): Path {
        return this._pathHeap.remove();
    }

    pathsRemain(): boolean {
        return this._pathHeap.peek() !== null
            && [...this._pathCosts[this._pathCosts.length - 1][this._pathCosts[0].length - 1].values()].flatMap(mapValue =>
                Object.entries(mapValue).filter(([straight, path]) => straight as unknown as number >= 4 && straight as unknown as number <= 10).map(([straight, path]) => path)
            ).every(path => path.cost > this._pathHeap.peek().cost);
    }
}

const paths = new PathCosts(cityMap);
paths.setCost([0, 0], right, 0, 0, null);
paths.setCost([0, 0], down, 0, 0, null);
while (paths.pathsRemain()) {
    let path = paths.popMinPath();
    const neighbors = getNeighbors(cityMap, path.loc, path.dir, path.straight).filter(path => path.cost < Number.POSITIVE_INFINITY);
    for (const neighbor of neighbors) {
        const cost = neighbor.cost + path.cost;
        paths.setCost(neighbor.loc, neighbor.dir, neighbor.straight, cost, path);
    }
}
let minPath = [...paths._pathCosts[paths._pathCosts.length - 1][paths._pathCosts[0].length -1].values()].flatMap(map => Object.entries(map).filter(([straight, path]) => straight as unknown as number >= 4 && straight as unknown as number <= 10).map(([straight, path]) => path)).sort((b, a) => b.cost - a.cost)[0];
console.log(minPath.cost);

// visualize the path for fun
const pathArray = new Array(cityMap.length).fill(null).map(() => new Array(cityMap[0].length).fill('.'));
while (minPath != null) {
    pathArray[minPath.loc[0]][minPath.loc[1]] = '#';
    minPath = minPath.pred;
}
console.log(pathArray.map(row => row.join('')).join('\n'));

function getNeighbors<T>(grid: T[][], loc: loc, dir: dir, straight: straight) {
    const dirs = [up, right, down, left];
    return dirs.map(dirOption => {
        const newLoc = coordAdd(loc, dirOption);
        function getCost() {
            if (dirOption === dir && straight >= 10) {
                return Number.POSITIVE_INFINITY;
            }
            if (dirOption !== dir && straight < 4) {
                return Number.POSITIVE_INFINITY;
            }
            if (isOpposite(dir, dirOption)) {
                return Number.POSITIVE_INFINITY;
            }
            return getAt(grid, newLoc) ?? Number.POSITIVE_INFINITY;
        }
        const cost = getCost();

        return {
            dir: dirOption, 
            cost,
            loc: newLoc,
            straight: dir === dirOption ? straight + 1 : 1,
        } as Path;
    })

    function isOpposite(a: dir, b: dir) {
        return a === dirs[(dirs.indexOf(b) + 2) % 4];
    }
}

function getAt<T>(grid: T[][], loc: loc) {
    if (loc[0] < 0 || loc[0] >= grid.length || loc[1] < 0 || loc[1] >= grid[0].length) {
        return undefined;
    }

    return grid[loc[0]][loc[1]];
}

function coordAdd(loc: loc, dir: dir): loc {
    return [loc[0] + dir[0], loc[1] + dir[1]];
}

