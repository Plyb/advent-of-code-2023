import * as fs from 'fs';

const input = fs.readFileSync('./in.txt', 'utf-8');
const [workflowBlock, partBlock] = input.split('\r\n\r\n');

type part = {
    x: number,
    m: number,
    a: number,
    s: number,
}
type compOp = '<' | '>';
type cond = {
    predicate: {
        dimension: dimension,
        compOp: compOp,
        value: number,
    },
    goTo: string,
}
type station = {
    conds: cond[],
    default: string,
}
type workflow = {
    [label: string]: station,
}
type dimension = keyof(part);

type partCuboid = {
    min: part,
    max: part,
}

const workflow: workflow = Object.fromEntries(workflowBlock.split('\r\n').map(workflowLine => {
    const [label, rest] = workflowLine.split('{');
    const condsStr = rest.slice(0, rest.length - 1);
    const condStrsAndDefault = condsStr.split(',');
    const condStrs = condStrsAndDefault.slice(0, condStrsAndDefault.length - 1);
    const defaultLabel = condStrsAndDefault[condStrsAndDefault.length - 1];

    const conds: cond[] = condStrs.map(condStr => {
        const compOp = condStr[1] as compOp;
        const dimension = condStr[0] as dimension;
        const [valueStr, goTo] = condStr.slice(2).split(':');
        const value = +valueStr;

        return {
            predicate: {
                compOp,
                dimension,
                value
            },
            goTo,
        };
    });

    return [label, {
        conds,
        default: defaultLabel,
    }];
}));

const parts: part[] = partBlock.split('\r\n').map(partLine => {
    const descriptionStrings = partLine.slice(1, partLine.length - 1).split(',');
    const descriptionEntries: [dimension, number][] = descriptionStrings.map(descStr => {
        const [dimension, valueStr] = descStr.split('=') as [dimension, string];
        const value = +valueStr;
        return [dimension, value] as [dimension, number];
    });
    return Object.fromEntries(descriptionEntries) as part;
});

// const acceptedParts = parts.filter(part => isPartAccepted(part, workflow, 'in'));
// const totalRating = sum(acceptedParts.map(getPartRating));
const fullCuboid = {
    max: { x: 4001, m: 4001, a: 4001, s: 4001 },
    min: { x: 1, m: 1, a: 1, s: 1 },
};
const totalPassingCombos = countPassingCombinations(fullCuboid, workflow, 'in');
console.log(totalPassingCombos);

function countPassingCombinations(cuboid: partCuboid, workflow: workflow, stationLabel: string): bigint {
    if (stationLabel === 'A') {
        return getHypervolume(cuboid);
    }
    if (stationLabel === 'R') {
        return BigInt(0);
    }

    const station = workflow[stationLabel];
    const { runningTotalPassingCombos, remainingCuboid } =
        station.conds.reduce(({ runningTotalPassingCombos, remainingCuboid }, cond) => {
            const { passing, failing } = splitCuboid(remainingCuboid,
                cond.predicate.dimension,
                cond.predicate.compOp,
                cond.predicate.value
            );
            return {
                runningTotalPassingCombos: runningTotalPassingCombos + countPassingCombinations(passing, workflow, cond.goTo),
                remainingCuboid: failing
            }
        }, { runningTotalPassingCombos: BigInt(0), remainingCuboid: cuboid });
    return runningTotalPassingCombos + countPassingCombinations(remainingCuboid, workflow, station.default);
}

function getHypervolume(cuboid: partCuboid): bigint {
    return BigInt(
        (cuboid.max.x - cuboid.min.x)
        * (cuboid.max.m - cuboid.min.m)
        * (cuboid.max.a - cuboid.min.a)
        * (cuboid.max.s - cuboid.min.s)
    );
}

// function isPartAccepted(part: part, workflow: workflow, stationLabel: string): boolean {
//     const station = workflow[stationLabel];
//     const nextStationLabel = getNextStationLabel(part, station);
//     if (nextStationLabel === 'A') {
//         return true;
//     } else if (nextStationLabel === 'R') {
//         return false;
//     } else {
//         return isPartAccepted(part, workflow, nextStationLabel);
//     }
// }

// function getNextStationLabel(part: part, station: station) {
//     for (const cond of station.conds) {
//         if (cond.predicate(part)) {
//             return cond.goTo;
//         }
//     }
//     return station.default;
// }

// function getPartRating(part: part) {
//     return sum(Object.values(part))
// }

// function sum(arr: number[]) {
//     return arr.reduce((acc, curr) => acc + curr, 0);
// }

function splitCuboid(cuboid: partCuboid, dimension: dimension, compOp: compOp, value: number) {
        const dividingValue = compOp === '>' ? value + 1 : value
        const upper: partCuboid = {
            max: cuboid.max,
            min: {...cuboid.min, [dimension]: dividingValue},
        };
        const lower: partCuboid = {
            max: {...cuboid.max, [dimension]: dividingValue},
            min: cuboid.min,
        };

        return {
            passing: compOp === '>' ? upper : lower,
            failing: compOp === '>' ? lower : upper,
        }
}

/*
take a full 4000^4 cuboid,
pass it to the "in" station
    if the station label is 'A': return the hypervolume
    if the station label is 'R': return 0

    for each cond in conds
        split the cuboid into two
        pass the passing half into the next group
        pass the failing half to the next cond
    sum results from each cond and the default
    return the sum
*/

