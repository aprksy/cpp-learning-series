<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
    crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
    integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
    crossorigin=""></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet-draw@0.4.1/dist/leaflet.draw.css" />
    <script src="https://unpkg.com/leaflet-draw@0.4.1/dist/leaflet.draw.js"></script>
</svelte:head>
<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/env';

    let drawnItems;

    export let id = "my-map";
    export let width = 500;
    export let height = 500;
    export let center = [-6.175392, 106.827153];
    export let zoom = 13;
    export let drawControls = false;

    export const layers = {
        clear() {
            drawnItems.clearLayers();
        },
        redraw(data) {
            // if (data) {
            //     this.clear();
            //     data.forEach(el => {
            //         globalL.geoJson(el, {
            //             onEachFeature: function (feature, layer) {
            //                 drawnItems.addLayer(layer);
            //                 var bounds = layer.getBounds();
            //                 globalMap.fitBounds(bounds);
            //             }
            //         });
            //     });
            // }
        }
    }

    let result = null
    async function doPost (boundary) {
		const res = await fetch('http://127.0.0.1:9301/get-all-tiles?regional=R03', {
			method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
			body: JSON.stringify(boundary)
		})
		result = await res.json()
	}

    
    onMount(async () => {
        if(browser) {
            let map = L.map(id).setView(center, zoom);

            L.tileLayer('http://192.168.200.25/hot/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            drawnItems = new L.FeatureGroup();
            map.addLayer(drawnItems);

            if (drawControls) {
                var selectionType = '';
                var drawControl = new L.Control.Draw({
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
                map.addControl(drawControl);

                map.on('draw:created', function (e) {
                    var type = e.layerType,
                        layer = e.layer;

                    if (type === 'marker') {
                        layer.bindPopup('A popup!');
                    }
                    drawnItems.addLayer(layer);
                    map.fitBounds(layer.getBounds());

                    // sel.type = type;
                    switch (type) {
                        case 'polyline':
                            layer.editing.latlngs.forEach(element => {
                                // sel.coords.push(element);
                            });
                            break;
                        case 'polygon':
                            layer.editing.latlngs[0][0].forEach(element => {
                                // sel.coords.push(element);
                            });
                            break;
                        case 'rectangle':
                            layer.editing._shape._latlngs[0].forEach(element => {
                                // sel.coords.push(element);
                            });
                            break;
                        case 'circle':
                            // sel.coords.push(layer.editing._shape._latlng);
                            // sel.radius = layer.editing._shape._mRadius;
                            break;
                        default:
                    }
                    let gjson = layer.toGeoJSON()
                    // doPost(gjson)
                });

                map.on('draw:edited', function (e) {
                    var layers = e.layers;
                    var countOfEditedLayers = 0;
                    layers.eachLayer(function(layer) {
                        countOfEditedLayers++;
                        let gjson = layer.toGeoJSON()
                        // doPost(gjson)
                    });
                });
            }
        }
    });
</script>


<main>
    <div id={id} style="width:{width}px; height:{height}px;"></div>
</main>

<style>
    @import 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
</style>