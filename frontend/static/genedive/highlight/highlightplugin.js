class HighlightPlugin {
	constructor(){
		this.objectMap = new Map();
	}

	createObjectMap(datasources){
		var default_ds = new Set(["native","pharmgkb","plos-pmc"]);
	
		for(var key of datasources){
			if(default_ds.has(key) )
				this.objectMap.set(key,eval("new DefaultHighlight()"));

			else{
				let className = 'ds_' + key + '_highlight';
				let Obj = eval("new "+className+"()");
				this.objectMap.set(key,Obj);
			}
		}
	}

	buildHighlight(interactions, term){
		var highlightList = new Map();
		//combine all filters
		for(var datasource of this.objectMap.values()){
			highlightList =new Map([...highlightList, ...(datasource.addHighlight(interactions, term))]);
		}
		return highlightList;
	}

}

