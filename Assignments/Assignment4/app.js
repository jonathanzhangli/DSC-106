function assignment4(){
    var filePath="data.csv";
    question1(filePath);
    question2(filePath);
    question3(filePath);
    question4(filePath);
    question5(filePath);
}

//Question 1
var question1=function(filePath){
    const data = d3.csv(filePath, d3.autoType);

    data.then(function(data){
        console.log(data)
    })

    data.then(function(data){
        const filtered = data.filter(function(d){
            if (d.Year <= 2015 && d.Year >= 2011) {
                return d;
            }
        })

        filtered.sort(function(x, y) { return x.Year - y.Year })

        const na_sales = Array.from(d3.rollup(filtered, v => d3.sum(v, d => d.NA_Sales), d => d.Year));
        const eu_sales = Array.from(d3.rollup(filtered, v => d3.sum(v, d => d.EU_Sales), d => d.Year));
        const jp_sales = Array.from(d3.rollup(filtered, v => d3.sum(v, d => d.JP_Sales), d => d.Year));
        const other_sales = Array.from(d3.rollup(filtered, v => d3.sum(v, d => d.Other_Sales), d => d.Year));

        var structured = []
        var max_sale = 0

        for (i = 0; i < na_sales.length; i++) {
            max_sale = Math.max(max_sale, other_sales[i][1], eu_sales[i][1], jp_sales[i][1], na_sales[i][1]);

            var na = {region: "NA", sales: na_sales[i][1], year: na_sales[i][0]}
            var eu = {region: "EU", sales: eu_sales[i][1], year: eu_sales[i][0]}
            var jp = {region: "Japan", sales: jp_sales[i][1], year: jp_sales[i][0]}
            var other = {region: "Other", sales: other_sales[i][1], year: other_sales[i][0]}

            structured.push(na);
            structured.push(eu);
            structured.push(jp);
            structured.push(other);
        }

        console.log("Question 1:")
        console.log(structured)

        var keys = Array.from(['NA_Sales', 'EU_Sales', 'JP_Sales', 'Other_Sales']);

        var width = 1000;
        var height = 600;
        var padding = 150;

        var svg_q1 = d3.select("#q1_plot").append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(70, 10)")

        var yAxis = d3.scaleBand()
            .range([0, height - padding])
            .domain(structured.map(function(item) { 
                return item["region"]; }))
            .padding(0.1);

        var xAxis = d3.scaleLinear()
            .domain([0, max_sale + 0.1 * padding])
            .range([0, width - padding]);

        svg_q1.append("g")
            .attr("transform", "translate(0," + (height - padding) + ")")
            .call(d3.axisBottom(xAxis))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-15)")
            .style("text-anchor", "end");

        svg_q1.append("g")
            .call(d3.axisLeft(yAxis))

        svg_q1.selectAll(".q1bar").data(structured)
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
                if (s["region"] == "NA") {
                    return "#44f5c9"
                } else if (s["region"] == "EU") {
                    return "#4542f7"
                } else if (s["region"] == "Japan") {
                    return "#f462a9"
                } else {
                    return "#fecbb0"
                }
            })

        d3.select("#q1_2011").on("change", changeYear)
        d3.select("#q1_2012").on("change", changeYear)
        d3.select("#q1_2013").on("change", changeYear)
        d3.select("#q1_2014").on("change", changeYear)
        d3.select("#q1_2015").on("change", changeYear)

        function changeYear() {
            var radioValue = d3.select("input[name='year']:checked").node().value;

            d3.selectAll(".q1bar").remove()
            svg_q1.selectAll(".q1bar").data(structured)
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
                    if (s["region"] == "NA") {
                        return "#44f5c9"
                    } else if (s["region"] == "EU") {
                        return "#4542f7"
                    } else if (s["region"] == "Japan") {
                        return "#f462a9"
                    } else {
                        return "#fecbb0"
                    }
                })

            }
    })
    
}

