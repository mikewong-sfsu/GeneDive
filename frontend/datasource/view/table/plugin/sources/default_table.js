class DefaultTable{
	constructor(short_id = null){
	this.required = new Set(["mention1","mention2","geneids1","genedis2","type1","type2","probability"]);
	this.optional = new Set(["journal","article_id","pubmed_id","sentence_id","mention1_offset","mention2_offset","context","section"]);
	this.header = this.set_union(this.required,this.optional);
	this.short_id = short_id;//short id for the datasource
	this.add_cols = null;//additional column
	this.detail_cols;//custom columns can be added from edit datasource
	this.columnMap = this.addColumns();
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
	//return all the optional columns
	getDetailHeader(){
	//=================================
	
	var add_header = new Set();
	this.detail_cols = Object.keys(this.columnMap);
	this.detail_cols = Array.from(this.set_union(new Set(this.detail_cols), new Set(this.add_cols)));
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
		var res = new Map();
		var addendum = {};
		this.addRequiredColumns(interaction);
		if(interaction.addendum && interaction.addendum.length){
			addendum = JSON.parse(interaction.addendum);
			this.interaction = Object.assign({},this.interaction,addendum);
	
		}
	
		//for native datasource columns
		for(let i = 0 ;i < arr.length;i++){
			if(addendum.hasOwnProperty(arr[i]))
				res.set(arr[i],addendum[arr[i]]);
			else
				res.set(arr[i],"");
		}
		//get all the custom mapping from user//edit datasource
		this.columnMap = this.addColumns(interaction);
		//this.addRequiredColumns(interaction);

		//for local datasource columns
		if(Array.isArray(this.detail_cols) && this.detail_cols.length > 0){
			let key;
			for(let i = 0; i < this.detail_cols.length;i++){
				//remove the short_id from name
				key = this.detail_cols[i].substring(0,this.detail_cols[i].indexOf(this.short_id) - 2);

				//get the mapping from the columnMap
				if(res.has(this.detail_cols[i]))
					res.set(this.detail_cols[i], this.getColumn(this.interaction, key));
			}

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
	getColumn(addendum, column){
	//=================================
		//base condition
		if(typeof addendum == 'undefined')
			return '{}';
		//if value present in columnMap based on custom function
		if(this.columnMap.hasOwnProperty(column))
			return this.columnMap[column];
		//map the columns within addendum
		if(addendum.hasOwnProperty(column))
			return addendum[column];
		return '{}';
		
	}
	addRequiredColumns(interaction){
		this.columnMap['DGR1'] = interaction.mention1;
		this.columnMap['DGR2'] = interaction.mention2;
		this.columnMap['Article ID'] = interaction.pubmed_id;
		this.columnMap['C. Score'] = interaction.probability;
		//this.columnMap['Excerpt'] = interaction.context;
	}
	//==================================
	//method to add custom columns
	addColumns(interaction = null){
	//==================================
		return new Map();
	}
	//==================================
	//method to add custom columns
	addSummaryColumns(interaction = null){
	//==================================
		return new Map();
	}
	//==================================
	//method to rename custom columns
	replace(old_name,new_name){
	//==================================
		//
		///this.columnMap[new_name] = this.columnMap[old_name];

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
