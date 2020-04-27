class ds_58fabfa7_filter extends DefaultFilter{
	/*constructor(){
	}*/

	addFilters(interactions){
		var filterMap = new Map();
		filterMap.set("Max Score Theme",this.filterThemeByMaxScore(interactions));
		filterMap.set("Theme Filter", this.filterThemeByValue(interactions));
		return filterMap;
	}

	filterThemeByValue(interactions){
		//get Themes as dropdown option
		var themeOptions = this.getThemes(interactions);
		//create a dropdown of theme-code
		let $themeOption = $('<select>',{'id':'selectThemeScore', 'class':'col-sm-4'});
		Array.from(themeOptions).sort().map((i) =>{
			$themeOption.append($(`<option value="${i}"/>`).html(i));
		});
		//get equality
		let $equality = $('<select>',{'id':'selectEquality', 'class':'col-sm-4'});
		let equality = ['score >', 'score <', 'score ='];
		equality.map((i) =>{
			$equality.append($(`<option value="${i}"/>`).html(i));
		});
		//prepare filter html
		let $filterValue = $("<div class='themeFilter' style='display:flex'</div>");
		$filterValue.append($themeOption);
		$filterValue.append($equality);
		$filterValue.append("<input class='col-sm-4'type='number' step=0.001 min=0 max=1.0 id='ThemeScore' value='0.999' />");
		//create filter
		return new Filter("Theme Filter", this.filterByTheme, $filterValue, this.themeFilterSelector );	
	}

	themeFilterSelector(){
		//get filter inputs
		let filterString = [];
		//get selections
   		filterString = $("option:selected").map(function(){ return this.value }).get();
		filterString.shift();
		//get themescore
		filterString = filterString.join(' ') + " " + $('#ThemeScore').val();
		return filterString;
	}


	filterByTheme(interactions,attribute){
		let filteredInteractions = interactions.filter((i) => {
		let additional_col = super.getValue(i,"additional_column");
		if(additional_col){
			let themes = JSON.parse(additional_col).theme;
			let tokens = attribute.split(" ");
			switch(tokens[2]){
			//greater than
			case ">": return (themes.find(t => (t.code == tokens[0] && t.score > tokens[3])));
			//lesser than
			case "<": return (themes.find(t => (t.code == tokens[0] && t.score < tokens[3])));
			//equal to
			case "=": return (themes.find(t => (t.code == tokens[0] && t.score == tokens[3])));
			}
		}
		});
        return filteredInteractions;
	}

	filterThemeByMaxScore(interactions){
		//get Themes as dropdown option
		var themeOptions = this.getThemes(interactions);
		//create a dropdown of theme-code
		let $filterValue = $('<select>',{'id':'selectMaxThemeScore'});
		Array.from(themeOptions).sort().map((i) =>{
			$filterValue.append($(`<option value="${i}"/>`).html(i));
		});
		//maxScoreTheme filter
		return new Filter("MaxThemeScore", this.getMaxThemeScore, $filterValue);
	}

	//get all theme values
	getThemes(interactions){
		var themes = new Set();
		for(let i of interactions){
			let additional_col = super.getValue(i, "additional_column");
			if(additional_col){
			let theme = JSON.parse(additional_col)["theme"];
			for( let i in theme){
				themes.add(theme[i]["code"]);
			}
			}
		}
		return themes;
	}
	//filter function for maxScoreTheme
    	getMaxThemeScore(interactions, attribute){
		let filteredInteractions = interactions.filter((i) => {
		let additional_col = super.getValue(i,"additional_column");
		if(additional_col){
		let themes = JSON.parse(additional_col).theme;
		let maxTheme = themes.reduce(function(prev, current) {
			if(prev.hasOwnProperty("curated")){
				return prev;
			}
    			return (prev.score > current.score) ? prev : current
		});
		return maxTheme.code == attribute;
		}
	
	});
        return filteredInteractions;
    }
}

