import * as color from "$lib/colors";

export const mainMap = {
    id: 'main-map',
    width: 664,
    height: 678,
    // center: [-6.175392, 106.827153], // Jakarta
    center: [3.597031, 98.678513], // Medan
    zoom: 13,
    drawControls: true,
    drawnItems: null,
    tileLayerGroupActual: null,
    tileLayerGroupSimulation: null,
    tileLayerGroupDelta: null,
    map: null,
}

export const addMap = {
    id: 'add-map',
    width: 670,
    height: 600,
    center: [-6.175392, 106.827153],
    zoom: 13,
    drawControls: false,
    drawnItems: null,
    map: null,
}

export const editMap = {
    id: 'edit-map',
    width: 670,
    height: 550,
    center: [-6.175392, 106.827153],
    zoom: 13,
    drawControls: true,
    drawnItems: null,
    map: null,
}

export const deleteMap = {
    id: 'delete-map',
    width: 670,
    height: 600,
    center: [-6.175392, 106.827153],
    zoom: 13,
    drawControls: false,
    drawnItems: null,
    map: null,
}

export const beforeMap = {
    id: 'before-map',
    width: 390,
    height: 400,
    center: [-6.175392, 106.827153],
    zoom: 13,
    drawControls: false,
    drawnItems: null,
    tileLayerGroupActual: null,
    tileLayerGroupSimulation: null,
    tileLayerGroupDelta: null,
    map: null,
}

export const afterMap = {
    id: 'after-map',
    width: 390,
    height: 400,
    center: [-6.175392, 106.827153],
    zoom: 13,
    drawControls: false,
    drawnItems: null,
    tileLayerGroupActual: null,
    tileLayerGroupSimulation: null,
    tileLayerGroupDelta: null,
    map: null,
}

export const deltaMap = {
    id: 'delta-map',
    width: 520,
    height: 400,
    center: [-6.175392, 106.827153],
    zoom: 13,
    drawControls: false,
    drawnItems: null,
    tileLayerGroupActual: null,
    tileLayerGroupSimulation: null,
    tileLayerGroupDelta: null,
    map: null,
}

export function clearMap(obj) {
    obj.drawnItems.clearLayers();
}

export function redrawMap(obj, data) {
    if (data) {
        clearMap(obj);
        data.forEach(el => {
            L.geoJson(el, {
                onEachFeature: function (feature, layer) {
                    obj.drawnItems.addLayer(layer);
                    var bounds = layer.getBounds();
                    obj.map.fitBounds(bounds);
                }
            });
        });
    }
}

export function drawBoundary(mapObj, mapData) {
    if (mapData) {
        let style = {
            stroke: true,
            // color: "#000",
            opacity: 0.7,
            weight: 2,
        }
        if (mapData.areaType == "geojson") {
            clearMap(mapObj);
            let boundary = L.geoJson(mapData.data, {style: style}).addTo(mapObj.map);
            mapObj.drawnItems.addLayer(boundary);
            // mapData.data.features.forEach(el => {
            //     L.geoJson(el, {
            //         onEachFeature: function (feature, layer) {
            //             mapObj.drawnItems.addLayer(layer);
            //         }
            //     });
            // });
            var bounds = boundary.getBounds();
            mapObj.map.fitBounds(bounds);
        } else if (mapData.areaType == "circle") {
            console.log(mapData)
            clearMap(mapObj);
            let boundary = L.circle([mapData.data.lat, mapData.data.lng], mapData.data.radius).addTo(mapObj.map);
            mapObj.drawnItems.addLayer(boundary);
            var bounds = boundary.getBounds();
            mapObj.map.fitBounds(bounds);
        }
    }
}

export function drawTileKpi(mapObj, tileValues, tileLoc) {
    if (tileValues) {
        for (const [key, value] of Object.entries(tileValues)) {
            let lat = tileLoc[key].lat
            let lng = tileLoc[key].lng

            let tile = L.circle([lat, lng], {radius: 18.5}).setStyle({
                stroke: false,
                weight: 1, 
                color: "#000",
                fillOpacity: 0.6,
                fillColor: color.byCategory(value.category1),
            });
            mapObj.drawnItems.addLayer(tile);
        }
    }
}

let myIcon;

export function drawSites(mapObj, data) {
    myIcon = L.icon({
        iconUrl: 'map-marker-icon-gray.png',
        iconSize: [18, 30], // size of the icon
    });
    // data.forEach((e, i) => {
    //     let marker = L.marker([e.lng, e.lat], {icon: myIcon});
    //     marker.bindPopup(e.text);
    //     mapObj.drawnItems.addLayer(marker);
    // })
    for (const [key, value] of Object.entries(data)) {
        let marker = L.marker([value.lat, value.lng]);
        marker.bindPopup(value.name);
        mapObj.drawnItems.addLayer(marker);
    }
}

export let markerGroup;
function clearMarkers(obj) {
    obj.drawnItems.removeLayer(markerGroup);
}

export function setupMap(obj) {
    obj.map = L.map(obj.id).setView(obj.center, obj.zoom);
    L.tileLayer('http://192.168.200.25/hot/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(obj.map);
    obj.drawnItems = new L.FeatureGroup();
    // beforeMap.drawnItems = new L.FeatureGroup();
    // afterMap.drawnItems = new L.FeatureGroup();
    // deleteMap.drawnItems = new L.FeatureGroup();

    obj.map.addLayer(obj.drawnItems);
    
    if (obj.drawControls) {
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
                featureGroup: obj.drawnItems,
                remove: true
            }
        });
    obj.map.addControl(drawControl);
    obj.map.on('draw:created', function (e) {
            var type = e.layerType,
                layer = e.layer;
         if (type === 'marker') {
                layer.bindPopup('A popup!');
            }
            obj.drawnItems.addLayer(layer);
            obj.map.fitBounds(layer.getBounds());

            // beforeMap.map.fitBounds(layer.getBounds());
            // afterMap.map.fitBounds(layer.getBounds());
            // deltaMap.map.fitBounds(layer.getBounds());

            let result;
         // sel.type = type;
            switch (type) {
                case 'polyline':
                    // layer.editing.latlngs.forEach(element => {
                    //     sel.coords.push(element);
                    // });
                    break;
                case 'polygon':
                    // sendReqsToGeosvr("01", "geojson", layer.toGeoJSON())
                    // layer.editing.latlngs[0][0].forEach(element => {
                    //    sel.coords.push(element);
                    // });
                    break;
                case 'rectangle':
                    // sendReqsToGeosvr("01", "geojson", layer.toGeoJSON())
                    // layer.editing._shape._latlngs[0].forEach(element => {
                    //     sel.coords.push(element);
                    // });
                    break;
                case 'circle':
                    // sel.coords.push(layer.editing._shape._latlng);
                    // sel.radius = layer.editing._shape._mRadius;
                    break;
                default:
            }
            // let gjson = layer.toGeoJSON()
            // doPost(gjson)
        });
        obj.map.on('draw:edited', function (e) {
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