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
		let $filterValue = $('<select>',{'id':'select' + filterName});
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

}
