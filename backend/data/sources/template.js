class LocalTable extends DefaultTable{
	//this.required = ["mention1","mention2","geneids1","geneids2","type1","type2","probability", "pubmed_id"]);//cannot be modified
	
	//==================================
	constructor(short_id){
	//==================================
	super(short_id);
	//ADDITIONAL COLUMNS
	this.add_cols = null;
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
		return customColumns;
	}

}

