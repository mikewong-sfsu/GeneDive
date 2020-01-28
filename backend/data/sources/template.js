class LocalTable extends DefaultTable{
	//this.required = ["mention1","mention2","geneids1","geneids2","type1","type2","probability"]);//do not modify
	//this.optional = ["journal","article_id","pubmed_id","sentence_id","mention1_offset","mention2_offset","context","section"]);
	constructor(){
	super();
	this.add_cols = null;
	//this.header = set_union(this.required,this.optional);
	}


	//user sets addendum  = column to be displayed
	getHeader(){
	//by default all columns other than required and optional fall under this.addendum
	var header = new Set();
	//if(super.getHeader){
		header = super.getHeader();
	//	}
	if(this.add_cols != null){//default add all additional column headers
		//header = this.set_union(header,this.add_cols);
		header = this.add_cols;
	}
	return header;
	}
	
	//user maps the columns in addendum
	getElement(interaction,arr){
	var res = new Map();
	//if(super.getElement){
	res = super.getElement(interaction,arr);
	//}
	if(this.addendum != null){
		//map nested json here
		let addendum = JSON_parse(interaction.addendum);
		for(let i = 0; i < this.add_cols.length;i++){
			if(res.has(this.add_cols[i]) && addendum.has(this.add_cols[i]))
				res.set(this.add_cols[i],addendum.get(this.add_cols[i]));
		}
	}
	return res;
	
	}
	set_union(setA,setB){
		var union = new Set(setA);
		for(let i of setB)
			union.add(i);
		return union;
	}
}
