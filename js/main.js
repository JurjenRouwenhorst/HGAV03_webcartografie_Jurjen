// comment //
// alert('Hello,world');
// console.log('Hello world!');
// let message;
// message = 'Hello';
// alert(message);

// Leafletkaart
const LeafletMap = L.map('Leaflet-Map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(LeafletMap);

//OpenLayerskaart
const openLayersMap = new ol.Map({
    target: 'openLayers-map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.
        fromLonLat([5.84447,51.04011
        ]),
        zoom: 15
    })
});