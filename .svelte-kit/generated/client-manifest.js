export { matchers } from './client-matchers.js';

export const components = [
	() => import("../../src/routes/__layout.svelte"),
	() => import("../runtime/components/error.svelte"),
	() => import("../../src/routes/index.svelte"),
	() => import("../../src/routes/uc07-1.svelte"),
	() => import("../../src/routes/uc07.svelte"),
	() => import("../../src/routes/uc10.svelte"),
	() => import("../../src/routes/uc10_1.svelte"),
	() => import("../../src/routes/uc10_2.svelte")
];

export const dictionary = {
	"": [[0, 2], [1]],
	"uc07-1": [[0, 3], [1]],
	"uc07": [[0, 4], [1]],
	"uc10": [[0, 5], [1]],
	"uc10_1": [[0, 6], [1]],
	"uc10_2": [[0, 7], [1]]
};