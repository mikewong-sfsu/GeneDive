class DefaultDetTable extends DefaultDetailTable{
	//this.required = ["mention1","mention2","geneids1","geneids2","type1","type2","probability", "pubmed_id"]);//cannot be modified
	
	//==================================
	constructor(short_id){
	//==================================
	super(short_id);
	//ADDITIONAL COLUMNS
	this.add_cols = null;
	}


	//===================================
	addDetailColumns(){
		var detailColumnMap = new Map();
		return detailColumnMap;
	}

}

