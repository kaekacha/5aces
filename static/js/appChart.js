// d3.select(window).on("resize", handleResize);

// When the browser loads, loadChart() is called
loadChart();

function handleResize() {
    var svgArea = d3.select("svg");

    // If there is already an svg container on the pgrad_pct1, remove it and reload the chart
    if (!svgArea.empty()) {
        svgArea.remove();
        loadChart();
    }
}

function loadChart() {

    var svgWidth = 800; // var svgWidth = window.innerWidth - 80;
    var svgHeight = 500; // var svgHeight = window.innerHeight; //

    var margin = {
        top: 20,
        right: 80,
        bottom: 85,
        left: 90
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append an SVG group
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Initial Params
    var chosenXAxis = "enroll_cnt";
    var chosenYAxis = "grad_cnt";

    function Updatetextcircle(textcircle, chosenAxis, LinearScale, axisX) {
        //alert("voy aca");
        //borrar.remove();
        switch (axisX) {
            case (false):
                console.log("this is the Y axis case")
                textcircle.transition()
                    .duration(1000)
                    .attr("y", d => LinearScale(d[chosenAxis]));
                break;
            case (true):
                textcircle.transition()
                    .duration(1000)
                    .attr("x", d => LinearScale(d[chosenAxis]));
                break;
            default:
        }
        return textcircle
    }
    // function used for updating x-scale var upon click on axis label
    function xScale(St_Data, chosenXAxis) {
        // create scales
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(St_Data, d => d[chosenXAxis]) * 1,
            d3.max(St_Data, d => d[chosenXAxis])
            ])
            .range([0, width])
            .nice();

        return xLinearScale;
    }

    function yScale(St_Data, chosenYAxis) {
        // create Y scales
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(St_Data, d => d[chosenYAxis]) * 1, d3.max(St_Data, d => d[chosenYAxis]) * 1])
            .range([height, d3.min(St_Data, d => d[chosenYAxis]) * .8])
            .nice();

        return yLinearScale;
    }

    // Create y scale function

    // function used for updating xAxis var upon click on axis label
    function renderAxes(newScale, Axis, asixX) {

        if (asixX) {
            var bottomAxis = d3.axisBottom(newScale);
            Axis.transition()
                .duration(1000)
                .call(bottomAxis);
            xAxis = Axis
            return xAxis;
        } else {
            console.log(`voy y axis:${Axis}`)
            var leftAxis = d3.axisLeft(newScale);
            Axis.transition()
                .duration(1000)
                .call(leftAxis);
            yAxis = Axis
            return yAxis;
        }
    }

    function colorCircle(chosenAxis) {

        switch (chosenAxis) {
            case "enroll_cnt":
                color = "#ffd700" //color= Gold X axis
                break;
            case "grad_cnt":    //Y axis 1
                color = "#ffd700"
                break;
            case "grad_pct":
                color = "#806c00" //Y axis 2
                break;
            default:
                break;
        }
        return color
    }
    // function used for updating circles group with a transition to
    // new circles
    function renderCircles(circlesGroup, newScale, chosenXAxis, axisX) {
        if (axisX) {
            //var color = colorCircle(chosenXAxis) // change color circle
            circlesGroup.transition()
                .duration(1000)
                .attr("cx", d => newScale(d[chosenXAxis]))


            return circlesGroup;
        } else {
            var color = colorCircle(chosenYAxis) // change color circle
            circlesGroup.transition()
                .duration(1000)
                .attr("cy", d => newScale(d[chosenYAxis]))
                .attr("fill", color)
            // console.log(chosenYAxis)
            return circlesGroup;
        }
    }
    // function used for updating circles group with new tooltip
    function updateToolTip(chosenAxis, circlesGroup, axisX) {

        var labelx;
        var labely;
        switch (axisX) {
            case true:
                labelx = chosenAxis
                break;
            case false:
                labely = chosenAxis
                break;
            default:
                break;
        }

        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([63, 68])
            .html(function (d) {
                return (`${d.school_name}<br>${chosenXAxis}: ${d[chosenXAxis]} <br>${chosenYAxis}: ${d[chosenYAxis]}`);
            });

        circlesGroup.call(toolTip);

        circlesGroup.on("mouseover", function (data) {
            toolTip.show(data);
        })
            // onmouseout event
            .on("mouseout", function (data, index) {
                toolTip.hide(data);
            });

        return circlesGroup;
    }

    // ================ Retrieve data from the json file and execute everything below
    var GA_Garden1 = "";
    const status = response => {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        }
        return Promise.reject(new Error(response.statusText))
    }
    const json = response => response.json()
    var url = fetch('/datagagrad')
        .then(status)    // note that the `status` function is actually **called** here, and that it **returns a promise***
        .then(json)      // likewise, the only difference here is that the `json` function here returns a promise that resolves with `data`
        .then(St_Data => {  // ... which is why `data` shows up here as the first parameter to the anonymous function

            console.log('Request succeeded with JSON response', St_Data);
            //=====================================================================================
            // parse data
            St_Data.forEach(function (data) {
                data.enroll_cnt = +data.enroll_cnt;
                data.grad_cnt = +data.grad_cnt;
                data.grad_pct = + data.grad_pct * 100;
                //data.drop_pct = +data.grad_pct;
                // data.drop_cnt = +data.smokes
                /*drop_cnt: "0"
                drop_pct: "0"
                enroll_cnt: "10"
                grad_cnt: "10"
                grad_pct1: "1"
                school_year: "2019-20"
                smokes: NaN
                state: "ga"*/

            });
            color = "#ffd700";
            // xLinearScale function above csv import
            var xLinearScale = xScale(St_Data, chosenXAxis);
            var yLinearScale = yScale(St_Data, chosenYAxis);

            // Create initial axis functions
            var bottomAxis = d3.axisBottom(xLinearScale);
            var leftAxis = d3.axisLeft(yLinearScale);

            // append x axis
            var xAxis = chartGroup.append("g")
                .classed("x-axis", true)
                .attr("transform", `translate(0, ${height})`)
                .call(bottomAxis);

            // append y axis
            var yAxis = chartGroup.append("g")
                .classed("y-axis", true)
                .call(leftAxis);

            // append initial circles
            var circlesGroup = chartGroup.selectAll("circle")
                .data(St_Data)
                .enter()
                .append("circle")
                .attr("cx", d => xLinearScale(d[chosenXAxis]))
                .attr("cy", d => yLinearScale(d[chosenYAxis]))
                .attr("r", 10)
                .attr("fill", color)
                .attr("opacity", ".7");

            var textcircle = chartGroup.append("g")
                .selectAll("text")
                //.data(St_Data)
                .enter()
                .append("text")
                .text("GA")  //.text(d => d.state)
                .attr("x", d => xLinearScale(d[chosenXAxis]))
                .attr("y", d => yLinearScale(d[chosenYAxis]))
                .classed("text2", true)
                .attr("text-anchor", "middle")
                .attr("fill", "#1a1600")
                .attr("font-size", "10px")
                .style("font-weight", "bold")
                .attr("alignment-baseline", "central")

            // Create group for two x-axis labels
            var labelsGroup = chartGroup.append("g")
                .attr("transform", `translate(${width / 2}, ${height + 20})`);

            var enroll_cntLabel = labelsGroup.append("text")
                .attr("x", 0)
                .attr("y", 20)
                .attr("value", "enroll_cnt") // value to grab for event listener
                .classed("active", true)
                .text("Number of Students Enrolled per School in GA");

            /* var grad_pct1Label = labelsGroup.append("text")
                 .attr("x", 0)
                 .attr("y", 40)
                 .attr("value", "grad_pct1") // value to grab for event listener
                 .classed("inactive", true)
                 .text("grad_pct1 (Median)");*/

            /* var HouseincomeLabel = labelsGroup.append("text")
                 .attr("x", 0)
                 .attr("y", 60)
                 .attr("value", "income") // value to grab for event listener
                 .classed("inactive", true)
                 .text("Household Income (Median)");*/

            // ================= append y axis  ==============================
            var grad_pctLabel = chartGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .attr("value", "grad_pct")
                .classed("inactive", true)
                //.classed("axis-text", true)
                .text("Percentage of Graduates (%)");

            /* var smokesLabel = chartGroup.append("text")
                 .attr("transform", "rotate(-90)")
                 .attr("y", 20 - margin.left)
                 .attr("x", 0 - (height / 2))
                 .attr("dy", "1em")
                 .attr("value", "smokes")
                 .classed("inactive", true)
                 //.classed("axis-text", true)
                 .text("Smokes (%)");*/

            var grad_cntLabel = chartGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 20 - margin.left)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .attr("value", "grad_cnt")
                .classed("active", true)
                //.classed("axis-text", true)
                .text("Number of Graduates");

            // updateToolTip function above csv import
            var circlesGroup = updateToolTip(chosenXAxis, circlesGroup, true); // first time enroll_cnt vs grad_cnt tooltips

            // on click function for Y-Axis
            chartGroup.selectAll("text")
                .on("click", function () {
                    console.log("Y axis");
                    var value = d3.select(this).attr("value");
                    if (value !== chosenYAxis) {

                        // replaces chosenXAxis with value
                        chosenYAxis = value;
                    }
                    console.log(`esto leo: ${chosenYAxis}`)
                    yLinearScale = yScale(St_Data, chosenYAxis);
                    yAxis = renderAxes(yLinearScale, yAxis, false);
                    circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis, false);
                    // updates tooltips with new info
                    circlesGroup = updateToolTip(chosenYAxis, circlesGroup, false); // if false y-axis
                    textcircle = Updatetextcircle(textcircle, chosenYAxis, yLinearScale, false)
                    switch (chosenYAxis) {
                        case ("grad_cnt"):
                            grad_cntLabel
                                .classed("active", true)
                                .classed("inactive", false);
                            grad_pctLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            /*smokesLabel
                                .classed("active", false)
                                .classed("inactive", true);*/
                            break;
                        case ("grad_pct"):
                            grad_cntLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            grad_pctLabel
                                .classed("active", true)
                                .classed("inactive", false);
                            /*  smokesLabel
                                  .classed("active", false)
                                  .classed("inactive", true);*/
                            break;
                        case ("smokes"):
                            grad_cntLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            grad_pctLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            smokesLabel
                                .classed("active", true)
                                .classed("inactive", false);
                            break;
                        default:
                            break;
                    }

                })
            // x axis labels event listener
            labelsGroup.selectAll("text")
                .on("click", function () {
                    // get value of selection
                    var value = d3.select(this).attr("value");
                    if (value !== chosenXAxis) {

                        // replaces chosenXAxis with value
                        chosenXAxis = value;

                        // console.log(chosenXAxis)

                        // functions here found above csv import
                        // updates x scale for new data
                        xLinearScale = xScale(St_Data, chosenXAxis);

                        // updates x axis with transition
                        xAxis = renderAxes(xLinearScale, xAxis, true);

                        // updates circles with new x values
                        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, true);

                        // updates tooltips with new info
                        circlesGroup = updateToolTip(chosenXAxis, circlesGroup, true); // if true x-axis
                        textcircle = Updatetextcircle(textcircle, chosenXAxis, xLinearScale, true)

                        // changes classes to change bold text
                        switch (chosenXAxis) {
                            case ("grad_pct"):
                                /*  grad_pct1Label
                                      .classed("active", true)
                                      .classed("inactive", false);
                                  enroll_cntLabel
                                      .classed("active", false)
                                      .classed("inactive", true);
                                  HouseincomeLabel
                                      .classed("active", false)
                                      .classed("inactive", true);*/
                                break;
                            case ("enroll_cnt"):
                                grad_pct1Label
                                    .classed("active", false)
                                    .classed("inactive", true);
                                /* enroll_cntLabel
                                     .classed("active", true)
                                     .classed("inactive", false);
                                 HouseincomeLabel
                                     .classed("active", false)
                                     .classed("inactive", true);*/
                                break;
                            case ("income"):
                                grad_pct1Label
                                    .classed("active", false)
                                    .classed("inactive", true);
                                enroll_cntLabel
                                    .classed("active", false)
                                    .classed("inactive", true);
                                HouseincomeLabel
                                    .classed("active", true)
                                    .classed("inactive", false);
                                break;
                            default:
                                break;
                        }


                    }
                });
        })
        .catch(error => {
            console.log('Request failed', error)
        })

    console.log("1234");
}
