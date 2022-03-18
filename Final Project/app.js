function assignment4(){
    var filePath="shot_logs.csv";
    question1(filePath);
    question2(filePath);
    question3(filePath);
    question4(filePath);
    question5(filePath);
    extraCredit(filePath);
}
var rowConverter = function(d){
            return {
                GAME_ID: d.GAME_ID,
                MATCHUP:d.MATCHUP,
                LOCATION: d.LOCATION,
                W:d.W,
                FINAL_MARGIN: parseFloat(d.FINAL_MARGIN),
                SHOT_NUMBER:parseFloat(d.SHOT_NUMBER),
                PERIOD:d.PERIOD,
                GAME_CLOCK:d.GAME_CLOCK,
                SHOT_CLOCK:parseInt(d.SHOT_CLOCK),
                DRIBBLES:parseFloat(d.DRIBBLES),
                TOUCH_TIME: parseFloat(d.TOUCH_TIME),
                SHOT_DIST: parseInt(d.SHOT_DIST),
                PTS_TYPE:d.PTS_TYPE,
                SHOT_RESULT:d.SHOT_RESULT,
                CLOSEST_DEFENDER:d.CLOSEST_DEFENDER,
                CLOSE_DEF_DIST:d.CLOSE_DEF_DIST,
                FGM:parseFloat(d.FGM),
                PTS:parseFloat(d.PTS),
                player_name:d.player_name,
                player_id:d.player_id

            };
        }

//Question 1
var question1=function(filePath){
    const shots = d3.csv(filePath,rowConverter);
    shots.then(function(data){console.log(data);}); 
    shots.then(function(data){
            var svgheight = 600;
            var svgwidth = 700;
            var padding = 150;

            var james=d3.flatRollup(data.filter(x=>x.player_name=="lebron james"),c=>d3.sum(c,d=>d.PTS),d => d.LOCATION,x=>"lebron james")
            //console.log(james)
            var westbrook=d3.flatRollup(data.filter(x=>x.player_name=="russell westbrook"),c=>d3.sum(c,d=>d.PTS),d => d.LOCATION,x=>"russell westbrook")
            var curry=d3.flatRollup(data.filter(x=>x.player_name=="stephen curry"),c=>d3.sum(c,d=>d.PTS),d => d.LOCATION,x=>"stephen curry")
            var harden=d3.flatRollup(data.filter(x=>x.player_name=="james harden"),c=>d3.sum(c,d=>d.PTS),d => d.LOCATION,x=>"james harden")

            var top_players=james.concat(westbrook, curry, harden)
            console.log(top_players)
            var players=["lebron james","russell westbrook","stephen curry","james harden"]

            var xScale = d3.scaleBand().domain(Array.from(players))
                            .range([padding, svgwidth-padding]).padding(0.1);


            var yScale = d3.scaleLinear()
                            .domain([0,d3.max(top_players, function(d){return d[2];})])
                            .range([svgheight-padding, padding]);

            var svg = d3.select("#q1_plot").append("svg")
                            .attr("width", svgwidth)
                            .attr("height", svgheight);
            var xAxis=d3.axisBottom(xScale).tickFormat(d=>d)
            var yAxis=d3.axisLeft(yScale)
            
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", svgwidth-padding*2)
                .attr("y", svgheight-50)
                .text("Players");
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", padding-50)
                .attr("x", -padding-100)
                .text("Points Scored")
            svg.append("text")
                .attr("x", (svgwidth / 2))             
                .attr("y", (padding / 2))
                .attr("text-anchor", "middle")  
                .style("text-decoration", "underline")  
                .text("2014-2015 Points Scored in Home/Away Games");

            svg.append("g").attr('transform',`translate(${padding},0)`).call(yAxis).append("text").attr("text-anchor","end")
            svg.append("g").attr('transform',`translate(0,${svgheight-padding})`).call(xAxis).selectAll("text").attr("text-anchor","end").attr("transform","rotate(-45)");

            svg.append("g").selectAll("rect").data(top_players).enter().append("rect").attr("id",d=>String(d[0])).attr("x",d=>{return xScale(d[1])})
            .attr("y",d=>yScale(d[2])).attr("height",d=>{if (d[0]=="H"){ return yScale(0)-yScale(d[2])}}).attr("width",xScale.bandwidth());

            d3.select("#radio").attr("name","result").on("change",d=>{svg.selectAll("rect","#"+String(d.target.value)).transition()
                            .duration(1000).attr("height",x=>{if (x[0]==d.target.value){ return yScale(0)-yScale(x[2])}})})




                                

           })

    
}

