function assignment2(){
    //DO NOT MAKE CHANGES TO THIS FUNCTION
    var filePath="E-commerce data.csv";
    question1(filePath);
    question2(filePath);
    question3(filePath);
    question4(filePath);
    question5_1(filePath);
    question5_2(filePath);
    question5_3(filePath);
    question5_4(filePath);
    
}
    
//Question 1
/*
Read the csv file given in the assignment zip file and log the data to the console
*/
var question1= function(filePath){
    // Load data to a const variable
    var rowConverter = function(d){
        return {
            Category: d.Category,
            City: d.City,
            CustomerID: d['Customer ID'],
            Discount: parseFloat(d.Discount),
            PostalCode: d['Postal Code'],
            Profit: parseFloat(d.Profit),
            Quantity: parseFloat(d.Quantity),
            Region: d.Region,
            RowID: parseFloat(d['Row ID']),
            Sales: parseFloat(d.Sales),
            Segment: d.Segment,
            ShipMode: d['Ship Mode'],
            State: d.State,
            SubCategory: d['Sub-Category']
        };
    }

    const commerce = d3.csv(filePath, rowConverter);
    console.log("Quesiton 1:")
    commerce.then(function(data){
        console.log(data);
    });
}
//Question 2
/*
Create a plot of State vs Sales. Print the names of states in the <div> provided in the html. The plot does not need to have axes. You can figure out the top states using the names you have printed. We will later replace this implementation using axes.
*/
var question2=function(filePath){
    const commerce = d3.csv(filePath, d3.autoType);

    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 50, bottom: 90, left: 80},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#q2_plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "graph-svg-component");

    // Parse the Data
    commerce.then(function(data){

        const sales = data.map(d => d["Sales"]);

        const states = data.map(d => d["State"]);

        var subgroups = {}
        for (var i = 0; i < states.length; i++) {
            var state = states[i];
            var sale = sales[i];
            if (!subgroups[state]) {
                subgroups[state] = [sale];
            } else {
                subgroups[state].push(sale);
            }
        }

        var totals = [];

        for (i in Object.keys(subgroups)){
            totals.push({"State":Object.keys(subgroups)[i],
                         "Sales":d3.sum(subgroups[Object.keys(subgroups)[i]])})
        }
        console.log("Question2:")
        console.log(totals)


        // X axis
        var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(totals.map(function(d) { return d.State; }))
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
        .domain([0, 150000])
        .range([ height, 0]);
        svg.append("g")
        .call(d3.axisLeft(y));

        // Bars
        svg.selectAll("mybar")
        .data(totals)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.State); })
        .attr("y", function(d) { return y(d.Sales); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.Sales); })
        .attr("fill", "#69b3a2")

        // Title
        svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "28px") 
        .style("text-decoration", "underline")  
        .text("Sales By State Graph");

        // Axes
        svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width - 300)
        .attr("y", height + 70)
        .text("US States");

        svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -300)
        .attr("y", -80)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Sales ($)");
    })
}

