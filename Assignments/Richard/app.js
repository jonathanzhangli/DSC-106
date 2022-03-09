function assignment4(){
    var filePath="data.csv";
    question1(filePath);
    question2(filePath);
    question3(filePath);
    question4(filePath);
    question5(filePath);
}


var rowConverter = function(d) {
    return {
        RowID: parseInt(d[""]),
        EU_Sales: parseFloat(d["EU_Sales"]),
        Genre: d.Genre,
        Global_Sales: parseFloat(d["Global_Sales"]),
        JP_Sales: parseFloat(d["JP_Sales"]),
        NA_Sales: parseFloat(d["NA_Sales"]),
        Name: d.Name,
        Other_Sales: parseFloat(d["Other_Sales"]),
        Platform: d.Platform,
        Publisher: d.Publisher,
        Rank: parseInt(d.Rank),
        Year: parseInt(d.Year)
    };
}


//Question 1
var question1=function(filePath){
    var data = d3.csv(filePath, function(d) {
        if (d.Year >= 2011 && d.Year <= 2015) {
            return rowConverter(d);
        }
    });

    data.then(function(d) {
        d.sort(function(a, b) { return a.Year - b.Year })
        var other_sales = Array.from(d3.rollup(d, v => d3.sum(v, d => d.Other_Sales), d => d.Year));
        var eu_sales = Array.from(d3.rollup(d, v => d3.sum(v, d => d.EU_Sales), d => d.Year));
        var jp_sales = Array.from(d3.rollup(d, v => d3.sum(v, d => d.JP_Sales), d => d.Year));
        var na_sales = Array.from(d3.rollup(d, v => d3.sum(v, d => d.NA_Sales), d => d.Year));

        var max_sales = 0;

        var flattened = []

        for (i = 0; i < other_sales.length; i++) {
            max_sales = Math.max(max_sales, other_sales[i][1], eu_sales[i][1], jp_sales[i][1], na_sales[i][1]);

            var by_year = []

            var o = {year: other_sales[i][0], sales: other_sales[i][1], region: "Other"}
            var e = {year: eu_sales[i][0], sales: eu_sales[i][1], region: "EU"}
            var j = {year: jp_sales[i][0], sales: jp_sales[i][1], region: "Japan"}
            var n = {year: na_sales[i][0], sales: na_sales[i][1], region: "NA"}


            flattened.push(o)
            flattened.push(e)
            flattened.push(j)
            flattened.push(n)
        }
        
        console.log(flattened)
        
        var padding = 100;
        var svgwidth = 1000;
        var svgheight = 500;

        var svg_q1 = d3.select("#q1_plot").append("svg")
                                          .attr("width", svgwidth)
                                          .attr("height", svgheight)
                                          .append("g")
                                          .attr("transform", "translate(100, 10)")

        var yAxis = d3.scaleBand()
                .range([0, svgheight - padding])
                .domain(flattened.map(function(item) { 
                    return item["region"]; }))
                .padding(0.1);

        var xAxis = d3.scaleLinear()
                .domain([0, max_sales + 50])
                .range([0, svgwidth - padding]);

        svg_q1.append("g")
                .attr("transform", "translate(0," + (svgheight - padding) + ")")
                .call(d3.axisBottom(xAxis))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-15)")
                .style("text-anchor", "end");

        svg_q1.append("g")
                .call(d3.axisLeft(yAxis))

        svg_q1.selectAll(".q1bar").data(flattened)
                                    .enter()
                                    .append("rect")
                                    .attr("class", "q1bar")
                                    .attr("x", function(s, i) { 
                                        if (s["year"] == 2011) {
                                            return xAxis(0);
                                        }
                                    })
                                    .attr("y", function(s, i) {
                                        if (s["year"] == 2011) {
                                            return yAxis(s["region"]);
                                        }
                                    })
                                    .attr("width", function(s, i) {
                                        if (s["year"] == 2011) {
                                            return xAxis(s["sales"]);
                                        } 
                                    })
                                    .attr("height", function(s) {
                                        if (s["year"] == 2011) {
                                            return yAxis.bandwidth();
                                        }
                                    })
                                    .attr("fill", function(s, i) { 
                                        if (s["region"] == "Other") {
                                            return "black"
                                        } else if (s["region"] == "NA") {
                                            return "green"
                                        } else if (s["region"] == "EU") {
                                            return "blue"
                                        } else {
                                            return "red"
                                        }
                                    })

        function changeYear() {
            var radioValue = d3.select("input[name='year']:checked").node().value;

            d3.selectAll(".q1bar").remove()
            svg_q1.selectAll(".q1bar").data(flattened)
                            .enter()
                            .append("rect")
                            .attr("class", "q1bar")
                            .attr("x", function(s, i) { 
                                if (s["year"] == radioValue) {
                                    return xAxis(0);
                                }
                            })
                            .attr("y", function(s, i) {
                                if (s["year"] == radioValue) {
                                    return yAxis(s["region"]);
                                }
                            })
                            .attr("width", function(s, i) {
                                if (s["year"] == radioValue) {
                                    return xAxis(s["sales"]);
                                } 
                            })
                            .attr("height", function(s) {
                                if (s["year"] == radioValue) {
                                    return yAxis.bandwidth();
                                }
                            })
                            .attr("fill", function(s, i) { 
                                if (s["region"] == "Other") {
                                    return "black"
                                } else if (s["region"] == "NA") {
                                    return "green"
                                } else if (s["region"] == "EU") {
                                    return "blue"
                                } else {
                                    return "red"
                                }
                            })

        }
        d3.select("#q1_2011").on("change", changeYear)
        d3.select("#q1_2012").on("change", changeYear)
        d3.select("#q1_2013").on("change", changeYear)
        d3.select("#q1_2014").on("change", changeYear)
        d3.select("#q1_2015").on("change", changeYear)
    })
}

