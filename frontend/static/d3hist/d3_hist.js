/* Originally from: https://bl.ocks.org/mbostock/1933560
    Modified by Brook Thomas to fit table embed requirements
*/
/*updated function compatible with d3 version 5)*/
function histogramChart(){

	var margin = {top: 0, right: 15, bottom: 15, left: 15},
    	    width  = 125 - margin.left - margin.right,
    	    height = 50 - margin.top - margin.bottom;

	var x = d3.scaleLinear()
          .domain([0,1])
          .range([0, width]);

	var y = d3.scaleLinear()
          .range([height, 0]);
	
	// set the parameters for the histogram
	var histogram = d3.histogram()
    	.value(function(d) { return d; })
    		.domain(x.domain())
    		.thresholds(10);//10 bins

	function chart(selection){
		selection.each(function(data){

		var bins = histogram(data);
  		y.domain([0, d3.max(bins, function(d) { return d.length; })]);

		var svg = d3.select(this).append("svg")
    		.attr("width", width - margin.left - margin.right)
    		.attr("height", height - margin.top - margin.bottom)
  		.append("g")
    		.attr("transform",  "translate(" + margin.left + "," + margin.top + ")");

		// append the bar rectangles to the svg element
  		svg.selectAll("rect")
      		.data(bins)
    		.enter().append("rect")
      		.attr("class", "bar")
      		.attr("x", 1)
      		.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
      		.attr("width", function(d) { return x(d.x1) - x(d.x0) ; })
      		.attr("height", function(d) { return height - y(d.length); })
		.attr("fill", "grey");

  		// add the x Axis
  		svg.append("g")
		.attr("class", "x axis")
      		.attr("transform", "translate(0," + height + ")")
      		.call(d3.axisBottom(x).ticks(10))
		});
	}
	return chart;
}

