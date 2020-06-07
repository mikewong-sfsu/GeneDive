class DefaultSummaryTable{
	constructor(short_id = null){
	this.short_id = short_id;//short id for the datasource
	this.add_cols = null;//additional column
	this.summaryColumns = this.addSummaryColumns();
	this.groupInteractions = null;
	
	}
	//=================================
	//return all the optional columns
	getSummaryHeader(){
	//=================================
	//get contents
	var add_header = Array.from(this.summaryColumns.keys());
	//append the datasource id
	add_header = add_header.map(element => element + " [" + this.short_id + "]")
	return add_header;
	}

	//=================================
	//map the table values for optional columns
	getSummaryElement(interaction, group_id){
	//=================================
	this.groupInteractions = interaction;
	var columns = this.addSummaryColumns(group_id);
	for(var key of columns.keys()){
		this.summaryColumns[key + " [" + this.short_id + "]"] = columns.get(key);
	}
	return this.summaryColumns;
	}


	//=================================
	getInteraction(){
	//=================================
		return this.groupInteractions;
	}

	//==================================
	//method to add custom columns
	addSummaryColumns(group_id){
	//==================================
		return new Map();
	}

	//==================================
	//method to add custom columns
	getColumn(columnName){
	//==================================
	var columnValues = [];
	if(this.groupInteractions != null){
		for(let i of this.groupInteractions){
			if(i.hasOwnProperty(columnName))
				columnValues.push(i[columnName]);
			else if(i.hasOwnProperty('addendum')){
			let addendum = JSON.parse(i.addendum);
			if(addendum.hasOwnProperty(columnName))
				columnValues.push(addendum[columnName]);
			}

		}
	} 
	return columnValues;
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