var question2=function(filePath){
    const shots = d3.csv(filePath,rowConverter);
    shots.then(function(data){console.log(data);}); 
    shots.then(function(data){
            var svgheight = 600;
            var svgwidth = 700;
            var padding = 150;

            var svg = d3.select("#q2_plot").append("svg")
                .attr("height", svgheight)
                .attr("width", svgwidth);

           
            var james=d3.flatRollup(data.filter(x=>(x.SHOT_CLOCK>=0)),c=>d3.sum(c,d=>d.FGM),d => d.SHOT_CLOCK,v=>v.player_name)
            console.log(james)

            d3.select("#dropDown")
                  .selectAll('playerNames')
                  .data(james)
                  .enter()
                  .append('option')
                  .text(function (d) { return d[1]; }) 
                  .attr("value", function (d) { return d[1]; }) 
            d3.select("#dropDown").on("change", function(d) {
                svg.selectAll("circle","#"+String(d.target.value)).transition()
                .duration(1000).attr("fill",x=>{if (x[1]==d.target.value){ return "blue"}})
                .attr("opacity", x=>{if (x[1]==d.target.value){return 1} else{return 0.01}})

            })


            var xScale = d3.scaleLinear()
                .domain([d3.min(james,function(d){
                    return d[0]
                }),d3.max(james,function(d){
                    return d[0]
                })])       
                .range([padding, svgwidth-padding])                       
                      

            var yScale = d3.scaleLinear()
                .domain([d3.min(james,function(d){
                    return d[2]
                }),d3.max(james,function(d){
                    return d[2]
                })])            
                .range([svgheight-padding, padding]); 
            var xAxis=d3.axisBottom(xScale)
            var yAxis=d3.axisLeft(yScale)

            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", svgwidth-padding*2)
                .attr("y", svgheight-50)
                .text("Shot Clock");
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", padding-50)
                .attr("x", -padding-100)
                .text("Field Goals Made")
            svg.append("text")
                .attr("x", (svgwidth / 2))             
                .attr("y", (padding / 2))
                .attr("text-anchor", "middle")  
                .style("text-decoration", "underline")  
                .text("2014-2015 Field Goals Made vs. Shot Clock");

            svg.append("g").attr("class","y_axis").attr('transform',`translate(${padding},0)`).call(yAxis).append("text").attr("text-anchor","end")
            svg.append("g").attr("class","x_axis").attr('transform',`translate(0,${svgheight-padding})`).call(xAxis).selectAll("text").attr("text-anchor","end").attr("transform","rotate(0)");


            var circ = svg.selectAll("circle").data(james).enter().append("circle").attr("id",d=>String(d[1])).attr("cx", function(d,i){ return  xScale(d[0]);}).attr("cy",function(d){ return yScale(d[2]);})
                      .attr("r", 3).attr("opacity", 0.9)


        })

}







