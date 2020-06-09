class DefaultFilter{
	constructor(){
	}

	addFilters(interactions){

		var filterMap = new Map();
		filterMap.set("Journal", this.getDropdown(interactions, "journal", "Journal"));
		filterMap.set("Section", this.getDropdown(interactions, "section", "Section"));
		filterMap.set("Excerpt", this.getDropdown(interactions, "excerpt", "Excerpt"));
		return filterMap;
	}

	addHighlight(interactions){
		var highlightMap = new Map();
		var fields = ['mention1', 'mention2', 'ds_name', 'short_id','context'];
		for(let field of fields){
			highlightMap.set(field,this.getHighlight);//((interactions,field) => { interactions.map((i) => i.highlight = true) return i;}));
		}
		/*for(let field of fields){
I	        highlightMap.set(field, interactions.map( ( i ) => { i.highlight = new RegExp(term,"i").test(`${i.mention1}` )}));//${i.mention1} ${i.mention2}`); return i; });
		}*/
		return highlightMap;
	}

	getHighlight(interactions, attribute){
		return attribute;
	}



	getDropdown(interactions, attribute, filterName){
		var options = new Set();
		interactions.forEach( i =>{
			if(i[attribute] != "NULL")
				options.add(i[attribute]);
		})
		var $filterValue = $('<select>',{'id':'select' + filterName});
		Array.from(options).sort().map((i) =>{
			$filterValue.append($(`<option value="${i}"/>`).html(i));
		});
		switch(attribute){
			case "journal":
				return new Filter(filterName, this.filterJournal, $filterValue);
			case "section":
				return new Filter(filterName, this.filterSection, $filterValue);
			default:
				return new Filter(filterName, this.filterExcerpt);

		}
		//return new Filter(filterName, this.filterFunc, $filterValue);
	}

	filterJournal(interactions, attribute){
		return interactions.filter((i) => new RegExp(attribute, "i").test(i.journal));
	}

	filterSection(interactions, attribute){
		return interactions.filter((i) => new RegExp(attribute, "i").test(i.section));
	}

	filterExcerpt(interactions, attribute){
		return interactions.filter((i) => new RegExp(attribute, "i").test(i.context));
	}

	getColumn(columnName, interaction){
		var fields = new Set(['pubmed_id', 'probability', 'mention1', 'mention2', 'geneids1', 'geneids2', 'type1', 'type2']);
		if(fields.has(columnName))
			return interaction.columnName;
		if(interaction.hasOwnProperty('addendum')){
			var addendum = JSON.parse(interaction.addendum);
			for(let attr in addendum){
				if(attr == columnName){
					return addendum[attr];
				}
			}
		}
		return null;
	}

}