var question2=function(filePath){
    var data = d3.csv(filePath, d3.autoType);

    var width = 1000;
        var height = 800;
        var padding = 50;

        var svg_q2 = d3.select("#q2_plot").append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")

    data.then(function(d){
        const filtered = d.filter(function(d){
            if (d.Year <= 2015 && d.Year >= 2011) {
                return d;
            }
        })

        filtered.sort(function(x, y) { return x.Year - y.Year })
        
        d.forEach(v => { v.Year = d3.timeParse("%Y")(v.Year)})

        var groups = d3.group(d, v => v.Year);
        var years = Array.from(groups.keys()).sort()

        var na_by_year = Array.from(d3.rollup(d, v => d3.sum(v, g => g.NA_Sales), g => g.Year))
        var eu_by_year = Array.from(d3.rollup(d, v => d3.sum(v, g => g.EU_Sales), g => g.Year))
        var jp_by_year = Array.from(d3.rollup(d, v => d3.sum(v, g => g.JP_Sales), g => g.Year))
        var other_by_year = Array.from(d3.rollup(d, v => d3.sum(v, g => g.Other_Sales), g => g.Year))

        var structured = []

        for (i = 0; i < na_by_year.length; i++) {
            var sales = {
                Year: eu_by_year[i][0],
                NA_Sales: na_by_year[i][1],
                EU_Sales: eu_by_year[i][1],
                JP_Sales: jp_by_year[i][1],
                Other_Sales: other_by_year[i][1]
            }
            structured.push(sales)
        }

        console.log("Question 2")
        console.log(structured)

        var width = 1000;
        var height = 800;
        var padding = 50;

        var svg_q2 = d3.select("#q2_plot").append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")

        var xScale = d3.scaleTime().domain(d3.extent(structured, s=>s.Year)).range([padding, width-padding]);
        var yScale = d3.scaleLinear().domain([0, height-padding])
                                     .range([height-padding, padding])

        var xAxis = d3.axisBottom(xScale).ticks(years.length)
        var yAxis = d3.axisLeft(yScale)

        svg_q2.append("g").attr("transform", "translate(50,0)").call(yAxis).append("text").attr("text-anchor", "end");
        svg_q2.append("g").attr("transform", "translate(0,750)").call(xAxis).selectAll("text").attr("text-anchor", "end").attr("transform", "rotate(-45)")


        var types = ["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"]
        var colors = d3.scaleOrdinal().domain(types).range(["#44f5c9", "#4542f7", "#f462a9", "#fecbb0"])

        var stack = d3.stack().keys(types)(structured)
        
        svg_q2.selectAll('mylayers').data(stack).enter().append('path').style('fill', s=>colors(s.key))
            .attr("d", d3.area()
            .x(s=>xScale(s.data.Year))
            .y0(s=>yScale(s[0]))
            .y1(s=>yScale(s[1])))

    })
}

var question3=function(filePath){
    var data = d3.csv(filePath, d3.autoType);
    data.then(function(data){
        var svgheight = 600;
        var svgwidth = 700;
        var padding = 150;
       
        countries_sum = data.columns.slice(-5)
        countries_sum.pop()
        data.forEach(d => { d.Year=d3.timeParse("%Y")(d.Year)} )
        var games_NA=d3.flatRollup(data.filter(x=>x.Year>=d3.timeParse("%Y")(2011) && x.Year<=d3.timeParse("%Y")(2015)),c=>d3.sum(c,d=>d.NA_Sales),d => d.Year,x=>"NA_Sales",y=>"North America").sort((a, b) => a[0] - b[0])
        var games_EU=d3.flatRollup(data.filter(x=>x.Year>=d3.timeParse("%Y")(2011) && x.Year<=d3.timeParse("%Y")(2015)),c=>d3.sum(c,d=>d.EU_Sales),d => d.Year,x=>"EU_Sales",y=>"Europe").sort((a, b) => a[0] - b[0])
        var games_JP=d3.flatRollup(data.filter(x=>x.Year>=d3.timeParse("%Y")(2011) && x.Year<=d3.timeParse("%Y")(2015)),c=>d3.sum(c,d=>d.JP_Sales),d => d.Year,x=>"JP_Sales",y=>"Japan").sort((a, b) => a[0] - b[0])
        var games_Other=d3.flatRollup(data.filter(x=>x.Year>=d3.timeParse("%Y")(2011) && x.Year<=d3.timeParse("%Y")(2015)),c=>d3.sum(c,d=>d.Other_Sales),d => d.Year,x=>"Other_Sales",y=>"Others").sort((a, b) => a[0] - b[0])

        var games_years=games_NA.concat(games_JP,games_EU, games_Other)
        console.log(games_years)
        var countries=["NA_Sales","EU_Sales","JP_Sales","Other_Sales"]

        var xScale = d3.scaleTime().domain(d3.extent(games_years,d=>{return d[0]}))
                        .range([padding, svgwidth-padding])


        var yScale = d3.scaleLinear()
                        .domain([0,d3.max(games_years, function(d){return d[3]})])
                        .range([svgheight-padding, padding]);

        var svg = d3.select("#q3_plot").append("svg")
                        .attr("width", svgwidth)
                        .attr("height", svgheight);
        var xAxis=d3.axisBottom(xScale)
        var yAxis=d3.axisLeft(yScale)

        svg.append("g").attr("class","y_axis").attr('transform',`translate(${padding},0)`).call(yAxis).append("text").attr("text-anchor","end")
        svg.append("g").attr("class","x_axis").attr('transform',`translate(0,${svgheight-padding})`).call(xAxis).selectAll("text").attr("text-anchor","end").attr("transform","rotate(-45)");
        var Tooltip=d3.select("#q3_plot").append("div").style("opacity",0).attr("class","tooltip")

        svg.append("path")
              .datum(games_NA)
              .attr("fill", "none")
              .attr("stroke", "#fa6aae")
              .attr("stroke-width", 1.5)
              .attr("id",d=>{console.log(d);return String(d[0][2])})
              .attr("d", d3.line()
               .curve(d3.curveBasis) 
               .x(function(d) {console.log(d);if (d[1]=="NA_Sales"){console.log(d);return xScale(d[0])} })
                .y(function(d) {if (d[1]=="NA_Sales"){return yScale(d[3]) }})
                )
            svg
              .selectAll("dot")
              .data(games_NA)
              .enter()
                .append('g')
                .style("fill", function(d){ return "black" })
                .attr("id",d=>{console.log(d[2]);return String(d[2])})
              .selectAll("point")
              .data(games_NA)
              .enter()
              .append("circle")
                .attr("cx", function(d) { return xScale(d[0]) } )
                .attr("cy", function(d) { return yScale(d[3]) } )
                .attr("r", 3)
                .attr("stroke", "#4542f7")
                .on("mouseover",(e,d)=>{
                    Tooltip.transition().duration(10).style("opacity",1)
                    console.log(e,d)
                    Tooltip.html(d[1]+":"+d[3].toFixed(2)).style("left",e.pageX+"px").style("top",e.pageY+"px")

                })
                .on("mousemove",(e,d)=>{
                    Tooltip.transition().duration(10).style("opacity",1)
                    console.log(e,d)
                    Tooltip.html(d[1]+":"+d[3].toFixed(2)).style("left",e.pageX+"px").style("top",e.pageY+"px")
                    
                })
                .on("mouseout",(e,d)=>{
                     Tooltip.transition().duration(2000).style("opacity",0)
                })
       })
}

