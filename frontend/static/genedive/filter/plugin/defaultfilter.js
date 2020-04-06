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

	getDropdown(interactions, attribute, filterName){
		var options = new Set();
		interactions.forEach( i =>{
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

	getValue(interaction, attribute){
		var fields = new Set(['pubmed_id', 'probability', 'mention1', 'mention2', 'geneids1', 'geneids2', 'type1', 'type2']);
		if(fields.has(attribute))
			return interaction.attribute;
		if(interaction.hasOwnProperty('addendum')){
			var addendum = JSON.parse(interaction.addendum);
			for(let attr in addendum){
				if(attr == attribute){
					return addendum[attr];
				}
			}
		}
		return null;
	}

}
