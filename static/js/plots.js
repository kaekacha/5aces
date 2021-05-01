  // create varaibles for each of the html id tags
  var id = d3.select("state");
  var bar = d3.select("bar");
//   var graph = d3.select("img2");

  // this function populates dropdown menu with state names and draw charts by default (using the first state)
function init() {
    resetData(); // reset any previous data; see function definition below
    d3.json("../data/ga_ny_grad.json").then((data) => {
    plotCharts(id.property("value")); // plot charts with value ID changed in drop down menu; see function definition below
}

  // this function resets the html id tags
  function resetData() {
      bar.html("");
}); 
  
  // create a function to read JSON and plot charts
  function plotCharts(id) {
      d3.json("../data/ga_ny_grad.json").then((data => {
          //filter the data for the state selected
          var filtered_data = data.filter(state => state.id == id.property("value")); //filter the metadata (md) on the id selected, and rturn back the "id" key                                 
  
          // create empty arrays to store sample data
          var school_year = [];
          var aggregation_type = [];
          var county_name = [];
          var school_name = [];
          var subgroup_name = [];
          var enroll_cnt = [];
          var grad_cnt = [];
          var drop_cnt = [];
          var grad_pct = [];
          var drop_pct = [];
          var state = [];
  
          // Iterate through each key and value in the samples data and store to empty lists above for plotting
          Object.entries(data).forEach(([key, value]) => {
              switch (key) {
                case "school_year":
                    school_year.push(value);
                    break;
                case "aggregation_type":
                    aggregation_type.push(value);
                    break;
                case "county_name":
                    county_name.push(value);
                    break;
                case "school_name":
                    school_name.push(value);
                    break;
                case "subgroup_name":
                    subgroup_name.push(value);
                    break;
                case "enroll_cnt":
                    enroll_cnt.push(value);
                    break;
                case "grad_cnt":
                    grad_cnt.push(value);
                    break;
                case "drop_cnt":
                    drop_cnt.push(value);
                    break; 
                case "grad_pct":
                    grad_pct.push(value);
                    break; 
                case "drop_pct":
                    drop_pct.push(value);
                    break;
                case "state":
                    state.push(value);
                    break;
                default:
                    break;
              }
          });
  
          // use the map function to store the IDs with "OTU" for labelling y-axis
          var counties = county_name.map(x => "County: " + x);
          var graduates = grad_pct.map(x => "% graduated: " + x)
          var drops = drop_pct.map(x => "% dropped: " + x)

  
          //plotting the bar chart
          var bar_trace = {
              x: county_name,
              y: grad_pct,
              text: graduates,
              type: 'bar',
              orientation: 'h',
              marker: {color: 'rgb(29,145,192)'}
          };
  
          var bar_data = [bar_trace];
  
          var bar_layout = {
              height: 500,
              width: 600,
              font: {family: 'Quicksand'},
              hoverlabel: {font: {family: 'Quicksand'}},
              title: {
                  text: `<b>Top OTUs for Test Subject ${id}</b>`,
                  font: {size: 18,color: 'rgb(34,94,168)'}
              },
              xaxis: {
                  title: "<b>Sample values<b>",
                  color: 'rgb(34,94,168)'
              },
              yaxis: {
                  tickfont: { size: 14 }
              }
          }
          Plotly.newPlot("bar", bar_data, bar_layout);
  
        //   //plotting the bubble chart
        //   var bubble_trace = {
        //       x: county_name,
        //       y: grad_pct,
        //       text: counties,
        //       mode: 'markers',
        //       marker: {
        //           size: grad_pct,
        //           color: county_name,
        //           colorscale: 'YlGnBu'
        //       },
        //   };
  
        //   var bubble_data = [bubble_trace];
  
        //   var bubble_layout = {
        //       font: {family: 'Quicksand'},
        //       hoverlabel: {font: {family: 'Quicksand'}},
        //       xaxis: {
        //           title: "<b>County</b>",
        //           color: 'rgb(34,94,168)'
        //       },
        //       yaxis: {
        //           title: "<b>% graduated</b>",
        //           color: 'rgb(34,94,168)'
        //       },
        //       showlegend: false,
        //   };
        //   Plotly.newPlot("bubble", bubble_data, bubble_layout);
  
  // when there is a change in the dropdown select menu, this function is called with the ID as a parameter
  function optionChanged(id) {
      resetData();
      plotCharts(id);
  }

init();
console.log(aggregation_type);
