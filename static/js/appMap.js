var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

var states = L.tileLayer(mbUrl, { id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr })

// var map = L.map('map').setView([37.8, -96], 4);

// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
// 	maxZoom: 18,
// 	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
// 		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
// 	id: 'mapbox/light-v9',
// 	tileSize: 512,
// 	zoomOffset: -1
// }).addTo(map);
// Define baseMaps Object to Hold Base Layers
var baseMaps = {
    "STATES": states,
};
//var myLayer = L.geoJSON().addTo(myMap);

// Initialize all of the LayerGroups we'll be using
var layers = {
    states: new L.LayerGroup()
};
// Create the map with our layers
var myMap = L.map("map", {
    center: [39.8710, -95.7554], //Coward SC
    zoom: 4,
    layers: [
        layers.states
    ]
});
states.addTo(myMap);
var overlaysMaps = {
    "States": layers.states,
}
var param = {
    color: 'yellow',
    className: 'States',
    fillOpacity: .1
};
//var luis = ""
var info = L.control.layers(baseMaps, overlaysMaps).addTo(myMap);
// ========== read population states data ===============================
//=================================================================
var statesData = {};

init();

function init() {
    var URL_json1 = "/static/GeoJSON/us-states.json";
    d3.json(URL_json1).then(function (statesData) {
        console.log(statesData)
        //let geoJsonLayer1 = L.geoJson(geoJsonLayer, { style: styleFunction })
        L.geoJson(statesData)
            .addTo(myMap);
        // create_Tectonics_Plates(geometryPlates.features); // call funxtion create Tectonics plates

        function getColor(d) {
            return d > 1000 ? '#0059b3' :
                d > 500 ? '#0066cc' :
                    d > 200 ? '#0073e6' :
                        d > 100 ? '#0080ff' :
                            d > 50 ? '#1a8cff' :
                                d > 20 ? '#3399ff' :
                                    d > 10 ? '#4da6ff' :
                                        '#99ccff';
        };

        function style(feature) {
            return {
                fillColor: getColor(feature.properties.density),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }

        L.geoJson(statesData, { style: style }).addTo(layers.states);

        //============== adding Interaction ==========
        function highlightFeature(e) {
            var layer = e.target;

            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }
        }
        function resetHighlight(e) {
            geojson.resetStyle(e.target);
        }
        var geojson;
        // ... our listeners
        geojson = L.geoJson();

        function zoomToFeature(e) {
            //console.log(e.sourceTarget.feature.properties.name)
            // myMap.fitBounds(e.target.getBounds());
        }
        function luisi(e) {
            //if (e.sourceTarget.feature.properties.name == "Georgia") {
            //    console.log(e.sourceTarget.feature.properties.name)
            //}
            alert(e.sourceTarget.feature.properties.name);

            // myMap.fitBounds(e.target.getBounds());
        }

        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: luisi
            });
        }
        geojson = L.geoJson(statesData, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(layers.states);

        // ===================== legend =============================================
        var legend = L.control({ position: 'bottomleft' });
        var longitud;
        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 10, 20, 50, 100, 200, 500, 1000],
                labels = [];
            longitud = grades.length

            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }

            return div;
        };
        legend.addTo(myMap);
        console.log(longitud)

        // ============================================================================
    });
    myMap.once('mouseover', function (e) {
        console.log("focus");
    });
};

d3.selectAll(".imgPanel").on("click", function () {
    //var Select_img = d3.select(this);
    var viewCase = d3.select(this).attr('id')
    var viewMap = d3.select("#map")
    console.log(d3.select(this).attr('id'))

    switch (viewCase) {
        case "view1":
            // d3.select("p").remove();
            d3.select("p").text("Title: Slect view");
            d3.select("#map").style("display", "block");
            d3.select("#scatter").style("display", "none");
	        d3.select("#scatterNY").style("display", "none");
            d3.select("#mapJohnny").style("display", "none");
            d3.select("#mapJohnny2").style("display", "none");
            break;
        case "view2":
            d3.select("p").text("Title: Graduation rate in Georgia.");
            d3.select("#map").style("display", "none");
            d3.select("#scatter").style("display", "block");
            d3.select("#scatterNY").style("display", "none");
            d3.select("#mapJohnny").style("display", "none");
            d3.select("#mapJohnny2").style("display", "none");
            break;
        case "view3":
            d3.select("p").text("Title: New York Gardens.");
            d3.select("#map").style("display", "none");
            d3.select("#scatter").style("display", "none");
            d3.select("#scatterNY").style("display", "block");
            d3.select("#mapJohnny").style("display", "none");
            d3.select("#mapJohnny2").style("display", "none");
            break;
        case "view4":
            d3.select("p").text("Title: Georgia Gardens.");
            d3.select("#map").style("display", "none");
            d3.select("#scatter").style("display", "none");
            d3.select("#scatterNY").style("display", "none");
            d3.select("#mapJohnny").style("display", "block");
            d3.select("#mapJohnny2").style("display", "none");
            break;
        case "view5":
            d3.select("p").text("Title: Georgia Gardens.");
            d3.select("#map").style("display", "none");
            d3.select("#scatter").style("display", "none");
            d3.select("#scatterNY").style("display", "none");
            d3.select("#mapJohnny").style("display", "none");
            d3.select("#mapJohnny2").style("display", "block");
            break;
        default:
    }
});

//This is what my divs look like
console.log(new Date());