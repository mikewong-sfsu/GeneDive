class LocalTable extends DefaultTable{
	//this.required = ["mention1","mention2","geneids1","geneids2","type1","type2","probability"]);//do not modify
	//this.optional = ["journal","article_id","pubmed_id","sentence_id","mention1_offset","mention2_offset","context","section"]);
	constructor(){
	super();
	//ADDITIONAL COLUMNS
	this.add_cols = null;
	}


	//ADDITIONAL COLUMN SELECTION
	getHeader(){
	//by default all columns other than required and optional fall under this.add_cols
	//var header = new Set();
	var header = super.getHeader();
	if(this.add_cols != null){//default add all additional column headers
		header = this.add_cols;
	}
	return header;
	}
	
	//ADDITIONAL COLUMN MAPPING
	getElement(interaction,arr){
	//var res = new Map();
	var res = super.getElement(interaction,arr);
	if(this.addendum != null){
		//map all additional columns
		let addendum = JSON_parse(interaction.addendum);
		for(let i = 0; i < this.add_cols.length;i++){
			if(res.has(this.add_cols[i]) && addendum.has(this.add_cols[i]))
				res.set(this.add_cols[i],addendum.get(this.add_cols[i]));
			//user can code to flatten nested columns here
		}
	}
	return res;
	}

	//HELPER FUNCTION
	/*set_union(setA,setB){
		var union = new Set(setA);
		for(let i of setB)
			union.add(i);
		return union;
	}*/
}