var question3=function(filePath){
    const shots = d3.csv(filePath,rowConverter);
    shots.then(function(data){console.log(data);}); 
    shots.then(function(data){
            var svgheight = 600;
            var svgwidth = 700;
            var padding = 150;

            var james=d3.flatRollup(data.filter(x=>x.player_name=="lebron james"),c=>d3.sum(c,d=>d.PTS),d => d.PTS_TYPE,x=>"lebron james")
            var westbrook=d3.flatRollup(data.filter(x=>x.player_name=="russell westbrook"),c=>d3.sum(c,d=>d.PTS),d => d.PTS_TYPE,x=>"russell westbrook")
            var curry=d3.flatRollup(data.filter(x=>x.player_name=="stephen curry"),c=>d3.sum(c,d=>d.PTS),d => d.PTS_TYPE,x=>"stephen curry")
            var harden=d3.flatRollup(data.filter(x=>x.player_name=="james harden"),c=>d3.sum(c,d=>d.PTS),d => d.PTS_TYPE,x=>"james harden")

            for (let i=0;i<james.length;i++){
                james[i].push(Math.abs(james[0][2]+james[1][2]))

            }
            for (let i=0;i<westbrook.length;i++){
                westbrook[i].push(Math.abs(westbrook[0][2]+westbrook[1][2]))

            }
            for (let i=0;i<curry.length;i++){
                curry[i].push(Math.abs(curry[0][2]+curry[1][2]))

            }
            for (let i=0;i<harden.length;i++){
                harden[i].push(Math.abs(harden[0][2]+harden[1][2]))

            }


            var top_players=james.concat(westbrook, curry, harden)
            console.log(top_players)
            var players=["lebron james","russell westbrook","stephen curry","james harden"]
            var types = ["2","3"]

            
            

            var xScale = d3.scaleBand().domain(Array.from(players))
                            .range([padding, svgwidth-padding]).padding(0.1);


            var yScale = d3.scaleLinear()
                            .domain([0,d3.max(top_players, function(d){return d[2]*2;})])
                            .range([svgheight-padding, padding]);

            var svg = d3.select("#q3_plot").append("svg")
                            .attr("width", svgwidth)
                            .attr("height", svgheight);
            var xAxis=d3.axisBottom(xScale).tickFormat(d=>d)
            var yAxis=d3.axisLeft(yScale)
            
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", svgwidth-padding*2)
                .attr("y", svgheight-50)
                .text("Players");
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", padding-50)
                .attr("x", -padding-100)
                .text("Points per Field Goal Type")
            svg.append("text")
                .attr("x", (svgwidth / 2))             
                .attr("y", (padding / 2))
                .attr("text-anchor", "middle")  
                .style("text-decoration", "underline")  
                .text("2014-2015 Total Points by Field Goal Type");
              var colors = d3.scaleOrdinal()
                .domain(types)
                .range(['firebrick','#00008B'])

            svg.append("g").attr('transform',`translate(${padding},0)`).call(yAxis).append("text").attr("text-anchor","end")
            svg.append("g").attr('transform',`translate(0,${svgheight-padding})`).call(xAxis).selectAll("text").attr("text-anchor","end").attr("transform","rotate(-45)");

            svg.append("g").selectAll("rect").data(top_players).enter().append("rect").attr("id",d=>String(d[0])).attr("x",d=>{console.log(d);return xScale(d[1])})
            .attr("y",d=>{if (d[0]=="2"){return yScale(d[2])}else{return Math.abs(yScale(d[2])-Math.abs(yScale(d[2])-yScale(d[3])))}}).attr("height",d=>yScale(0)-yScale(d[2])).attr("width",xScale.bandwidth()).attr("fill", function(d) { return colors(d[0]); });

            svg.selectAll("dots")
              .data(types)
              .enter()
              .append("circle")
                .attr("cx", 500)
                .attr("cy", function(d,i){ return 100 + i*20}) 
                .attr("r", 7)
                .style("fill", function(d){return colors(d[0])})

        
            svg.selectAll("labels")
              .data(types)
              .enter()
              .append("text")
                .attr("x", 520)
                .attr("y", function(d,i){ return 100 + i*20}) 
                .style("fill", function(d){return colors(d[0])})
                .text(function(d){ return d[0]+"-Pointer"})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")




                                

           })

    
}

