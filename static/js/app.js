// d3.json("/data").then(response => console.log(response));
var gaGar = "../data/georgia_Garden_DATA.csv"
var nyGar = "../data/NYGarden.GeoJson"
var countyLinesURL = "../data/us_Counties.json"

d3.json(nyGar, function(data) {
    createFeatures(data.features);
  });

    function createFeatures(NYG) {

    // loop through feature array
    // Give each feature a popup describing the magnitude, place and time 
    // Create a layer containing the features array
    var garden = L.geoJSON(NYG, {
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<h3>Gargen Name: " + feature.properties.garden_name +"</h3><h3>County: "+ feature.properties.county +"</h3><hr><p>" + new Date(feature.properties.timestamp) + "</p>");
      },
    });
    createMap(garden);
  }
  function createMap(NYGarden) {

      // Define streetmap and darkmap layers
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
    var myMap = L.map("mapid", {
        center: [
          37.09, -95.71],
        zoom: 3.25,
        layers: [outdoors, garden, countyLines]
  
    });
        // Add Fault lines data
    d3.json(countyLinesURL, function(countyData) {
            // Adding our geoJSON data, along with style information, to the tectonicplates
            // layer.
            L.geoJson(countyData, {
              color: "yellow",
              weight: 2
            })
            .addTo(CountyLines);
    });
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
        }).addTo(myMap);

legend.onAdd = function(myMap){
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(myMap);
}