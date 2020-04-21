class DefaultHighlight{
	constructor(){
	}

	addHighlight(interactions){
		var highlightMap = new Map();
		var fields = ['journal'];
		for(let field of fields){
			highlightMap.set(field, () => interactions.map((i) => { i.highlight = new RegExp(term,"i").test(i.journal); return i;}))
		}
		return highlightMap;
	}
}