var question4=function(filePath){
    const shots = d3.csv(filePath,rowConverter);
    shots.then(function(data){console.log(data);}); 
    shots.then(function(data){
            var svgheight = 600;
            var svgwidth = 700;
            var padding = 150;


            var james=d3.flatRollup(data.filter(x=>x.player_name=="lebron james"),c=>d3.sum(c,d=>d.PTS),d => d.PERIOD,x=>"lebron james")
            //console.log(james)
            var westbrook=d3.flatRollup(data.filter(x=>x.player_name=="russell westbrook"),c=>d3.sum(c,d=>d.PTS),d => d.PERIOD,x=>"russell westbrook")
            var curry=d3.flatRollup(data.filter(x=>x.player_name=="stephen curry"),c=>d3.sum(c,d=>d.PTS),d => d.PERIOD,x=>"stephen curry")
            var harden=d3.flatRollup(data.filter(x=>x.player_name=="james harden"),c=>d3.sum(c,d=>d.PTS),d => d.PERIOD,x=>"james harden")

            var top_players=james.concat(westbrook, curry, harden)
            //console.log(top_players)
            var players=["lebron james","russell westbrook","stephen curry","james harden"]







            var xScale = d3.scaleBand().domain(Array.from(players))
                            .range([padding, svgwidth-padding]).padding(0.1);


            var yScale = d3.scaleBand()
                            .domain(Array.from(top_players,function(d){return d[0]}))
                            .range([svgheight-padding, padding]);

            var svg = d3.select("#q4_plot").append("svg")
                            .attr("width", svgwidth)
                            .attr("height", svgheight);
            var xAxis=d3.axisBottom(xScale).tickFormat(d=>d)
            var yAxis=d3.axisLeft(yScale)
            var colors = d3.scaleLinear()
                  .range(["white", "firebrick"])
                  .domain([1,d3.max(top_players,function(d){return d[2]})])
            var Tooltip=d3.select("#q4_plot").append("div").style("opacity",0).attr("class","tooltip")
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", svgwidth-padding*2)
                .attr("y", svgheight-50)
                .text("Players");
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", padding-50)
                .attr("x", -padding-100)
                .text("Quarter")
            svg.append("text")
                .attr("x", (svgwidth / 2))             
                .attr("y", (padding / 2))
                .attr("text-anchor", "middle")  
                .style("text-decoration", "underline")  
                .text("2014-2015 Points Scored per Quarter");




            svg.append("g").attr('transform',`translate(${padding},0)`).call(yAxis).append("text").attr("text-anchor","end")
            svg.append("g").attr('transform',`translate(0,${svgheight-padding})`).call(xAxis).selectAll("text").attr("text-anchor","end").attr("transform","rotate(-45)");

            svg.append("g").selectAll("rect").data(top_players).enter().append("rect").attr("id",d=>String(d[0])).attr("x",d=>{return xScale(d[1])})
            .attr("y",d=>yScale(d[0])).attr("height",yScale.bandwidth()).attr("width",xScale.bandwidth()).style("fill",function(d){return colors(d[2])})
            .on("mouseover",(e,d)=>{
                        Tooltip.transition().duration(10).style("opacity",1)
                        console.log(e,d)
                        Tooltip.html(d[2].toFixed(2)).style("left",e.pageX+"px").style("top",e.pageY+"px")

                    })
            .on("mousemove",(e,d)=>{
                        Tooltip.transition().duration(10).style("opacity",1)
                        console.log(e,d)
                        Tooltip.html(d[2].toFixed(2)).style("left",e.pageX+"px").style("top",e.pageY+"px")
                        
                    })
            .on("mouseout",(e,d)=>{
                         Tooltip.transition().duration(2000).style("opacity",0)
                    })

            




                                

           })
   
}


