class LocalTable extends DefaultTable{
	//this.required = ["mention1","mention2","geneids1","geneids2","type1","type2","probability", "pubmed_id"]);//do not modify
	constructor(short_id){
	super();
	//ADDITIONAL COLUMNS
	this.add_cols = null;
	this.short_id = short_id;
	}


	//ADDITIONAL COLUMN SELECTION
	getHeader(){
	//by default all columns other than required and optional fall under this.add_cols
	var add_header = new Set();
	//var headerdd = super.getHeader();
	if(this.add_cols != null){//default add all additional column headers
		this.add_cols = this.add_cols.map(element => element + " [" + this.short_id + "]")
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
			let key = this.add_cols[i].substring(0,this.add_cols[i].indexOf(this.short_id) - 2);
			if(res.has(this.add_cols[i]) && addendum.hasOwnProperty(key)){
				let value = addendum[key];
				res.set(this.add_cols[i], value);
			}
		}
	}
	return res;
	}
}

