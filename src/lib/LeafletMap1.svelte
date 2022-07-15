<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
    crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
    integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
    crossorigin=""></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet-draw@0.4.2/dist/leaflet.draw.css" />
    <script src="https://unpkg.com/leaflet-draw@0.4.2/dist/leaflet.draw.js"></script>
</svelte:head>
<script>
// @ts-nocheck

    import { onMount } from 'svelte';
    import { browser } from '$app/env';

    let drawnItems;
    let globalL;
    let globalMap; 

    export let id="mymap";
    export let width=800;
    export let height=800;
    export let drawControls=false;
    export let center = [-6.175392, 106.827153];
    export let zoom = 13;

    export const layers = {
        clear() {
            drawnItems.clearLayers();
        },
        redraw(data) {
            if (data) {
                this.clear();
                data.forEach(el => {
                    var myLayer = globalL.geoJSON();
                    myLayer.addData(el);
                    drawnItems.addLayer(myLayer);
                    var bounds = myLayer.getBounds();
                    globalMap.fitBounds(bounds);
                });
            }
        }
    }

    let sel = {
        type: "",
        coords: [],
        radius: 0,
        area: 0,
        tileCount: 0,
        cellCount: 0,
        cellNames: [],
        siteCount: 0,
        siteCoords: {},
        siteData: {},
    }

    let cellLayers = {}
    let siteLayers = {}

    // function setObjects(data) {
    //     objects.set(data);
    // }

    // function drawTiles(sites, siteCoords, cellData) {
    //     for (let sname in sites) {
    //         siteLayers[sname] = globalL.layerGroup([])
    //         let opt1 = {
    //             className: sname,
    //             stroke: false,
    //             fillOpacity: 1.0,
    //             fillColor: "#ff00ff",
    //         }
    //         let coord = siteCoords[sname]
    //         if (coord && coord.length > 1) {
    //             let site = globalL.marker([coord[0], coord[1]]);
    //             siteLayers[sname].addLayer(site);
    //         }

    //         // console.log("site:",sname);
    //         let cells = sites[sname]
    //         for (let cname in cells) {
    //             cellLayers[cells[cname]] = globalL.layerGroup([])
    //             // console.log("cells:",cells[cname]);
    //             cellData[cells[cname]].tiles.forEach(t => {
    //                 let opt = {
    //                     className: cells[cname],
    //                     stroke: false,
    //                     fillOpacity: 0.6,
    //                     fillColor: t.rsrp >= -92 ? "#4400ff": t.rsrp >= -102 ? "green" : t.rsrp >= -110 ? "yellow": "red",
    //                 }
    //                 let circle = globalL.circle([t.lat, t.lng], 18.5, opt);
    //                 cellLayers[cells[cname]].addLayer(circle);
    //             }) 
    //         }
    //         for (let cl in cellLayers) {
    //             cellLayers[cl].addTo(siteLayers[sname])
    //         }
    //     }
    //     for (let sl in siteLayers) {
    //         siteLayers[sl].addTo(globalMap)
    //     }
    // }

    // let result = null
    // async function doPost (boundary) {
	// 	const res = await fetch('http://127.0.0.1:9301/get-all-tiles?regional=R03', {
	// 		method: 'POST',
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
	// 		body: JSON.stringify(boundary)
	// 	})
	// 	result = await res.json()
    //     // setObjects(result);
    //     // drawTiles(result.siteData, result.siteCoords, result.cellData)
    //     // console.log(JSON.stringify($objects));
	// }

    onMount(async () => {
        if(browser) {
            globalL = L;
            globalMap = globalL.map(id).setView(center, zoom);

            globalL.tileLayer('http://192.168.200.25/hot/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(globalMap);

            drawnItems = new globalL.FeatureGroup();
            globalMap.addLayer(drawnItems);

            if (drawControls) {
                var drawControl = new globalL.Control.Draw({
                    position: 'topright',
                    draw: {
                        polyline: {
                            metric: true
                        },
                        polygon: {
                            allowIntersection: true,
                            showArea: false,
                            drawError: {
                                //color: '#b00b00',
                                timeout: 1000
                            },
                            shapeOptions: {
                                color: '#0000ff',
                                fill: false,
                                fillOpacity: 0.1,
                                weight: 2,
                                
                            }
                        },
                        rectangle: {
                            shapeOptions: {
                                showArea: false,
                                fill: false,
                                fillOpacity: 0.1,
                                weight: 2,
                                color: '#0000ff',
                            }
                        },
                        circle: {
                            shapeOptions: {
                                showArea: false,
                                fill: false,
                                fillOpacity: 0.1,
                                weight: 2,
                                color: '#0000ff',
                            }
                        },
                        marker: false
                    },
                    edit: {
                        featureGroup: drawnItems,
                        remove: true
                    }
                });
                globalMap.addControl(drawControl);

                globalMap.on('draw:created', function (e) {
                    console.log(e)
                    var type = e.layerType,
                        layer = e.layer;

                    if (type === 'marker') {
                        layer.bindPopup('A popup!');
                    }
                    drawnItems.addLayer(layer);
                    globalMap.fitBounds(layer.getBounds());

                    sel.type = type;
                    switch (type) {
                        case 'polyline':
                            layer.editing.latlngs.forEach(element => {
                                sel.coords.push(element);
                            });
                            break;
                        case 'polygon':
                            layer.editing.latlngs[0][0].forEach(element => {
                                sel.coords.push(element);
                            });
                            break;
                        case 'rectangle':
                            layer.editing._shape._latlngs[0].forEach(element => {
                                sel.coords.push(element);
                            });
                            break;
                        case 'circle':
                            sel.coords.push(layer.editing._shape._latlng);
                            sel.radius = layer.editing._shape._mRadius;
                            break;
                        default:
                    }
                    //let gjson = layer.toGeoJSON()
                    
                    // doPost(gjson)
                });

                // globalMap.on('draw:edited', function (e) {
                //     var layers = e.layers;
                //     var countOfEditedLayers = 0;
                //     layers.eachLayer(function(layer) {
                //         countOfEditedLayers++;
                //         let gjson = layer.toGeoJSON()
                        
                //         // doPost(gjson)
                //     });
                //     // console.log("Edited " + countOfEditedLayers + " layers");
                // });
            }

            // map.redraw();

            // var coords = []
            // var polygon;
            // var popup = L.popup();
        }
    });
</script>


<main>
    <div id={id} style="width:{width}px; height:{height}px"></div>
</main>

<style>
    @import 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
</style>