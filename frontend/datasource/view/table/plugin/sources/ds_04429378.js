class ds_04429378 extends DefaultTable{
	//this.required = ["mention1","mention2","geneids1","geneids2","type1","type2","probability", "pubmed_id"]);//cannot be modified
	
	//==================================
	constructor(short_id){
	//==================================
	super(short_id);
	//ADDITIONAL COLUMNS
	this.add_cols = [ "sentence_id", "context", "new_column"];
	}

	//===================================
	addColumns(){
		var customColumns = {};
		/*
		 * this.getInteraction(); => gets the table data
		 * this.getColumn(interactionData, "columnName"); => get the value of specific column
		 * add other custom functions for complex mapping
		 *
		*/
        var interactions = this.getInteraction();
        let new_column = JSON.parse(this.getColumn(interactions,"new_column"));
        var themes = new_column["theme"];
        var svg_id = (interactions == null) ? "default_svg" : ("containerChart_" + interactions.pubmed_id) ;
        var $value;
        if(interactions != null)
        $value = $('<div class="distribution" id='+svg_id+'></div>');

		if(svg_id != "default_svg"){  
        var width  = 200;
 		var height = 100;
 		var margin = {'top': 20, 'right': 20, 'bottom': 20, 'left': 20 };  
            
       	var xScale = d3.scaleBand()
    		.domain(themes.map(function(d){ return d.code;}))
        	.range([margin.left, width - margin.right]);//, 0.1);
            
       	var yScale = d3.scaleLinear()
    		.domain([0, 1.40])
    		.range([height - margin.top - margin.bottom, 0]);
            
      	 var xAxis = d3.axisBottom(xScale);
  		var yAxis = d3.axisLeft(yScale).tickFormat("");

            
    	var svg = d3.select("#result-table")
    		.append("svg")
    		.attr('transform', 'translate(0,20)')//added new
    		.attr("id",("svg_" + svg_id))
    		.attr("width",  width)
    		.attr("height", height)
    		.attr("margin", margin);
            
    	svg.append('g')
    		.attr('class', 'x axis')
    		.attr('transform', 'translate(0,' + (height - margin.bottom - margin.top) + ')')
    		.call(xAxis);
       
    // Define the div for the tooltip
		var tip = d3.select("body").append("div")	
    		.attr("class", "tooltip")	
    		.style("opacity", 0)
            
     	svg.selectAll(".bar")//"rect"
            .data(themes)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return xScale(d.code); })
            .attr("y", function (d) { return yScale(d.score); })
            .attr("height", function (d) { return height - margin.top - margin.bottom - yScale(d.score); })
            .attr("width", xScale.bandwidth())//rangeBand())
            .text(function(d) { return d.score * 100; })
            .attr("fill", "#1f77b4")//grey
            .on("mouseover", function(d) {		
            tip.transition()			
                .style("opacity", .9);		
            tip.html(d.score)
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        	.on("mouseout", function(d) {		
            tip.transition()			
                .style("opacity", 0);	
        	});
            
    	svg.selectAll("text.bar")
      	.data(themes)
    	.enter().append("text")
      	.attr("class", "bar")
      	.attr("text-anchor", "middle")
      	.attr("x", function(d) { return xScale(d.code); })
      	.attr("y", function(d) { return yScale(d.score); });

        var $barChart = $("#svg_"+svg_id).detach();
        var $ch_svg = $("#"+svg_id);
        $value = $value.append($barChart);
        }
        customColumns['Theme Distribution'] = $value;
		return customColumns;
	}
    
    /*addSummaryColumns(){
        console.log("hi there in the local datasource");
        var customColumns = new Map();
        customColumns['Theme Distribution'] = "hello";
		return customColumns;
    }*/
    //start of change
    addSummaryColumns(interactions, group){
    var themesDist = {};
    var found = false;
    var $value;
    if(interactions != null){
        var rowThemeDist = {};
        interactions.forEach((interaction)=>{
            //parse theme values
            var addendum = JSON.parse(interaction.addendum);
            if(addendum.hasOwnProperty("new_column")){
                found = true;
            var new_col = JSON.parse(interaction.addendum).new_column;
            var themes = JSON.parse(new_col).theme;
            //create group of themes
            for(var theme of themes){
                if(!(theme.code in rowThemeDist))
                    rowThemeDist[theme.code] = [];
                rowThemeDist[theme.code].push(Number(theme.score));
            }
            }
        });
        //create a html element
        var svg_id = (found) ?("boxplot_" + group)  : "default_svg" ;

        if(found){
             $value = $('<div class="distribution" id='+svg_id+'></div>');
            //create boxplot
            d3.select("#result-table")
              .datum(rowThemeDist)
              .call(this.boxPlot(svg_id));
            
        }
        if(found){//svg_id != "default_svg"){ 
        var $boxPlot = $("#svg_"+svg_id).detach();//detach later
        $value = $value.append($boxPlot);
        //save boxplot in a dictionary
        	themesDist[group] = $value;
        }
        else{
           themesDist[group] = " " ;
        }
    }
	var columnMap = new Map();
    //theme distribution of box plot
	columnMap['Theme Dist.'] = $value;//themesDist;
	return columnMap;
}
    
boxPlot(group){
  //set dimensions
  var totalWidth = 200,totalheight = 70, barWidth = 7;
  var margin = {top: 0, right: 15, bottom: 15, left: 15};
  var width = totalWidth - margin.left - margin.right;
  var height = totalheight - margin.top - margin.bottom;
   //buildchart
   function chart(selection){
		selection.each(function(data){
            //sort the data for quantile
            for(var theme of Object.keys(data)){
                data[theme] = data[theme].sort(sortScore);
            }
            
            // Prepare the data for the box plots
            var boxPlotData = [];
  			for (var [key, score] of Object.entries(data)) {
				var record = {};
    			var localMin = d3.min(score);
    			var localMax = d3.max(score);

    			record.key = key;
    			record.counts = score;
    			record.quartile = boxQuartiles(score);
    			record.whiskers = [localMax, localMin];
    			record.color = "steelblue";//colorScale(key);
    			boxPlotData.push(record);
  			}
            var sortedboxPlotData  = boxPlotData.sort(sortTheme);
             // Compute an ordinal xScale for the keys in boxPlotData
				var xScale = d3.scalePoint()
  					.domain(Object.keys(data))
  					.rangeRound([0, width]);

			// Compute a global y scale based on the global counts
				var min = 0;
				var max = 1.0;
				var yScale = d3.scaleLinear()
  					.domain([min, max])
                	.range([height, 0])
                	.nice();
            
            // Setup the svg and group we will draw the box plot in
			var svg = d3.select(this).append("svg")
            	.attr("id",("svg_" + group))
  				.attr("width", totalWidth)
  				.attr("height", totalheight)
  				.append("g")
  				.attr("transform", "translate(" + (margin.left - barWidth) + "," + margin.top + ")");
            
            // Create Tooltips
        	var tip = d3.tip().attr('class', 'd3-tip').direction('e').offset([0,5])
            .html(function(d) {
                var content = "<span style='margin-left: 2.5px;'><b>" + d.key + "</b></span><br>";
                content +=`
                    <table style="margin-top: 2.5px;">
                            <tr><td>Max: </td><td style="text-align: right">` + d3.format(".2f")(d.whiskers[0]) + `</td></tr>
                            <tr><td>Q3: </td><td style="text-align: right">` + d3.format(".2f")(d.quartile[0]) + `</td></tr>
                            <tr><td>Median: </td><td style="text-align: right">` + d3.format(".2f")(d.quartile[1]) + `</td></tr>
                            <tr><td>Q1: </td><td style="text-align: right">` + d3.format(".2f")(d.quartile[2]) + `</td></tr>
                            <tr><td>Min: </td><td style="text-align: right">` + d3.format(".2f")(d.whiskers[1]) + `</td></tr>
                    </table>
                    `;
                return content;
            });
        	svg.call(tip);


			// Move the left axis over 25 pixels, and the top axis over 35 pixels
			var axisG = svg.append("g").attr("transform", "translate(0,0)");
            var xAxisBox = svg.append("g").attr("transform", "translate(2.5,0)");

			// Setup the group the box plot elements will render in
			var g = svg.append("g")
  				.attr("transform", "translate(0,0)");
            
            // Draw the box plot vertical lines
			var verticalLines = g.selectAll(".verticalLines")
  				.data(boxPlotData)
  				.enter()
  				.append("line")
  				.attr("x1", d => { return xScale(d.key) + barWidth/2; })
  				.attr("y1", d => { return yScale(d.whiskers[0]); })
  				.attr("x2", d => { return xScale(d.key) + barWidth/2; })
  				.attr("y2", d => { return yScale(d.whiskers[1]); })
 				.attr("stroke", "#000")
  				.attr("stroke-width", 0.5)
  				.attr("fill", "none");

            // Draw the boxes of the box plot, filled in white and on top of vertical lines
			var rects = g.selectAll("rect")
  				.data(boxPlotData)
 				.enter()
  				.append("rect")
  				.attr("width", barWidth)
  				.attr("height", d => { return yScale(d.quartile[2]) - yScale(d.quartile[0]); })
  				.attr("x", d => { return xScale(d.key); })
  				.attr("y", d => { return yScale(d.quartile[0]); })
            	.attr("fill", d => { return d.color; })
  				.attr("stroke", "#000")
  				.attr("stroke-width", 1)
            	.on('mouseover', tip.show)
        		.on('mouseout', tip.hide);;

            // Now render all the horizontal lines at once - the whiskers and the median
			var horizontalLineConfigs = [
  			// Top whisker
 			 {
    			x1: d => { return xScale(d.key); },
    			y1: d => { return yScale(d.whiskers[0]); },
    			x2: d => { return xScale(d.key) + barWidth; },
   				y2: d => { return yScale(d.whiskers[0]); }
  			},
  			// Median line
  			{
    			x1: d => { return xScale(d.key) ;},
    			y1: d => { return yScale(d.quartile[1]); },
    			x2: d => { return xScale(d.key) + barWidth ;},
    			y2: d => { return yScale(d.quartile[1]); }
  			},
  			// Bottom whisker
  			{
    			x1: d => { return xScale(d.key) ;},
    			y1: d => { return yScale(d.whiskers[1]); },
    			x2: d => { return xScale(d.key) + barWidth ;},
    			y2: d => { return yScale(d.whiskers[1]); }
  			}
			];
            
            for(var i=0; i < horizontalLineConfigs.length; i++) {
  			var lineConfig = horizontalLineConfigs[i];

  			// Draw the whiskers at the min for this series
  			var horizontalLine = g.selectAll(".whiskers")
    			.data(boxPlotData)
    			.enter()
    			.append("line")
    			.attr("x1", lineConfig.x1)
    			.attr("y1", lineConfig.y1)
    			.attr("x2", lineConfig.x2)
    			.attr("y2", lineConfig.y2)
    			.attr("stroke", "#000")
    			.attr("stroke-width", 0.5)
    			.attr("fill", "none");
			}
            
			var axisTop = d3.axisBottom(xScale);
				xAxisBox.append("g")
            	.attr("class", "x axis")
            	.attr("transform", "translate(0," + (height - 15) + ")")
  				.call(axisTop);
        });
   }
    return chart;
}
}
function boxQuartiles(d) {
   	return [
     	d3.quantile(d, 0.75),
     	d3.quantile(d, 0.5),
     	d3.quantile(d, 0.25)
   	];
}
function sortScore(a,b) {
  	return a - b;
}

function sortTheme(a, b){
    return (("" + a.key).localeCompare(b.key));
  /* if ( a.key < b.key ){
    return -1;
  }
  if ( a.key > b.key ){
    return 1;
  }
  return 0;*/
    
}
    //end of change
//}
1111111111111