var question2=function(filePath){
    var data = d3.csv(filePath, function(d) {
        if (d.Year >= 2006 && d.Year <= 2015) {
            return rowConverter(d);
        }
    });

    data.then(function(d) {
        d.sort(function(a, b) { return a.Year - b.Year })

        d.forEach(s => {
            s.Year=d3.timeParse("%Y")(s.Year)})

        var grouped = d3.group(d, s => s.Year);
        var years = Array.from(grouped.keys()).sort()

        // console.log(d)
        // console.log(grouped)


        var eu_by_year = Array.from(d3.rollup(d, v => d3.sum(v, item => item.EU_Sales), item => item.Year))
        var other_by_year = Array.from(d3.rollup(d, v => d3.sum(v, item => item.Other_Sales), item => item.Year))
        var na_by_year = Array.from(d3.rollup(d, v => d3.sum(v, item => item.NA_Sales), item => item.Year))
        var jp_by_year = Array.from(d3.rollup(d, v => d3.sum(v, item => item.JP_Sales), item => item.Year))

        var flattened = []

        for (i = 0; i < eu_by_year.length; i++) {
            var total_sales = {Year: eu_by_year[i][0], 
                               EU_Sales: eu_by_year[i][1], 
                               Other_Sales: other_by_year[i][1], 
                               NA_Sales: na_by_year[i][1], 
                               JP_Sales: jp_by_year[i][1]}

            flattened.push(total_sales)
        }

        // console.log(flattened)
        var width = 1000;
        var height = 800;
        var margin = 50;

        var svg_q2 = d3.select("#q2_plot").append("svg")
                                          .attr("width", width)
                                          .attr("height", height)
                                          .append("g")
                                          // .attr("transform", "translate(100, 10)")

        var xScale = d3.scaleTime().domain(d3.extent(flattened, s=>s.Year)).range([margin, width-margin]);
        var yScale = d3.scaleLinear().domain([0, height-margin])
                                     .range([height-margin, margin])

        var xAxis = d3.axisBottom(xScale).ticks(years.length)
        var yAxis = d3.axisLeft(yScale)

        svg_q2.append("g").attr("transform", "translate(50,0)").call(yAxis).append("text").attr("text-anchor", "end");
        svg_q2.append("g").attr("transform", "translate(0,750)").call(xAxis).selectAll("text").attr("text-anchor", "end").attr("transform", "rotate(-45)")


        var types = ["EU_Sales", "JP_Sales", "NA_Sales", "Other_Sales"]
        
        var colors = d3.scaleOrdinal().domain(types).range(["blue", "red", "green", "black"])

        var stack = d3.stack().keys(types)(flattened)
        // console.log(stack)
        
        svg_q2.selectAll('mylayers').data(stack).enter().append('path').style('fill', s=>colors(s.key))
                                    .attr("d", d3.area()
                                        .x(s=>xScale(s.data.Year))
                                        .y0(s=>yScale(s[0]))
                                        .y1(s=>yScale(s[1])))
    })
}

