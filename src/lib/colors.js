export let c1 = "#1984c5"
export let c2 = "#6cd4c5"
export let c3 = "orange"
export let c4 = "#c80064"

export function byCategory(cat) {
    switch (cat) {
        case "Poor": return c1;
        case "Fair": return c2;
        case "Good": return c3;
        case "Excellent": return c4;
    }
}