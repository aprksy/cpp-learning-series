import { groupLimits } from "$lib/model/defaults";

export let c1 = "#1984c5"
export let c2 = "#4cb4a5"
export let c3 = "orange"
export let c4 = "#c80064"

let colors = [c4, c3, c2, c1];

export function byCategory(cat) {
    switch (cat) {
        case "Poor": return c4;
        case "Fair": return c3;
        case "Good": return c2;
        case "Excellent": return c1;
        case "Undefined": return 'black';
    }
}

export function byDelta(delta) {
    switch (delta) {
        case "UPGRADED": return c2;
        case "UNCHANGE": return c3;
        case "DEGRADED": return c4;
    }
}

export function byStatus(status) {
    switch (status) {
        case "SAFE": return c2;
        case "UNSAFE": return c4;
        case "FATAL": return 'black';
    }
}

export function fromValue(value) {
    let intervals = [];
    for (let i=0; i<groupLimits.length-1; i++) {
        intervals.push([groupLimits[i], groupLimits[i+1]]);
    }

    for (let i=0; i<intervals.length; i++) {
        if (intervals[i][0]<value && value<=intervals[i][1]) {
            return colors[i];
        }
    }
}

export function legends(kind) {
    let result = [];
    switch (kind) {
        case 'original':
            result.push({color:byCategory('Poor'), label: 'Poor'});
            result.push({color:byCategory('Fair'), label: 'Fair'});
            result.push({color:byCategory('Good'), label: 'Good'});
            result.push({color:byCategory('Excellent'), label: 'Excellent'});
            result.push({color:byCategory('Undefined'), label: 'Undefined'});
            break;
        case 'simulation':
            result.push({color:byCategory('Poor'), label: 'Poor'});
            result.push({color:byCategory('Fair'), label: 'Fair'});
            result.push({color:byCategory('Good'), label: 'Good'});
            result.push({color:byCategory('Excellent'), label: 'Excellent'});
            result.push({color:byCategory('Undefined'), label: 'Undefined'});
            break;
        case 'final-status':
            result.push({color:byStatus('SAFE'), label: 'SAFE'});
            result.push({color:byStatus('UNSAFE'), label: 'UNSAFE'});
            result.push({color:byStatus('FATAL'), label: 'FATAL'});
            break;
    
        default:
            break;
    }
    return result;
}