var question3=function(filePath){
    var data = d3.csv(filePath, function(d) {
        if (d.Year >= 2011 && d.Year <= 2015) {
            return rowConverter(d);
        }
    });

    data.then(function(d) {
        d.sort(function(a, b) { return a.Year - b.Year })

        d.forEach(s => {
            s.Year=d3.timeParse("%Y")(s.Year)})

        var other_sales = Array.from(d3.rollup(d, v => d3.sum(v, d => d.Other_Sales), d => d.Year));
        var eu_sales = Array.from(d3.rollup(d, v => d3.sum(v, d => d.EU_Sales), d => d.Year));
        var jp_sales = Array.from(d3.rollup(d, v => d3.sum(v, d => d.JP_Sales), d => d.Year));
        var na_sales = Array.from(d3.rollup(d, v => d3.sum(v, d => d.NA_Sales), d => d.Year));

        var max_sales = 0;
        var years = ["2011", "2012", "2013", "2014", "2015"]
        var flattened = []
        var flattened_na = []
        var flattened_eu = []
        var flattened_o = []
        var flattened_ja = []

        for (i = 0; i < other_sales.length; i++) {
            max_sales = Math.max(max_sales, other_sales[i][1], eu_sales[i][1], jp_sales[i][1], na_sales[i][1]);

            var by_year = []

            var o = {year: other_sales[i][0], sales: other_sales[i][1], region: "Others"}
            var e = {year: eu_sales[i][0], sales: eu_sales[i][1], region: "Europe"}
            var j = {year: jp_sales[i][0], sales: jp_sales[i][1], region: "Japan"}
            var n = {year: na_sales[i][0], sales: na_sales[i][1], region: "North America"}


            flattened.push(o)
            flattened.push(e)
            flattened.push(j)
            flattened.push(n)

            flattened_na.push(n)
            flattened_eu.push(e)
            flattened_o.push(o)
            flattened_ja.push(j)
        }

        var width = 1000;
        var height = 800;
        var margin = 50;

        var svg_q3 = d3.select("#q3_plot").append("svg")
                                          .attr("width", width)
                                          .attr("height", height)
                                          .append("g")
                                          // .attr("transform", "translate(100, 10)")

        var xScale = d3.scaleTime().domain(d3.extent(flattened, s=>s.year)).range([margin, width-margin]);
        var yScale = d3.scaleLinear().domain([0, 280])
                                     .range([height-margin, margin])

        var xAxis = d3.axisBottom(xScale).ticks(years.length)
        var yAxis = d3.axisLeft(yScale)

        var ToolTip = d3.select("#q3_plot").append("div").style("opacity", 0).attr("class", "tooltip");

        svg_q3.append("g").attr("transform", "translate(50,0)").call(yAxis).append("text").attr("text-anchor", "end");
        svg_q3.append("g").attr("transform", "translate(0,750)").call(xAxis).selectAll("text").attr("text-anchor", "end").attr("transform", "rotate(-45)")

        svg_q3.append("path").attr("class", "line").datum(flattened_na).attr("fill", "none")
                                              .attr("stroke", "green")
                                              .attr("stroke-width", 1.5)
                                              .attr("d", d3.line()
                                                .x(function(d) {
                                                    return xScale(d["year"])})
                                                .y(function(d) {
                                                    return yScale(d["sales"])})
                                                )  

        svg_q3.selectAll(".q3scatter").data(flattened)
                                    .enter()
                                    .append("circle")
                                    .attr("class", "q3scatter")
                                    .attr("cx", function(s) { 
                                        if (s["region"] == "North America") {
                                            return xScale(s["year"]);
                                        }
                                    })
                                    .attr("cy", function(s) {
                                        if (s["region"] == "North America") {
                                            return yScale(s["sales"]);
                                        }
                                    })
                                    .attr("r", 5)
                                    .attr("fill", function(s) { 
                                        if (s["region"] == "Others") {
                                            return "black"
                                        } else if (s["region"] == "North America") {
                                            return "green"
                                        } else if (s["region"] == "Europe") {
                                            return "blue"
                                        } else {
                                            return "red"
                                        }
                                    }).on("mouseover", function(e, d) {
                                        ToolTip.transition().duration(100).style("opacity", 0.9)
                                        ToolTip.html(d["sales"]).style("left", e.pageX + "px").style("top", e.pageY + "px")
                                    }).on("mousemove", function(e, d) {
                                        ToolTip.transition().duration(100).style("opacity", 0.9)
                                        ToolTip.html(d["sales"]).style("left", e.pageX + "px").style("top", e.pageY + "px")
                                    }).on("mouseout", function(e, d) {
                                        ToolTip.style("opacity", 0)
                                    })

        function changeYear() {
            var radioValue = d3.select("input[name='region']:checked").node().value;

            d3.selectAll("path.line").remove()
            d3.selectAll(".q3scatter").remove()

            if (radioValue == "North America") {
                svg_q3.append("path").attr("class", "line").datum(flattened_na).attr("fill", "none")
                                              .attr("stroke", "green")
                                              .attr("stroke-width", 1.5)
                                              .attr("d", d3.line()
                                                .x(function(d) {
                                                    return xScale(d["year"])})
                                                .y(function(d) {
                                                    return yScale(d["sales"])})
                                                )  
            } else if (radioValue == "Europe") {
                svg_q3.append("path").attr("class", "line").datum(flattened_eu).attr("fill", "none")
                                              .attr("stroke", "blue")
                                              .attr("stroke-width", 1.5)
                                              .attr("d", d3.line()
                                                .x(function(d) {
                                                    return xScale(d["year"])})
                                                .y(function(d) {
                                                    return yScale(d["sales"])})
                                                )  
            } else if (radioValue == "Japan") {
                svg_q3.append("path").attr("class", "line").datum(flattened_ja).attr("fill", "none")
                                              .attr("stroke", "red")
                                              .attr("stroke-width", 1.5)
                                              .attr("d", d3.line()
                                                .x(function(d) {
                                                    return xScale(d["year"])})
                                                .y(function(d) {
                                                    return yScale(d["sales"])})
                                                )  
            } else {
                svg_q3.append("path").attr("class", "line").datum(flattened_o).attr("fill", "none")
                                              .attr("stroke", "black")
                                              .attr("stroke-width", 1.5)
                                              .attr("d", d3.line()
                                                .x(function(d) {
                                                    return xScale(d["year"])})
                                                .y(function(d) {
                                                    return yScale(d["sales"])})
                                                )  
            }
            

            svg_q3.selectAll(".q3scatter").data(flattened)
                            .enter()
                            .append("circle")
                            .attr("class", "q3scatter")
                            .attr("cx", function(s, i) { 
                                if (s["region"] == radioValue) {
                                    return xScale(s["year"]);
                                }
                            })
                            .attr("cy", function(s, i) {
                                if (s["region"] == radioValue) {
                                    return yScale(s["sales"]);
                                }
                            })
                            .attr("r", 5)
                            .attr("fill", function(s, i) { 
                                if (s["region"] == "Others") {
                                    return "black"
                                } else if (s["region"] == "North America") {
                                    return "green"
                                } else if (s["region"] == "Europe") {
                                    return "blue"
                                } else {
                                    return "red"
                                }
                            }).on("mouseover", function(e, d) {
                                        ToolTip.transition().duration(100).style("opacity", 0.9)

                                        ToolTip.html(d["sales"]).style("left", e.pageX + "px").style("top", e.pageY + "px")
                                    }).on("mousemove", function(e, d) {
                                        ToolTip.transition().duration(100).style("opacity", 0.9)
                                        ToolTip.html(d["sales"]).style("left", e.pageX + "px").style("top", e.pageY + "px")
                                    }).on("mouseout", function(e, d) {

                                    })

        }
        d3.select("#q3_NA").on("change", changeYear)
        d3.select("#q3_JA").on("change", changeYear)
        d3.select("#q3_EU").on("change", changeYear)
        d3.select("#q3_Other").on("change", changeYear)      
    })
}

