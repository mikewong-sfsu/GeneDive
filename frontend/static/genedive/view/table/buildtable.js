class BuildTable extends ResultsTable{
	constructor(table,interactions,additional_columns,ds){
		super(table,interactions,additional_columns);
		this.default_ds = new Set(["all","pharmgkb","plos-pmc"]);
		this.objectMap = new Map();
		for(let i = 0 ; i < ds.length;i++){
			if(this.default_ds.has(ds[i]) )
				//continue;
				this.objectMap.set(ds[i],eval("new DefaultTable()"));

			else{
				let className = 'ds_' + ds[i];
				let Obj = eval("new "+className+"()");
				this.objectMap.set(ds[i],Obj);
			}
				
		}

	}
	buildHeader(){
		let res = new Set();
		for(let v of this.objectMap.values()){
			let head = v.getHeader();
			res = v.set_union(res,head);
		}
		return Array.from(res);

	}

	buildBody(row,arr){
		//let res = [];
  	//for(let i = 0; i < interactions.length;i++){
			let ds_class = row.ds_id;
			if(this.objectMap.has(ds_class)){
				return this.objectMap.get(ds_class).getElement(row,arr);
			}
		//}
		//return res;
	}
}
