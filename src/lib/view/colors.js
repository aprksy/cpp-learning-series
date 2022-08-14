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
    }
}

export function byDelta(delta) {
    switch (delta) {
        case "Upgrade": return c2;
        case "Unchange": return c3;
        case "Degrade": return c4;
    }
}

export function byStatus(status) {
    switch (status) {
        case "Safe": return c2;
        case "Unsafe": return c4;
        case "Fatal": return 'black';
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