import * as fs from 'fs';

// main('./inex1.txt');
// main('./inex2.txt');
main('./in.txt');

type moduleType = 'broadcast' | 'conj' | 'flipflop';
type moduleBase = {
    out: string[]
};
type pulse = {
    from: string,
    to: string,
    high: boolean
}
type conjModule = moduleBase & {
    type: 'conj',
    mostRecentIn: {[label: string]: boolean}
}
type flipflopModule = moduleBase & {
    type: 'flipflop',
    state: 'on' | 'off',
}
type broadcastModule = moduleBase & {
    type: 'broadcast',
};
type module = conjModule | flipflopModule | broadcastModule;

function main(path: fs.PathOrFileDescriptor) {
    const input = fs.readFileSync(path, 'utf-8');
    const modulesWithLabels: [string, module][] = input.split('\r\n').map(inputLine => {
        const [rawLabel, outStr] = inputLine.split(' -> ');
        const out = outStr.split(', ');
        if (rawLabel === 'broadcaster') {
            return [
                rawLabel,
                { type: 'broadcast', out } as module
            ];
        }
    
        if (rawLabel[0] === '%') {
            return [rawLabel.slice(1), {
                type: 'flipflop',
                state: 'off',
                out,
            } as module];
        }
    
        return [rawLabel.slice(1), {
            type: 'conj',
            mostRecentIn: {},
            out
        } as module];
    })
    
    const modules = Object.fromEntries(modulesWithLabels);

    // initialize conj modules
    for (const [label, outModule] of modulesWithLabels) {
        const inModules = outModule.out.map(outLabel => modules[outLabel]).filter(module => module);
        for (const inModule of inModules) {
            if (inModule.type !== 'conj') {
                continue;
            }
    
            inModule.mostRecentIn[label] = false;
        }
    }
    const precursors = ['nh', 'dr', 'xm', 'tr'];
    let rxHit = false;
    let totalButtonPresses = 0;
    const statesSeen = new Set<string>();
    while (!rxHit) {
        if (totalButtonPresses % 10_000 === 0) {
            console.log(totalButtonPresses);
        }
        const pulses: pulse[] = [{ to: 'broadcaster', high: false, from: '' }];
        totalButtonPresses++;
        while (pulses.length) {
            const pulse = pulses.shift();
            const resultingPulses = getResultingPulses(pulse);
            if (resultingPulses.find(pulse => pulse.to === 'rx' && !pulse.high)) {
                rxHit = true;
                break;
            }
            const precursorsHit = resultingPulses.filter(pulse => precursors.includes(pulse.from) && pulse.high);
            if (precursorsHit.length) {
                console.log(precursorsHit.map(precursor => precursor.from).join(',') + ' ' + totalButtonPresses);
            }
            pulses.push(...resultingPulses);
        }
        const strKey = JSON.stringify(modules);
        if (statesSeen.has(strKey)) {
            console.log(strKey);
            break;
        }
        statesSeen.add(strKey);
    }
    
    console.log(totalButtonPresses);
    
    function getResultingPulses(pulse: pulse): pulse[] {
        const module = modules[pulse.to];
        
        if (!module) {
            return [];
        }
    
        switch(module.type) {
            case 'broadcast':
                return module.out.map(outLabel => ({
                    to: outLabel,
                    from: pulse.to,
                    high: pulse.high
                }));
            case 'flipflop':
                if (pulse.high) {
                    return [];
                }
                module.state = module.state === 'on' ? 'off' : 'on';
    
                return module.out.map(outLabel => ({
                    to: outLabel,
                    from: pulse.to,
                    high: module.state === 'on',
                }));
            case 'conj':
                module.mostRecentIn[pulse.from] = pulse.high;
    
                const shouldSendHigh = !Object.values(module.mostRecentIn).every(isHigh => isHigh);
                return module.out.map(outLabel => ({
                    to: outLabel,
                    from: pulse.to,
                    high: shouldSendHigh
                }));
        }
    }
}