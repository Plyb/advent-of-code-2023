import * as fs from 'fs';

main('./23/inex.txt');
main('./23/inex1.txt');
main('./23/inex2.txt');
main('./23/inex3.txt');
main('./23/in.txt');

type cell = '.' | '#' | '>' | 'v';
type grid = cell[][];

function main(filePath: fs.PathOrFileDescriptor) {
    const input = fs.readFileSync(filePath, 'utf-8');

    const grid: grid = input.split('\r\n').map(inputLine => inputLine.split('') as cell[]);
    
    type loc = [number, number];
    type node = {
        succs: Map<nodeKey, weight>,
        preds: Map<nodeKey, weight>,
        loc: loc,
    }
    type nodeKey = string;
    type weight = number;
    type nodeGrid = (node | null)[][];
    
    const nodeGrid: nodeGrid = grid.map((row, y) => row.map((cell, x) => cell === '#'
        ? null
        : {
            succs: new Map(),
            preds: new Map(),
            loc: [y, x],
            weight: 1
        }));
    let nodes: node[] = nodeGrid.flat().filter(node => node !== null);
    const exitNode = nodes.find(node => node.loc[0] === grid.length - 1);
    const entranceNode = nodes.find(node => node.loc[0] === 0);
        
    function getAt<T>(grid: T[][], loc: loc): T {
        if (grid === undefined) {
            return null;
        }
    
        if (loc[0] < 0 || loc[0] >= grid.length || loc[1] < 0 || loc[1] >= grid[0].length) {
            return null;
        }
    
        return grid[loc[0]][loc[1]];
    }
        
    function addLoc(a: loc, b: loc): loc {
        return [a[0] + b[0], a[1] + b[1]];
    }
    
    function getNeighbors<T>(grid: T[][], loc: loc) {
        return [
            getAt(grid, addLoc(loc, [-1, 0])),
            getAt(grid, addLoc(loc, [0, -1])),
            getAt(grid, addLoc(loc, [0, 1])),
            getAt(grid, addLoc(loc, [1, 0])),
        ]
    }
    
    // set up edges
    for (const node of nodes) {
        const cell = getAt(grid, node.loc);
        if (cell === '>') {
            const right = getAt(nodeGrid, addLoc(node.loc, [0, 1]));
            if (right !== null) {
                node.succs.set(getKey(right), 1);
                right.preds.set(getKey(node), 1);
            }
            continue;
        } else if (cell === 'v') {
            const down = getAt(nodeGrid, addLoc(node.loc, [1, 0]))
            if (down !== null) {
                node.succs.set(getKey(down), 1);
                down.preds.set(getKey(node), 1);
            }
            continue;
        }
    
        const neighbors = getNeighbors(nodeGrid, node.loc).filter(node => node !== null);
        for (const neighbor of neighbors) {
            node.succs.set(getKey(neighbor), 1);
            neighbor.preds.set(getKey(node), 1);
        }
    }
    
    function getKey(node: node) {
        return node.loc[0] + '-' + node.loc[1];
    }
    
    // contract edges
    let previousNodesLength = -1;
    while (previousNodesLength !== nodes.length) {
        previousNodesLength = nodes.length;
    
        for (const node of nodes) {
            const nodeKey = getKey(node);
            if (isContractable(node)) {
                for (const [predKey, predWeight] of node.preds) {
                    const pred = getFromKey(nodeGrid, predKey);
                    for (const [succKey, succWeight] of node.succs) {
                        if (succKey === predKey) {
                            continue;
                        }
    
                        const succ = getFromKey(nodeGrid, succKey);
            
                        pred.succs.set(succKey, predWeight + succWeight);
                        pred.succs.delete(nodeKey);
                        pred.preds.delete(nodeKey);
                        succ.preds.set(predKey, predWeight + succWeight);
                        succ.preds.delete(nodeKey);
                        succ.succs.delete(nodeKey);
                    }
                }
            }
        }
    
        nodes = nodes.filter(node => !isContractable(node));
    }
    
    function isContractable(node: node) {
        const cell = getAt(grid, node.loc)
        if (cell === '.') {
            return node.succs.size === 2;
        } else {
            return true; // This is based on visual inspection of the input data;
        }
    }
    
    function getFromKey(nodeGrid: nodeGrid, nodeKey: nodeKey) {
        const loc = nodeKey.split('-').map(coordStr => +coordStr) as loc;
        return getAt(nodeGrid, loc);
    }
    
    type path = {
        nodes: node[],
        pathLength: number,
    };
    
    function findAllPaths(pathSoFar: path): path[] {
        const lastNode = pathSoFar.nodes[pathSoFar.nodes.length - 1];
        if (lastNode === exitNode) {
            return [pathSoFar];
        }
    
        const unusedSuccessors = [...lastNode.succs.keys()]
            .map(succKey => getFromKey(nodeGrid, succKey))
            .filter(succ => !pathSoFar.nodes.includes(succ));
        if (unusedSuccessors.length === 0) {
            return [];
        }
    
        return unusedSuccessors.flatMap(succ => findAllPaths({
            nodes: [...pathSoFar.nodes, succ],
            pathLength: pathSoFar.pathLength + lastNode.succs.get(getKey(succ)),
        }));
    }
    
    const paths = findAllPaths({ nodes: [entranceNode], pathLength: 0 });
    const longestPath = paths.reduce((longestSoFar, path) =>
        path.pathLength > longestSoFar.pathLength ? path : longestSoFar,
        { pathLength: 0 } as path
    );
    const pathLength = longestPath.pathLength;
    console.log(pathLength);
}
