var dataPoints2 = [];
var chart2 = new CanvasJS.Chart("chartContainer2", {
	animationEnabled: true,
	axisX: {
		interval: 1,
		labelMaxWidth: 1000,
		labelFontSize:11,
		reversed: true
	},
	axisY2:{
		interlacedColor: "rgba(1,77,101,.2)",
		gridColor: "rgba(1,77,101,.1)",
		title: "Grad rates by county"
	},

	data: [{
		type: 'bar',
		color: "#53B17B",
		//xValueFormatString:"D MM h:mm",
		name: "series1",
		dataPoints: dataPoints2 // this should contain only specific serial number data

	}]
});

$( "#second" ).change(function() {
	chart2.options.data[0].dataPoints = [];
	var e = collection.getElementById("second");
	var selected = e.options[e.selectedIndex].value;
	console.log(selected)
	dps = [selected][0];
	for(var i in dps) {
		chart2.options.data[0].dataPoints.push({label: dps[i].label, y: dps[i].y});
	}
	chart2.render();
})