var question4=function(filePath){
    var data = d3.csv(filePath, function(d) {
        return rowConverter(d);
    });

    data.then(function(d) {
        d.sort(function(a, b) { return a.Year - b.Year })

        d.forEach(s => {
            s.Year=d3.timeParse("%Y")(s.Year)})

        var other_sales = Array.from(d3.rollup(d, v => d3.sum(v, d => d.Other_Sales), d => d.Genre));
        var eu_sales = Array.from(d3.rollup(d, v => d3.sum(v, d => d.EU_Sales), d => d.Genre));
        var jp_sales = Array.from(d3.rollup(d, v => d3.sum(v, d => d.JP_Sales), d => d.Genre));
        var na_sales = Array.from(d3.rollup(d, v => d3.sum(v, d => d.NA_Sales), d => d.Genre));

        var max_sales = 0;
        var genres = []
        var flattened = []
        var flattened_na = []
        var flattened_eu = []
        var flattened_o = []
        var flattened_ja = []

        for (i = 0; i < other_sales.length; i++) {
            max_sales = Math.max(max_sales, other_sales[i][1], eu_sales[i][1], jp_sales[i][1], na_sales[i][1]);

            var by_year = []

            var o = {genre: other_sales[i][0], sales: other_sales[i][1], region: "Others"}
            var e = {genre: eu_sales[i][0], sales: eu_sales[i][1], region: "Europe"}
            var j = {genre: jp_sales[i][0], sales: jp_sales[i][1], region: "Japan"}
            var n = {genre: na_sales[i][0], sales: na_sales[i][1], region: "North America"}
            genres.push(other_sales[i][0])

            flattened.push(o)
            flattened.push(e)
            flattened.push(j)
            flattened.push(n)

            flattened_na.push(n)
            flattened_eu.push(e)
            flattened_o.push(o)
            flattened_ja.push(j)
        }

        console.log(flattened)
        var regions = ["Others", "Europe", "Japan", "North America"]

        console.log(regions)
        console.log(genres)

        var width = 1000;
        var height = 800;
        var margin = 50;

        var svg_q4 = d3.select("#q4_plot").append("svg")
                                          .attr("width", width)
                                          .attr("height", height)
                                          .append("g")
                                          // .attr("transform", "translate(100, 10)")

        var xScale = d3.scaleBand().domain(genres).range([margin, width-margin]);
        var yScale = d3.scaleBand().domain(regions).range([margin, height-margin])

        var xAxis = d3.axisBottom(xScale)
        var yAxis = d3.axisLeft(yScale)

        var ToolTip = d3.select("#q4_plot").append("div").style("opacity", 0).attr("class", "tooltip");

        var myColor = d3.scaleSequential().interpolator(d3.interpolateInferno).domain([1000,0])

        svg_q4.append("g").attr("transform", "translate(50,0)").call(yAxis.tickSize(0)).append("text").attr("text-anchor", "end");
        svg_q4.append("g").attr("transform", "translate(0,750)").call(xAxis.tickSize(0)).selectAll("text").attr("text-anchor", "end").attr("transform", "rotate(-45)")

        svg_q4.selectAll(".q4heatmap").data(flattened).enter().append("rect")
            .attr("x", function(d) { return xScale(d.genre) })
            .attr("y", function(d) { return yScale(d.region) })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", xScale.bandwidth() )
            .attr("height", yScale.bandwidth() )
            .style("fill", function(d) { return myColor(d.sales)} )
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover", function(e, d) {
                ToolTip.transition().duration(100).style("opacity", 0.9)
                ToolTip.html(d["sales"]).style("left", e.pageX + "px").style("top", e.pageY + "px")
            }).on("mousemove", function(e, d) {
                ToolTip.transition().duration(100).style("opacity", 0.9)
                ToolTip.html(d["sales"]).style("left", e.pageX + "px").style("top", e.pageY + "px")
            }).on("mouseout", function(e, d) {
            })
    })
}

