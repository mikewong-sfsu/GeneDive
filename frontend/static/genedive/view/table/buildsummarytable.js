class BuildSummaryTable extends ResultsTable{
	//===========================
	constructor(table,interactions,additional_columns, ds){
	//===========================
		super(table,interactions,additional_columns);
		this.default_ds = new Set(["native","pharmgkb","plos-pmc"]);
		this.objectMap = new Map();
		//create instances of the merging datasources
		for( var key of Object.keys(ds)){
			if(this.default_ds.has(key) )
				this.objectMap.set(key,eval("new DefaultSummaryTable()"));

			else{
				let className = 'ds_' + key + "_sum";				
				let Obj = eval("new "+className+"( \"" + ds[key]+ "\")");
				this.objectMap.set(key,Obj);
			}
				
		}

	}
	//===========================
	//combine all datasource header
	buildSummaryHeader(){
	//===========================
		let res = new Set();
		for(let v of this.objectMap.values()){
			let head = v.getSummaryHeader();
			res = v.set_union(res,head);
		}
		return Array.from(res);

	}
	//=============================
	//map the values in merged table
	buildSummaryBody(rows,group_id){
	//=============================
	var summaryEle = new Map();
	for(var row of rows){
		var ds_class = row.ds_id;
		summaryEle = Object.assign(summaryEle, this.objectMap.get(ds_class).getSummaryElement(rows, group_id ));
	}
		return summaryEle;
	}

}
