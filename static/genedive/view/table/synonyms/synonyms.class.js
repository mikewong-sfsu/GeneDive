class Synonyms {

	constructor (targetElement, rowClass, tagClass) {
		this.targetElement = targetElement || "#synonym-display";
		this.rowClass = rowClass || "synonym-row";
		this.tagClass = tagClass || "synonym";
	}

	display (genes) {
		WebdiggrAPI.getSynonyms(genes.map(function(item) {return item.id}).toString(), function (synonyms) {	
			// this might be the only O(n^2) in the whole codebase
			for (let gene of genes) {
				for (let s of JSON.parse(synonyms)) {
					if (gene.id == s[0]) {
						Webdiggr.TableView.Synonyms.attachRow(Webdiggr.TableView.Synonyms.createRow(gene.color, gene.symbol, s[2].split('|').concat(s[1])));
					}
				}
			}
		});
	}

	createRow (color, symbol, aliases) {
		var row = $(`<div class="${this.rowClass}"></div>`);
		row.append(`<span style="background-color:${color}" class="${this.tagClass}">${symbol}</span>`);
		row.append(` has known synonyms `);
		for (let a of aliases) {
			row.append(`<span style="background-color:${color}" class="${this.tagClass}">${a}</span>`);
		}
		return row;
	}

	attachRow (row) {
		$(this.targetElement).append(row);	
	}

	clear () {
		$(this.targetElement).empty();	
	}

}