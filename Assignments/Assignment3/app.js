function assignment3(){
    var filePath="data.csv";
    question1(filePath);
    question2(filePath);
    question3(filePath);
    question4(filePath);
    question5(filePath);
}


var question1=function(filePath){
    const data = d3.csv(filePath, d3.autoType);

    data.then(function(data){
        console.log(data)
    })
    

    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 50, bottom: 90, left: 80},
    width = 1000,
    height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#q1_plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + 3*margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "graph-svg-component");

    var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range ([height, 0]);

    var g = svg.append("g")
               .attr("transform", "translate(" + 100 + "," + 100 + ")");

    data.then(function(data){
        const filtered = data.filter(function(d){ return d.Year > 1980})

        var agg = d3.rollup(filtered, v => v.length, d => d.Year)

        agg = new Map([...agg.entries()].sort());


        xScale.domain(agg.keys());
        yScale.domain([0, d3.max(agg.values())]); 

        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale));

        g.append("g")
         .call(d3.axisLeft(yScale).tickFormat(function(d){
             return d;
         }).ticks(10))

         g.selectAll(".bar")
         .data(agg)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(d[0]); })
         .attr("y", function(d) { return yScale(d[1]); })
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) { return height - yScale(d[1]); })
         .attr("fill", function(d){ 
            if (d[1] >= 2000) return "#69b5e1";
            else if (d[1] >= 1800 && d[1] < 2000) return "#f59120";
            else if (d[1] < 1800) return "#94c23d";
        })

        console.log('Question 1:')
        console.log(agg)

    })
}

var question2=function(filePath){
    const data = d3.csv(filePath, d3.autoType);

    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 50, bottom: 90, left: 80},
    width = 1000,
    height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#q2_plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + 3*margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "graph-svg-component");

    var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range ([height, 0]);

    var g = svg.append("g")
               .attr("transform", "translate(" + 100 + "," + 100 + ")");

    data.then(function(data){
        const filtered = data.filter(function(d){ return (d.Year > 1980 && d.Sex == 'F')});

        var agg = d3.rollup(filtered, v => v.length, d => d.Year)

        agg = new Map([...agg.entries()].sort());


        xScale.domain(agg.keys());
        yScale.domain([0, d3.max(agg.values())]); 

        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale));

        g.append("g")
         .call(d3.axisLeft(yScale).tickFormat(function(d){
             return d;
         }).ticks(10))

         var limit = 0

         g.selectAll(".bar")
         .data(agg)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(d[0]); })
         .attr("y", function(d) { return yScale(d[1]); })
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) { return height - yScale(d[1]); })
         .attr("fill", function(d){ 
            if (d[1] >= limit) {
                limit = d[1];
                return "#69b5e1";
            } else {
                limit = d[1];
                return "#f1553d";
            }
        })

        console.log('Question 2:')
        console.log(agg)

    })
}

var question3=function(filePath){
    const data = d3.csv(filePath, d3.autoType);

    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 50, bottom: 90, left: 80},
    width = 1000,
    height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#q3_plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + 3*margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "graph-svg-component");

    var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range ([height, 0]);

    var g = svg.append("g")
               .attr("transform", "translate(" + 100 + "," + 100 + ")");

    data.then(function(data){
        const filtered = data.filter(function(d){ return d.Year > 1980});

        var agg = d3.flatRollup(filtered, v => v.length, d => d.Year, d => d.Sex)

        agg = new Map([...agg.entries()].sort());

        var scale_agg = d3.rollup(filtered, v => v.length, d => d.Year)

        scale_agg = new Map([...scale_agg.entries()].sort());

        

        xScale.domain(scale_agg.keys());
        yScale.domain([0, d3.max(scale_agg.values())]); 

        // xScale.domain([d3.min(agg, function(d){return d.get(0)[0]}), d3.max(agg, function(d){return d.get(0)[0]})]);
        // yScale.domain([0, d3.max(agg, function(d){return d.get(0)[2]})]); 

        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale));

        g.append("g")
         .call(d3.axisLeft(yScale).tickFormat(function(d){
             return d;
         }).ticks(10))

         var limit = 0

         // Add dots
        svg.append('g')
        .selectAll("dot")
        .data(agg)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScale(d[1][0]) + margin.right*2.55; } )
        .attr("cy", function (d) { return yScale(d[1][2]); } )
        .attr("r", 4)
        .attr("fill", function(d){ 
            if (d[1][1] == 'M') {
                return "#69b5e1";
            } else {
                return "#f1553d";
            }})

        console.log('Question 3:')
        console.log(agg)
    })
}

