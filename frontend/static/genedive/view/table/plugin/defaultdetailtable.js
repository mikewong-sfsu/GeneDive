class DefaultDetailTable{
	constructor(short_id = null){
	this.required = new Set(["mention1","mention2","geneids1","genedis2","type1","type2","probability"]);
	this.optional = new Set(["journal","article_id","pubmed_id","sentence_id","mention1_offset","mention2_offset","context","section"]);
	this.header = this.set_union(this.required,this.optional);
	this.short_id = short_id;//short id for the datasource
	this.add_cols = null;//additional column
	this.detail_cols;
	this.interaction = {};
	this.addendum = {};
	this.columnMap = new Map();
	//custom columns can be added from edit datasource
	this.columnMap = this.addDetailColumns();
	//this.interaction = {};
	//this.addendum = {};
	
	}


	//=================================
	//return all the optional columns
	getDetailHeader(){
	//=================================
	
	var add_header = new Set();
        //add the additional columns from addendum as well as custom columns added from addDetailTableAPI
	this.detail_cols = Array.from(this.set_union(new Set(Array.from(this.columnMap.keys())), new Set(this.add_cols)));
	if(this.detail_cols != null){
		//append short id to datasource column headers
		this.detail_cols = this.detail_cols.map(element => element + " [" + this.short_id + "]")
		add_header = this.detail_cols;
	}
	return add_header;
	}

	//=================================
	//map the table values for optional columns
	getElement(interaction,arr){
	//=================================
		
		this.interaction = interaction;

		let res = new Map();
		//parse addendum column if available
		if(interaction.addendum && interaction.addendum.length){
			this.addendum = JSON.parse(interaction.addendum);				
		}
		//get custom mapped values
		this.columnMap = this.addDetailColumns(interaction);
		//map the columns in addendum
		for(let key of arr){
		//map columns corresponding to short_id
		if(key.includes(this.short_id)){
			let id = key.substring(0,key.indexOf(this.short_id) - 2);
			//if column is directly mapped from keys of interaction
			if(interaction.hasOwnProperty(id))
				res.set(key, interaction[id]);
			//if column is directly mapped from keys of addendum
			if(this.addendum.hasOwnProperty(id)){
				res.set(key, this.addendum[id]);
			}
			//if column computed from user defined function
			else{
			res.set(key, this.columnMap.get(id));
			}
		}
		else
			res.set(key,"");
		
		}
		return(res);	
	}

	//=================================
	getInteraction(){
	//=================================
		return this.interaction;
	}


	//=================================
	//return value mapped to column
	getColumn(column){
	//=================================

		//get values mapping interaction directly
		if(this.interaction.hasOwnProperty(column))
			return this.interaction[column];
		//get values mapping columns  in addendum
		else if(this.addendum.hasOwnProperty(column))
			return this.addendum[column];
		//get values mapping custom defined columns
		else if(this.columnMap.has(column))
			return this.columnMap.get(column); //default value
		return new Map();
		
	}

	//==================================
	//method to add custom columns
	addDetailColumns(interaction = null){
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