var question5=function(filePath){
    const shots = d3.csv(filePath,rowConverter);
    shots.then(function(data){console.log(data);}); 
    shots.then(function(data){
            var svgheight = 600;
            var svgwidth = 700;
            var padding = 150;

            var james=d3.flatRollup(data.filter(x=>x.player_name=="lebron james"),c=>d3.sum(c,d=>d.PTS),d => d.GAME_ID,x=>"lebron james").sort((a, b) => a[2] - b[2])
            var westbrook=d3.flatRollup(data.filter(x=>x.player_name=="russell westbrook"),c=>d3.sum(c,d=>d.PTS),d => d.GAME_ID,x=>"russell westbrook").sort((a, b) => a[2] - b[2])
            var curry=d3.flatRollup(data.filter(x=>x.player_name=="stephen curry"),c=>d3.sum(c,d=>d.PTS),d => d.GAME_ID,x=>"stephen curry").sort((a, b) => a[2] - b[2])
            var harden=d3.flatRollup(data.filter(x=>x.player_name=="james harden"),c=>d3.sum(c,d=>d.PTS),d => d.GAME_ID,x=>"james harden").sort((a, b) => a[2] - b[2])

            var top_players=james.concat(westbrook, curry, harden)
            //console.log(james)
            var player_arrays=[james,westbrook,curry,harden]
            var players=["lebron james","russell westbrook","stephen curry","james harden"]


            var xScale = d3.scaleBand().domain(Array.from(players))
                            .range([padding, svgwidth-padding]).padding(0.1);


            var yScale = d3.scaleLinear()
                            .domain([0,d3.max(top_players, function(d){return d[2];})])
                            .range([svgheight-padding, padding]);

            var svg = d3.select("#q5_plot").append("svg")
                            .attr("width", svgwidth)
                            .attr("height", svgheight);
            var xAxis=d3.axisBottom(xScale).tickFormat(d=>d)
            var yAxis=d3.axisLeft(yScale)
            
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", svgwidth-padding*2)
                .attr("y", svgheight-50)
                .text("Players");
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", padding-50)
                .attr("x", -padding-100)
                .text("Points Per Game")
            svg.append("text")
                .attr("x", (svgwidth / 2))             
                .attr("y", (padding / 2))
                .attr("text-anchor", "middle")  
                .style("text-decoration", "underline")  
                .text("2014-2015 Points Per Game Box Stats");

            svg.append("g").attr('transform',`translate(${padding},0)`).call(yAxis).append("text").attr("text-anchor","end")
            svg.append("g").attr('transform',`translate(0,${svgheight-padding})`).call(xAxis).selectAll("text").attr("text-anchor","end").attr("transform","rotate(-45)");


            for (let i =0;i<player_arrays.length;i++){
                var width = 75
                var ppg = player_arrays[i].map(function(value,index) { return value[2]; });
                var q1 = d3.quantile(ppg, .25)
                var median = d3.quantile(ppg, .5)
                var q3 = d3.quantile(ppg, .75)
                var interQuantileRange = q3 - q1
                var min = q1 - 1.5 * interQuantileRange
                var max = q1 + 1.5 * interQuantileRange

                svg
                .append("line")
                  .attr("x1", xScale(player_arrays[i][1][1])+width/2)
                  .attr("x2", xScale(player_arrays[i][1][1])+width/2)
                  .attr("y1", yScale(min))
                  .attr("y2", yScale(max))
                  .attr("stroke", "black")

                svg
                .append("rect")
                  .attr("x", xScale(player_arrays[i][1][1]))
                  .attr("y", yScale(q3) )
                  .attr("height", (yScale(q1)-yScale(q3)) )
                  .attr("width", width )
                  .attr("stroke", "black")
                  .style("fill", "dodgerblue")

                svg
                .selectAll("lines")
                .data([min, median, max])
                .enter()
                .append("line")
                  .attr("x1", xScale(player_arrays[i][1][1])-width/2 + 38)
                  .attr("x2", xScale(player_arrays[i][1][1])+width/2 + 38)
                  .attr("y1", function(d){ return(yScale(d))})
                  .attr("y2", function(d){ return(yScale(d))})
                  .attr("stroke", "black")

            }


           

           })
}

