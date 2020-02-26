class BuildTable extends ResultsTable{
	//===========================
	constructor(table,interactions,additional_columns,ds){
	//===========================
		super(table,interactions,additional_columns);
		this.default_ds = new Set(["all","pharmgkb","plos-pmc"]);
		this.objectMap = new Map();
		//create instances of the merging datasources
		for( var key of Object.keys(ds)){
			if(this.default_ds.has(key) )
				//continue;
				this.objectMap.set(key,eval("new DefaultTable()"));

			else{
				let className = 'ds_' + key;
				let Obj = eval("new "+className+"( \"" + ds[key]+ "\")");
				this.objectMap.set(key,Obj);
			}
				
		}

	}
	//===========================
	//combine all datasource header
	buildHeader(){
	//===========================
		let res = new Set();
		for(let v of this.objectMap.values()){
			let head = v.getHeader();
			res = v.set_union(res,head);
		}
		return Array.from(res);

	}
	//=============================
	//map the values in merged table
	buildBody(row,arr){
	//=============================
		let ds_class = row.ds_id;
		if(this.objectMap.has(ds_class)){
			return this.objectMap.get(ds_class).getElement(row,arr);
		}
	}
}
