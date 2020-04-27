class DefaultSummaryTable{
	constructor(short_id = null){
	this.short_id = short_id;//short id for the datasource
	this.add_cols = null;//additional column
	this.summaryColumns = this.addSummaryColumns();
	this.interaction = null;
	
	}
	//=================================
	//return all the optional columns
	getSummaryHeader(){
	//=================================
	//get contents
	var add_header = Object.keys(this.summaryColumns);
	//append the datasource id
	add_header = add_header.map(element => element + " [" + this.short_id + "]")
	return add_header;
	}

	//=================================
	//map the table values for optional columns
	getSummaryElement(interaction,group_id){
	//=================================
	var columns = this.addSummaryColumns(interaction,group_id);
	for(var key of Object.keys(columns)){
		this.summaryColumns[key + " [" + this.short_id + "]"] = columns[key];
	}
	return this.summaryColumns;
	}


	//=================================
	getInteraction(){
	//=================================
		return this.interaction;
	}

	//==================================
	//method to add custom columns
	addSummaryColumns(interaction = null){
	//==================================
		return new Map();
	}

	//==================================
	//helper function
	set_union(setA,setB){
	//==================================
		var union = new Set(setA);
		for(let i of setB)
			union.add(i);
		return union;
	}
}