var question5=function(filePath){
        var data={
        "nodes":[
            {id: 1, name: 'USA', x: 87, y: 145},
            {id: 2, name: 'CHINA', x: 176, y: 94},
            {id: 3, name: 'INDIA', x: 249, y: 162},
            {id: 4, name: 'RUSSIA', x: 208, y: 253},
            {id: 5, name: 'JAPAN', x: 105, y: 246},
            {id: 6, name: 'FRANCE', x: 345, y: 120}
        ],
        "edges":[{'source': {'id': 2, 'name': 'CHINA', 'x': 176, 'y': 94},
                  'target': {'id': 6, 'name': 'FRANCE', 'x': 345, 'y': 120}},
                 {'source': {'id': 1, 'name': 'USA', 'x': 87, 'y': 145},
                  'target': {'id': 4, 'name': 'RUSSIA', 'x': 208, 'y': 253}},
                 {'source': {'id': 1, 'name': 'USA', 'x': 87, 'y': 145},
                  'target': {'id': 6, 'name': 'FRANCE', 'x': 345, 'y': 120}},
                 {'source': {'id': 5, 'name': 'JAPAN', 'x': 105, 'y': 246},
                  'target': {'id': 6, 'name': 'FRANCE', 'x': 345, 'y': 120}},
                 {'source': {'id': 1, 'name': 'USA', 'x': 87, 'y': 145},
                  'target': {'id': 5, 'name': 'JAPAN', 'x': 105, 'y': 246}},
                 {'source': {'id': 2, 'name': 'CHINA', 'x': 176, 'y': 94},
                  'target': {'id': 3, 'name': 'INDIA', 'x': 249, 'y': 162}},
                 {'source': {'id': 2, 'name': 'CHINA', 'x': 176, 'y': 94},
                  'target': {'id': 5, 'name': 'JAPAN', 'x': 105, 'y': 246}},
                 {'source': {'id': 3, 'name': 'INDIA', 'x': 249, 'y': 162},
                  'target': {'id': 6, 'name': 'FRANCE', 'x': 345, 'y': 120}}]
        
    }
    
    
      
}
