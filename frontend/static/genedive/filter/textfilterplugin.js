class TextFilterPlugin {
	constructor(){
		this.objectMap = new Map();
	}

	createObjectMap(datasources){
		var default_ds = new Set(["native","pharmgkb","plos-pmc"]);
	
		for(var key of Object.keys(datasources)){
			if(default_ds.has(key) )
				this.objectMap.set(key,eval("new DefaultFilter()"));

			else{
				let className = 'ds_' + key + '_filter';
				let Obj = eval("new "+className+"( \"" + datasources[key]+ "\")");
				this.objectMap.set(key,Obj);
			}
		}
	}

	buildFilter(interactions){
		var filterList = new Map();

		//combine all filters
		for(var datasource of this.objectMap.values()){
			filterList =new Map([...filterList, ...(datasource.addFilters(interactions))]);
		}
		return filterList;
	}

}

class Filter{
	constructor(filterName, filterFunction, filterSelector = $('<input>',{'id':'filterText'}), selectorValue = null  ){
		this.attribute = filterName;
		this.filterFunction = filterFunction;
		this.filterValue = filterSelector;
		this.addSelector = selectorValue;
	}
}
