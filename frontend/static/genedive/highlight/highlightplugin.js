class HighlightPlugin {
	constructor() {
		this.objectMap = new Map();
	}

	createObjectMap( datasources ) {
		let native_ds = new Set([ "mallory2016" ]);
	
		for( let key of datasources ) {
			if( native_ds.has(key )) {
				this.objectMap.set(key, new DefaultHighlight());

			} else {
				let className = 'ds_' + key + '_highlight';
				let Obj = eval("new "+className+"()");
				this.objectMap.set(key,Obj);
			}
		}
	}

	buildHighlight( interactions, term ) {
		let highlightList = new Map();
		//combine all filters
		for( let datasource of this.objectMap.values()) {
			highlightList = new Map([ ...highlightList, ...(datasource.addHighlight( interactions, term ))]);
		}
		return highlightList;
	}

}

