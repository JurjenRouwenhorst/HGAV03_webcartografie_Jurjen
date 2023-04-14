// Leafletkaart
const LeafletMap = L.map('leafletmap').setView([51.505, -0.09], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(LeafletMap);


let mijnGeojosnLaag = L.geoJSON().addTo(LeafletMap);

let woonplaatsen = ['Raalte', 'Heeten', 'Heino']
let woonplaatsNaam = woonplaatsen[1];



// Met de free server een ID ophalen
fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${woonplaatsNaam}&rows=10`)
    .then(response => response.json())
    .then(data => {
        //Pak het id nr van het eerste object wat terug komt
        console.log(data.response.docs[0].id)
        let id = data.response.docs[0].id

        //Vraag data op en zet op de kaart
        tekenDataOpKaart(id)

    })

function tekenDataOpKaart(woonplaatsId) {

    const mijnEersteAPIRequest = `https://api.pdok.nl/bzk/locatieserver/search/v3_1/lookup?id=${woonplaatsId}&wt=json&fl=*`

    fetch(mijnEersteAPIRequest, {})
        .then(response => response.json())
        .then(data => {
            console.log(data.response.docs[0].geometrie_ll);

            // Geojson naar Leaflet laag
            let geojsonFeature = Terraformer.wktToGeoJSON(data.response.docs[0].geometrie_ll);
            mijnGeojosnLaag.addData(geojsonFeature);

            // Center coordinaten voor zoomen naar center
            let centerCoordinates = Terraformer.wktToGeoJSON(data.response.docs[0].centroide_ll);
            console.log(centerCoordinates);
            LeafletMap.flyTo(centerCoordinates.coordinates.reverse());

        })
}







//OpenLayerskaart
var marker = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([6.231269471092657, 46.370761300379776])) // Lng/Lat van de marker
});


var iconStyle = new ol.style.Style({
    image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: 'https://openlayers.org/en/latest/examples/data/icon.png' // URL naar het icoonbestand
    })
});
marker.setStyle(iconStyle);


var markerLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: [marker]
    })
});


var map = new ol.Map({
    target: 'openlayersmap',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }),
        markerLayer
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([6.231269471092657, 46.370761300379776]),
        zoom: 12
    })
});


//ArcGIS kaart//

require(["esri/config", "esri/Map", "esri/views/MapView"], function (esriConfig, Map, MapView) {


    esriConfig.apiKey = "AAPK51a78e947c32420487388b9fa12e8abbRXew2C1FTRS8pe4Df1jGu-vvD-4M0NDeAlbgs-Ryf8HBScsKsBI3UF4zCOsoaFyg";
    const arcgismap = new Map({
        basemap: "arcgis-topographic" // Basemap layer //
    });

    const View = new MapView({
        map: arcgismap,
        center: [14.310551400816411, 47.25854826886296],
        zoom: 3.8, // scale: 72223.819286 //
        container: "arcgismap",
    });
});

L.tileLayer.wms('http://localhost:8001/geoserver/HGAV03/wms', {
    'layers': 'HGAV03:gemeente_2021_v1',
    'styles': 'polygon',
    'srs': 'EPSG:28992',
    'format': 'image/png',
    'opacity': 0.5
}).addTo(LeafletMap);

//Maplibre kaart//
var maplibreMap = new maplibregl.Map({
    container: 'maplibremap',
    style: 'https://demotiles.maplibre.org/style.json', // stylesheet location
    center: [5.646297572354539, 52.10074520726731], // starting position [lng, lat]
    zoom: 5.5, // starting zoom
});
//Maplibre marker en popup//
//PSV//
var popup = new maplibregl.Popup({ offset: 25 }).setText(
    'Philips Stadion, PSV'
);
marker = new maplibregl.Marker()
    .setLngLat([5.46738782790169, 51.44172503909564])
    .setPopup(popup)
    .addTo(maplibreMap);
//Feyenoord//
var popup = new maplibregl.Popup({ offset: 25 }).setText(
    'De Kuip, Feyenoord'
);
marker = new maplibregl.Marker()
    .setLngLat([4.523209986170994, 51.89378431312062])
    .setPopup(popup)
    .addTo(maplibreMap);
//Ajax//
var popup = new maplibregl.Popup({ offset: 25 }).setText(
    'Johan Cruijff ArenA, Ajax'
);
marker = new maplibregl.Marker()
    .setLngLat([4.9419426348314905, 52.31425318515478])
    .setPopup(popup)
    .addTo(maplibreMap);

