export let c1 = "#1984c5"
export let c2 = "#4cb4a5"
export let c3 = "orange"
export let c4 = "#c80064"

export function byCategory(cat) {
    switch (cat) {
        case "Poor": return c4;
        case "Fair": return c3;
        case "Good": return c2;
        case "Excellent": return c1;
    }
}