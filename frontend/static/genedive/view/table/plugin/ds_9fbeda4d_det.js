class ds_9fbeda4d_det extends DefaultDetailTable{
	//this.required = ["mention1","mention2","geneids1","geneids2","type1","type2","probability", "pubmed_id"]);//cannot be modified
	
	//==================================
	constructor(short_id){
	//==================================
	super(short_id);
	//ADDITIONAL COLUMNS
	this.add_cols = [ "sentence_id", "context", "additional_column"];
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
        let new_column = JSON.parse(this.getColumn(interactions,"additional_column"));
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
}
   