class BuildTable extends ResultsTable{
	constructor(table,interactions,additional_columns,ds){
		super(table,interactions,additional_columns);
		this.objectMap = new Map();
		console.log("ds = ",ds);
		for(let i = 0 ; i < ds.length;i++){
			if(ds[i] == 'all')
				//continue;
				this.objectMap.set(ds[i],eval("new DefaultClass()"));

			else{
				let className = 'ds_' + ds[i];
				this.objectMap.set(ds[i],eval("new "+className + "()"));
			}
				
		}

	}
	buildHeader(){
		let res = new Set();
		for(let v of this.objectMap.values()){
			let head = v.getHeader();
			res = v.set_union(res,head);
		}
		console.log("buildHeader = ",res);
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
