//var mymap = L.map('mapJohnny').setView([51.505, -0.09], 13);

function createFeatures(NYG) {
    console.log(NYG)
    // loop through feature array
    // Give each feature a popup describing the magnitude, place and time 
    // Create a layer containing the features array
    var garden = L.geoJSON(NYG, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3>Gargen Name: " + feature.properties.garden_name + "</h3><h3>County: " + feature.properties.county + "</h3><hr><p>" + new Date(feature.properties.timestamp) + "</p>");
        },
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng)
        }
    });
    createMap(garden);
}

var gaGar = "/static/data/georgia_Garden_DATA.csv"
var nyGar = "/static/GeoJSON/NYGarden.GeoJson"
var countyLinesURL = "/static/GeoJSON/us_Counties.json"

//createMap("jhonny map")

function createMap(garden) {
    console.log(garden);
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    });
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/dark-v10",
        accessToken: API_KEY
    });
    var baseMaps = {
        "Outdoors": outdoors,
        "Satellite": satellite,
        "Dark Map": darkmap
    };

    // don't forget county lines
    var countyLines = new L.LayerGroup();
    var overlayMaps = {
        "Garden": garden,
        "County Lines": countyLines
    };
    var myMap = L.map("mapJohnny", {
        center: [
            42.54223781173655, -76.15938000650515],
        zoom: 7,
        layers: [outdoors, garden, countyLines]

    });
    outdoors.addTo(myMap);

    // Add Fault lines data =======================
    //d3.json(countyLinesURL, function (countyData) {
        d3.json(countyLinesURL).then(function (countyData) {
        // Adding our geoJSON data, along with style and filter infomation information, to the tectonicplates
        // layer.
        L.geoJson(countyData, {
            color: "black",
            weight: 2,
            filter: function (feature) {
                return (feature.properties.STATE == 36)
            }
        })
            .addTo(countyLines);
    });
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
// =================================================

}

d3.json(nyGar).then(function (Data) {
    createFeatures(Data)
});
