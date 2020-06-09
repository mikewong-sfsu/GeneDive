class DefaultHighlight{
	constructor(){
	}

	addHighlight(interactions, term){
		var highlightMap = new Map();
		var fields = ['journal'];
		for(let field of fields){
			highlightMap.set(field, ((interactions,term) => interactions.map((i) => { i.highlight = new RegExp(term,"i").test(`${i.journal}`); return i;})));
		}
		return highlightMap;
	}

	getColumn(columnName, interaction){
		//directly available in interaction onject
		if(interaction.hasOwnProperty(columnName))
			return interaction[columnName];
		if(interaction.hasOwnProperty('addendum')){
			let addendum = JSON.parse(interaction.addendum);
			if(addendum.hasOwnProperty(columnName)){
				return addendum[columnName];
			}
		}
			return [];
	}

}
