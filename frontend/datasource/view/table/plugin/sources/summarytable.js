class SummaryTable{
constructor(interactions){
	this.interactions = interactions;
}

addSummaryColumns(interactions){
    var themesDist = {};
    var found = false;
    for(var group of Object.keys(interactions)){
        var rowThemeDist = {};
        if(group.length > 1){
        interactions[group].forEach((interaction)=>{
            //parse theme values
            var addendum = JSON.parse(interaction.addendum);
            console.log("interactions : " + addendum.new_column);
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
        var svg_id = (found) ? "default_svg" : ("boxplot_" + group) ;
        var $value;
        if(found){
             $value = $('<div class="distribution" id='+svg_id+'></div>');
            //create boxplot
            d3.select("#result-table")
              .datum(rowThemeDist)
              .call(this.boxPlot(svg_id));
            
        }
        if(found){//svg_id != "default_svg"){ 
        var $boxPlot = $("#svg_"+svg_id).detach();//detach later
            console.log("found : " + found);
            console.log("boxplot:" + JSON.stringify($boxPlot));
            console.log("value : " + $value);
        $value = $value.append($boxPlot);
        //save boxplot in a dictionary
        	themesDist[group] = $value;
        }
        else{
            console.log("found : " + found);
           themesDist[group] = " " ;
        }
        }
    }
	var columnMap = new Map();
    //theme distribution of box plot
	columnMap['Theme Dist.'] = themesDist;
	return columnMap;
}
    
boxPlot(group){
    
  //set dimensions
  var totalWidth = 200,totalheight = 50, barWidth = 7;
  var margin = {top: 0, right: 15, bottom: 15, left: 15};
  var width = totalWidth - margin.left - margin.right;
  var height = totalheight - margin.top - margin.bottom;
   //buildchart
   function chart(selection){
		selection.each(function(data){
            //sort the data for quantile
            for(var theme of Object.keys(data)){
                data[theme] = data[theme].sort(sortScore)
            }
            
            // Prepare the data for the box plots
            var boxPlotData = [];
  			for (var [key, score] of Object.entries(data)) {
				var record = {};
    			var localMin = d3.min(score);
    			var localMax = d3.max(score);

    			record["key"] = key;
    			record["counts"] = score;
    			record["quartile"] = boxQuartiles(score);
    			record["whiskers"] = [localMax, localMin];
    			record["color"] = "steelblue";//colorScale(key);
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
    			x1: d => { return xScale(d.key) },
    			y1: d => { return yScale(d.whiskers[0]) },
    			x2: d => { return xScale(d.key) + barWidth },
   				y2: d => { return yScale(d.whiskers[0]) }
  			},
  			// Median line
  			{
    			x1: d => { return xScale(d.key) },
    			y1: d => { return yScale(d.quartile[1]) },
    			x2: d => { return xScale(d.key) + barWidth },
    			y2: d => { return yScale(d.quartile[1]) }
  			},
  			// Bottom whisker
  			{
    			x1: d => { return xScale(d.key) },
    			y1: d => { return yScale(d.whiskers[1]) },
    			x2: d => { return xScale(d.key) + barWidth },
    			y2: d => { return yScale(d.whiskers[1]) }
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
            	.attr("transform", "translate(0," + height + ")")
  				.call(axisTop);
        })
   }
    return chart;
}
}
function boxQuartiles(d) {
   	return [
     	d3.quantile(d, .75),
     	d3.quantile(d, .5),
     	d3.quantile(d, .25)
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
    
}1111111111