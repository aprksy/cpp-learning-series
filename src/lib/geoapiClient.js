import {
    storeBoundaries,
    storeBoundaries_selected,
    storeBoundaryData,
    storeSitesInBoundary,
    storeSiteIdsInBoundary,
    storeSiteDetails,
    storeSiteCells,
    storeSimulation,
} from "$lib/store";
import * as map from "$lib/maps";

const groupNames = ["Poor", "Fair", "Good", "Excellent"];
const groupLimits = [-200, -110, -102, -97, 0];
const minCatIndex = 1;
const tileField = "tileCovmo";

let host = "http://192.168.200.151:9301"
let allBoundaries = host + "/boundaries";
let oneBoundary = host + "/boundaries?id=";
let siteIntersects = host + "/sites/intersects";
let siteDetails = host + "/sites/details";
let siteCells = host + "/sites/cells";
let simulation = host + "/simulation/ui";

export async function fetchBoundaries() {
    const res = await fetch(allBoundaries, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })
    let result = await res.json();
    // transform to {"id":XX, "text": "YYY"}
    let fresult = [];
    result.forEach((e, i) => {
        let e1 = {
            "id": i,
            "text": e,
        }
        fresult.push(e1);
    });
    storeBoundaries.set(fresult);
}

export async function fetchBoundary(id) {
    const res = await fetch(oneBoundary + id, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })
    let result = await res.json();
    map.drawBoundary(map.mainMap, result);
    storeBoundaryData.set(result);
}

export async function fetchSiteIntersects(date, region, boundaryId) {
    const res = await fetch(siteIntersects, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "date": date, 
            "region": region, 
            "boundaryId": boundaryId
        })
    })
    let result = await res.json();
    storeSitesInBoundary.set(result);
    let ids = [];
    result.forEach(e => ids.push(e.id))
    storeSiteIdsInBoundary.set(ids);
    console.log(result)
    console.log(ids)
    fetchSiteDetails(date, region, ids);
    fetchSiteCells(date, region, ids);
    doSimulation(date, region, boundaryId, tileField, groupNames, groupLimits,
        minCatIndex, ids);
}

export async function fetchSiteDetails(date, region, ids) {
    let sites = ids.join(',');
    const res = await fetch(siteDetails, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "date": date, 
            "region": region, 
            "sites": sites,
        })
    })
    let result = await res.json();
    console.log(result)
    storeSiteDetails.set(result);
}

export async function fetchSiteCells(date, region, ids) {
    let sites = ids.join(',');
    const res = await fetch(siteCells, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "date": date, 
            "region": region, 
            "sites": sites,
        })
    })
    let result = await res.json();
    console.log(result)
    storeSiteCells.set(result);
}

export async function doSimulation(date, region, boundaryId, tile, gNames, gLimits, minCatIdx, sites) {
    const res = await fetch(simulation, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "date": date, 
            "region": region, 
            "boundaryId": boundaryId,
            "tile": tile,
            "groupNames": gNames,
            "groupLimits": gLimits,
            "sites": sites,
            "minCatIndex": minCatIdx,
        })
    })
    let result = await res.json();
    console.log(result)
    storeSimulation.set(result);
    map.drawTileKpi(map.mainMap, result["original"]["tiles"], result["tiles"]);
    map.drawSites(map.mainMap, result["sites"]);
}

