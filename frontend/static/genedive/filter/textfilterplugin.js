class TextFilterPlugin {
	constructor(){
		this.objectMap = new Map();
	}

	createObjectMap(datasources){
		let native_ds = new Set([ "mallory2016" ]);
	
		for(let key of datasources){
			if(native_ds.has(key) )
				this.objectMap.set( key, new DefaultFilter());

			else{
				let className = 'ds_' + key + '_filter';
				let Obj = eval( `new ${className}()` );
				this.objectMap.set( key, Obj );
			}
		}
	}

	buildFilter(interactions){
		let filterList = new Map();

		//combine all filters
		for(let datasource of this.objectMap.values()){
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