//Question 3
/*
Create a plot of Category vs Sales. Print the names of states in the <div> provided in the html. The plot does not need to have axes. You can figure out the top states using the names you have print. We will later replace this implementation using axes.
*/
var question3=function(filePath){
    const commerce = d3.csv(filePath, d3.autoType);

    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 50, bottom: 90, left: 80},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#q3_plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "graph-svg-component");

    // Parse the Data
    commerce.then(function(data){

        const filtered = data.filter(function(d){ return d.State == 'California' || d.State == 'New York' || d.State == 'Washington'})

        var subgroups = {	"Furniture": filtered.filter(x=>x.Category=="Furniture").map(d => d["Sales"]),
                            "Office Supplies": filtered.filter(x=>x.Category=="Office Supplies").map(d => d["Sales"]),
                            "Technology": filtered.filter(x=>x.Category=="Technology").map(d => d["Sales"])};

        var totals = [];

        for (i in Object.keys(subgroups)){
            totals.push({"Category":Object.keys(subgroups)[i],
                         "Sales":d3.sum(subgroups[Object.keys(subgroups)[i]])})
        }

        console.log("Question 3:")
        console.log(totals)

        // X axis
        var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(totals.map(function(d) { return d.Category; }))
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
        .domain([0, 140000])
        .range([ height, 0]);
        svg.append("g")
        .call(d3.axisLeft(y));

        // Bars
        svg.selectAll("mybar")
        .data(totals)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.Category); })
        .attr("y", function(d) { return y(d.Sales); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.Sales); })
        .attr("fill", function(d){	
            if (d.Category == "Furniture") return "red";
            else if (d.Category == "Office Supplies") return "blue";
            else if (d.Category == "Technology") return "yellow";
        })
        
        // Title
        svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "28px") 
        .style("text-decoration", "underline")  
        .text("Sales By Category In California, Washington, and New York Graph");

        // Axes
        svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width - 300)
        .attr("y", height + 70)
        .text("Categories");

        svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -300)
        .attr("y", -80)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Sales ($)");
    })

    
}
//Question 4
/*
Create a plot of sub-category vs Sales. Print the names of sub-categories in the <div> provided in the html. The plot does not need to have axes. You can figure out the top sub-categories using the names you have print. We will later replace this implementation using axes.
*/
var question4=function(filePath){

    var rowConverter = function(d){
        return {
            Category: d.Category,
            City: d.City,
            CustomerID: d['Customer ID'],
            Discount: parseFloat(d.Discount),
            PostalCode: d['Postal Code'],
            Profit: parseFloat(d.Profit),
            Quantity: parseFloat(d.Quantity),
            Region: d.Region,
            RowID: parseFloat(d['Row ID']),
            Sales: parseFloat(d.Sales),
            Segment: d.Segment,
            ShipMode: d['Ship Mode'],
            State: d.State,
            SubCategory: d['Sub-Category']
        };
    }

    const commerce = d3.csv(filePath, rowConverter);

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

    // Parse the Data
    commerce.then(function(data){

        const filtered = data.filter(function(d){ return (d.State == 'California' || d.State == 'New York' || d.State == 'Washington') && d.Category == 'Technology'});

        var subgroups = {	"Accessories": filtered.filter(x=>x.SubCategory=="Accessories").map(d => d["Sales"]),
                            "Copiers": filtered.filter(x=>x.SubCategory=="Copiers").map(d => d["Sales"]),
                            "Phones": filtered.filter(x=>x.SubCategory=="Phones").map(d => d["Sales"]),
                            "Machines": filtered.filter(x=>x.SubCategory=="Machines").map(d => d["Sales"])};

        var totals = [];

        for (i in Object.keys(subgroups)){
            totals.push({"SubCategory":Object.keys(subgroups)[i],
                         "Sales":d3.sum(subgroups[Object.keys(subgroups)[i]])})
        }

        console.log("Question 4:")
        console.log(totals)

        // X axis
        var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(totals.map(function(d) { return d.SubCategory; }))
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
        .domain([0, 50000])
        .range([ height, 0]);
        svg.append("g")
        .call(d3.axisLeft(y));

        // Bars
        svg.selectAll("mybar")
        .data(totals)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.SubCategory); })
        .attr("y", function(d) { return y(d.Sales); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.Sales); })
        .attr("fill", function(d){	
            if (d.SubCategory == "Accessories") return "red";
            else if (d.SubCategory == "Copiers") return "blue";
            else if (d.SubCategory == "Phones") return "green";
            else if (d.SubCategory == "Machines") return "yellow";
        })

        // Title
        svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "20") 
        .style("text-decoration", "underline")  
        .text("Technology Sales By Sub-Category In California, Washington, and New York Graph");

        // Axes
        svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width - 300)
        .attr("y", height + 70)
        .text("Sub-Categories");

        svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -300)
        .attr("y", -80)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Sales ($)");
    })
}


