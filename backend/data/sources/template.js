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
	var add_header = new Set();
	//var headerdd = super.getHeader();
	if(this.add_cols != null){//default add all additional column headers
		add_header = this.add_cols;
	}
	return add_header;
	}
	
	//ADDITIONAL COLUMN MAPPING
	getElement(interaction,arr){
	//map all the required and optional columns
	var res = super.getElement(interaction,arr);
	if(this.add_cols != null){
		//map all additional columns that are stored in key value pair
		let addendum = JSON.parse(interaction.addendum);
		for(let i = 0; i < this.add_cols.length;i++){
			if(res.has(this.add_cols[i]) && addendum.hasOwnProperty(this.add_cols[i])){
				let value = addendum[this.add_cols[i]];
				res.set(this.add_cols[i], value);
			}
		}
	}
	return res;
	}
}