var question4=function(filePath){
    const data = d3.csv(filePath, d3.autoType);
    

    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 50, bottom: 90, left: 80},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#q4_plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "graph-svg-component");

    data.then(function(data){
        const filtered = data.filter(function(d){ return d.Team == 'United States'})

        var subgroups = {   "Bronze": filtered.filter(x=>x.Medal=="Bronze").map(d => d["Age"]),
                            "Silver": filtered.filter(x=>x.Medal=="Silver").map(d => d["Age"]),
                            "Gold": filtered.filter(x=>x.Medal=="Gold").map(d => d["Age"])};

        var totals = [];

        for (i in Object.keys(subgroups)){
            totals.push({"Medal":Object.keys(subgroups)[i],
                         "Count":d3.count(subgroups[Object.keys(subgroups)[i]])})
        }

        console.log("Question 4:")
        console.log(totals[2]['Count'])

        // X axis
        var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(totals.map(function(d) { return d.Medal; }))
        .padding(0.2);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")
        .attr("fill", "black");

        // Add Y axis
        var y = d3.scaleLinear()
        .domain([0, totals[2]['Count']*1.1])
        .range([ height, 0]);
        svg.append("g")
        .call(d3.axisLeft(y));

        // Bars
        svg.selectAll("mybar")
        .data(totals)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.Medal); })
        .attr("y", function(d) { return y(d.Count); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.Count); })
        .attr("fill", function(d){  
            if (d.Medal == "Bronze") return "#4c9dcb";
            else if (d.Medal == "Silver") return "#c583ac";
            else if (d.Medal == "Gold") return "#81b226";
        })
    })
}

var question5=function(filePath){
    const data = d3.csv(filePath, d3.autoType);

    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 50, bottom: 90, left: 80},
    width = 1000,
    height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#q5_plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + 3*margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "graph-svg-component");

    var xScale = d3.scaleLinear().range ([0, width]),
        yScale = d3.scaleLinear().range ([height, 0]);

    var g = svg.append("g")
               .attr("transform", "translate(" + 100 + "," + 100 + ")");

    data.then(function(data){
        const filtered = data.filter(function(d){ return d.Sport == "Basketball" || d.Sport == "Gymnastics" || d.Sport == "Judo"});

        var agg = d3.flatRollup(filtered, g => g.length, v => v.Sport, d => d.Sex, d => d.Weight, d => d.Height)

        agg = new Map([...agg.entries()].sort());

        xScale.domain([d3.min(agg, function(d) { return d[1][3] }), d3.max(agg, function(d) { return d[1][3] + 10})]);
        yScale.domain([d3.min(agg, function(d) { return d[1][2] }), d3.max(agg, function(d) { return d[1][2] + margin.bottom})]); 

        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale));

        g.append("g")
         .call(d3.axisLeft(yScale).tickFormat(function(d){
             return d;
         }).ticks(10))

         // Add dots
        svg.append('g')
        .selectAll("dot")
        .data(agg)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScale(d[1][3]) + margin.right*2.55; } )
        .attr("cy", function (d) { return yScale(d[1][2]); } )
        .attr("r", 4)
        .attr("fill", function(d){ 
            if (d[1][0] == "Basketball") {
                if (d[1][1] == 'M') {
                    return "#4c9dcb"; // Dark Blue
                } else {
                    return "#69b5e1"; // Light Blue
                }
            } else if (d[1][0] == "Gymnastics") {
                if (d[1][1] == 'M') {
                    return "#c583ac"; // Dark Pink
                } else {
                    return "#e1a2c9"; // Light Pink
                }
            } else { // Judo
                if (d[1][1] == 'M') {
                    return "#81b226"; // Dark Green
                } else {
                    return "#94c23d"; // Light Green
                }
            }})

        console.log('Question 5:')
        console.log(agg)
    })
}