//Question 5
/*
Create a plot of Quantity vs Discount for 4 regions. The plot does not need to have axes.
*/
var question5_1=function(filePath){

    var rowConverter = function(d){
        return {
            Category: d.Category,
            City: d.City,
            CustomerID: d['Customer ID'],
            Discount: parseFloat(d.Discount),
            PostalCode: d['Postal Code'],
            Profit: parseFloat(d.Profit),
            Quantity: parseFloat(d.Quantity),
            Region: d.Region,
            RowID: parseFloat(d['Row ID']),
            Sales: parseFloat(d.Sales),
            Segment: d.Segment,
            ShipMode: d['Ship Mode'],
            State: d.State,
            SubCategory: d['Sub-Category']
        };
    }

    const commerce = d3.csv(filePath, rowConverter);

    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 50, bottom: 90, left: 80},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#q5_plot1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    commerce.then(function(data) {

        const filtered = data.filter(function(d){ return d.Region == "East"});

        // Add X axis
        var x = d3.scaleLinear()
        .domain([0, 1])
        .range([ 0, width ]);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
        .domain([0, 20])
        .range([ height, 0]);
        svg.append("g")
        .call(d3.axisLeft(y));

        // Add dots
        svg.append('g')
        .selectAll("dot")
        .data(filtered)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.Discount); } )
        .attr("cy", function (d) { return y(d.Quantity); } )
        .attr("r", 4)
        .style("fill", "Red")

        // Title
        svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "32px") 
        .style("text-decoration", "underline")  
        .text("Quantity vs Discount Graph (East Region)");

        // Axes
        svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width - 300)
        .attr("y", height + 70)
        .text("Discount");

        svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -300)
        .attr("y", -80)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Quantity");

    })

}
var question5_2=function(filePath){
    var rowConverter = function(d){
        return {
            Category: d.Category,
            City: d.City,
            CustomerID: d['Customer ID'],
            Discount: parseFloat(d.Discount),
            PostalCode: d['Postal Code'],
            Profit: parseFloat(d.Profit),
            Quantity: parseFloat(d.Quantity),
            Region: d.Region,
            RowID: parseFloat(d['Row ID']),
            Sales: parseFloat(d.Sales),
            Segment: d.Segment,
            ShipMode: d['Ship Mode'],
            State: d.State,
            SubCategory: d['Sub-Category']
        };
    }

    const commerce = d3.csv(filePath, rowConverter);

    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 50, bottom: 90, left: 80},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#q5_plot2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    commerce.then(function(data) {

        const filtered = data.filter(function(d){ return d.Region == "West"});

        // Add X axis
        var x = d3.scaleLinear()
        .domain([0, 1])
        .range([ 0, width ]);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
        .domain([0, 20])
        .range([ height, 0]);
        svg.append("g")
        .call(d3.axisLeft(y));

        // Add dots
        svg.append('g')
        .selectAll("dot")
        .data(filtered)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.Discount); } )
        .attr("cy", function (d) { return y(d.Quantity); } )
        .attr("r", 4)
        .style("fill", "Blue")

        // Title
        svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "32px") 
        .style("text-decoration", "underline")  
        .text("Quantity vs Discount Graph (West Region)");

        // Axes
        svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width - 300)
        .attr("y", height + 70)
        .text("Discount");

        svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -300)
        .attr("y", -80)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Quantity");

    })
}
var question5_3=function(filePath){
    var rowConverter = function(d){
        return {
            Category: d.Category,
            City: d.City,
            CustomerID: d['Customer ID'],
            Discount: parseFloat(d.Discount),
            PostalCode: d['Postal Code'],
            Profit: parseFloat(d.Profit),
            Quantity: parseFloat(d.Quantity),
            Region: d.Region,
            RowID: parseFloat(d['Row ID']),
            Sales: parseFloat(d.Sales),
            Segment: d.Segment,
            ShipMode: d['Ship Mode'],
            State: d.State,
            SubCategory: d['Sub-Category']
        };
    }

    const commerce = d3.csv(filePath, rowConverter);

    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 50, bottom: 90, left: 80},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#q5_plot3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    commerce.then(function(data) {

        const filtered = data.filter(function(d){ return d.Region == "Central"});

        // Add X axis
        var x = d3.scaleLinear()
        .domain([0, 1])
        .range([ 0, width ]);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
        .domain([0, 20])
        .range([ height, 0]);
        svg.append("g")
        .call(d3.axisLeft(y));

        // Add dots
        svg.append('g')
        .selectAll("dot")
        .data(filtered)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.Discount); } )
        .attr("cy", function (d) { return y(d.Quantity); } )
        .attr("r", 4)
        .style("fill", "Green")

        // Title
        svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "32px") 
        .style("text-decoration", "underline")  
        .text("Quantity vs Discount Graph (Central Region)");

        // Axes
        svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width - 300)
        .attr("y", height + 70)
        .text("Discount");

        svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -300)
        .attr("y", -80)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Quantity");

    })
}
var question5_4=function(filePath){
    var rowConverter = function(d){
        return {
            Category: d.Category,
            City: d.City,
            CustomerID: d['Customer ID'],
            Discount: parseFloat(d.Discount),
            PostalCode: d['Postal Code'],
            Profit: parseFloat(d.Profit),
            Quantity: parseFloat(d.Quantity),
            Region: d.Region,
            RowID: parseFloat(d['Row ID']),
            Sales: parseFloat(d.Sales),
            Segment: d.Segment,
            ShipMode: d['Ship Mode'],
            State: d.State,
            SubCategory: d['Sub-Category']
        };
    }

    const commerce = d3.csv(filePath, rowConverter);

    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 50, bottom: 90, left: 80},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#q5_plot4")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    commerce.then(function(data) {

        const filtered = data.filter(function(d){ return d.Region == "South"});

        // Add X axis
        var x = d3.scaleLinear()
        .domain([0, 1])
        .range([ 0, width ]);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
        .domain([0, 20])
        .range([ height, 0]);
        svg.append("g")
        .call(d3.axisLeft(y));

        // Add dots
        svg.append('g')
        .selectAll("dot")
        .data(filtered)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.Discount); } )
        .attr("cy", function (d) { return y(d.Quantity); } )
        .attr("r", 4)
        .style("fill", "Purple")

        // Title
        svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "32px") 
        .style("text-decoration", "underline")  
        .text("Quantity vs Discount Graph (South Region)");

        // Axes
        svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width - 300)
        .attr("y", height + 70)
        .text("Discount");

        svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -300)
        .attr("y", -80)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Quantity");

    })
}