var extraCredit=function(filePath){
    const shots = d3.csv(filePath,rowConverter);

    shots.then(function(data){
        var svgheight = 600;
        var svgwidth = 600;
        var padding = 150;

        var made_two = d3.flatRollup(data.filter(x=>x.SHOT_RESULT=="made" && x.PTS_TYPE=="2" && x.SHOT_DIST<=24),c=>d3.sum(c,d=>d.PTS),d => d.SHOT_DIST,x=>"2").sort((a, b) => a[0] - b[0])

        var made_three = d3.flatRollup(data.filter(x=>x.SHOT_RESULT=="made" && x.PTS_TYPE=="3" && x.SHOT_DIST>=22),c=>d3.sum(c,d=>d.PTS),d => d.SHOT_DIST,x=>"3").sort((a, b) => a[0] - b[0])
        console.log("Extra Credit:")

        var cat=made_two.concat(made_three)

        console.log(cat)

        var xScale = d3.scaleLinear().domain([0,d3.max(made_three, function(d){return d[0];})])
                        .range([padding, svgwidth-padding]);


        var yScale = d3.scaleLinear()
                        .domain([0,25])
                        .range([svgheight-padding, padding]);

        var svg = d3.select("#ec_plot").append("svg")
                        .attr("width", svgwidth)
                        .attr("height", svgheight);
        var xAxis=d3.axisBottom(xScale).tickFormat(d=>d)
        var yAxis=d3.axisLeft(yScale)


        var colors_two = d3.scaleLinear()
              .range(["white", "firebrick"])
              .domain([1,d3.max(made_two,function(d){return d[2]})])

        var colors_three = d3.scaleLinear()
              .range(["#F0FFFF", "#00008B"])
              .domain([1,d3.max(made_three,function(d){return d[2]})])

        var circ = svg.selectAll("circle").data(cat).enter().append("circle").attr("id",d=>String(d[1])).attr("cx", function(d,i){ return  0;}).attr("cy",function(d){ return yScale(12.5);})
              .attr("r", function(d){ return d[0] * 13})
              .style("fill",function(d){return "transparent"})
              .style("stroke",function(d){
                if (d[1] == "2"){
                    return colors_two(d[2])
                }
                else{
                    return colors_three(d[2])
                }
            })
              .style("stroke-width", 15)

        // Adding Court
        svg.append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', svgwidth)
          .attr('height', svgheight)
          .attr('stroke', 'black')
          .attr('fill', 'transparent');

        // 3 Point Line
        const arc = d3.arc()
          .outerRadius(275)
          .innerRadius(283)
          .startAngle(-2 * Math.PI / 2)
          .endAngle(-4 * Math.PI / 2);

        svg.append("path")
          .attr("transform", "translate(0,300)")
          .attr("d", arc())
          .attr('fill', 'black');

        // Key
        svg.append('rect')
          .attr('x', 0)
          .attr('y', 190)
          .attr('width', 180)
          .attr('height', 220)
          .attr('stroke', 'black')
          .style("stroke-width", 6)
          .attr('fill', 'transparent');

        // Top Key
        const arc2 = d3.arc()
          .outerRadius(118)
          .innerRadius(113)
          .startAngle(9.1)
          .endAngle(6.6);

        svg.append("path")
          .attr("transform", "translate(145,300)")
          .attr("d", arc2())
          .attr('stroke', 'black')
          .style("stroke-width", 2)
          .attr('fill', 'black');

        // Half Court
        const arc3 = d3.arc()
          .outerRadius(118)
          .innerRadius(113)
          .startAngle(2 * Math.PI / 2)
          .endAngle(4 * Math.PI / 2);

        svg.append("path")
          .attr("transform", "translate(600,300)")
          .attr("d", arc3())
          .attr('stroke', 'black')
          .style("stroke-width", 2)
          .attr('fill', 'black');

        // Title
        svg.append("text")
            .attr("x", (svgwidth / 2) + 120)             
            .attr("y", 18)
            .attr("text-anchor", "middle")  
            .style("text-decoration", "underline")  
            .text("2014-2015 NBA Points Made By Distance From Rim");

        var bin_colors = d3.scaleOrdinal()
            .domain(cat)
            .range(['firebrick','#00008B'])

        var legend_keys = ["2", "3"]

        // Legend
        svg.selectAll("dots")
          .data(legend_keys)
          .enter()
          .append("circle")
            .attr("cx", 510)
            .attr("cy", function(d,i){ return 49 + i*20}) 
            .attr("r", 7)
            .style("fill", function(d){return bin_colors(d)})

    
        svg.selectAll("labels")
          .data(legend_keys)
          .enter()
          .append("text")
            .attr("x", 530)
            .attr("y", function(d,i){ return 50 + i*20}) 
            .style("fill", function(d){return bin_colors(d)})
            .text(function(d){ return d+"-Pointer"})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

        })
}