var question4=function(filePath){

    const data = d3.csv(filePath, d3.autoType);

    data.then(function(d){

        d.sort(function(x, y) { return x.Year - y.Year })

        d.forEach(v => {v.Year=d3.timeParse("%Y")(v.Year)})

        var na_sales = Array.from(d3.rollup(d, v => d3.sum(v, d => d.Other_Sales), d => d.Genre));
        var eu_sales = Array.from(d3.rollup(d, v => d3.sum(v, d => d.EU_Sales), d => d.Genre));
        var jp_sales = Array.from(d3.rollup(d, v => d3.sum(v, d => d.JP_Sales), d => d.Genre));
        var other_sales = Array.from(d3.rollup(d, v => d3.sum(v, d => d.NA_Sales), d => d.Genre));

        var max_sale = 0;
        var groups = []
        var structured = []
        var structured1 = []
        var structured2 = []
        var structured3 = []
        var structured4 = []

        for (i = 0; i < other_sales.length; i++) {
            max_sale = Math.max(max_sale, other_sales[i][1], eu_sales[i][1], jp_sales[i][1], na_sales[i][1]);

            var by_year = []

            var na = {genre: na_sales[i][0], sales: na_sales[i][1], region: "North America"}
            var eu = {genre: eu_sales[i][0], sales: eu_sales[i][1], region: "Europe"}
            var jp = {genre: jp_sales[i][0], sales: jp_sales[i][1], region: "Japan"}
            var ot = {genre: other_sales[i][0], sales: other_sales[i][1], region: "Others"}
            
            groups.push(other_sales[i][0])

            structured.push(na)
            structured.push(eu)
            structured.push(jp)
            structured.push(ot)

            structured1.push(na)
            structured2.push(eu)
            structured3.push(jp)
            structured4.push(ot)
        }

        console.log("Quesiton 4:")
        console.log(structured)

        // Creating Regions
        var regions = ["Others", "Europe", "Japan", "North America"]

        // set the dimensions and margins of the graph
        var margin = {top: 80, right: 25, bottom: 30, left: 40},
        width = 450 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#q4_plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Build X scales and axis:
        var xScale = d3.scaleBand()
            .range([ 0, width ])
            .domain(groups)
            .padding(0.05);
        var xAxis = d3.axisBottom(xScale)

        // Build Y scales and axis:
        var yScale = d3.scaleBand()
            .range([ height, 0 ])
            .domain(regions)
            .padding(0.05);
        var yAxis = d3.axisLeft(yScale)

        // Build color scale
        var myColor = d3.scaleSequential()
            .interpolator(d3.interpolateInferno)
            .domain([1,100])

        // create a tooltip
        var tooltip = d3.select("#q4_plot")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // add heatmap
        svg.selectAll(".q4heatmap").data(structured).enter().append("rect")
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

        // Add title to graph
        svg.append("text")
                .attr("x", 0)
                .attr("y", -50)
                .attr("text-anchor", "left")
                .style("font-size", "22px")
                .text("A d3.js heatmap");

        // Add subtitle to graph
        svg.append("text")
                .attr("x", 0)
                .attr("y", -20)
                .attr("text-anchor", "left")
                .style("font-size", "14px")
                .style("fill", "grey")
                .style("max-width", 400)
                .text("Heatmap to show variations of sales for each region and genre.");
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
