class DefaultTable{
	constructor(){
	this.required = new Set(["mention1","mention2","geneids1","genedis2","type1","type2","probability"]);
	this.optional = new Set(["journal","article_id","pubmed_id","sentence_id","mention1_offset","mention2_offset","context","section"]);
	this.header = this.set_union(this.required,this.optional);
	
	}
	
	getHeader(){
		return([]);//(this.header);
	}
	getElement(interaction,arr){
		var res = new Map();
		for(let i = 0 ;i < arr.length;i++){
			if(interaction.addendum && interaction.addendum.length){
			let addendum = JSON.parse(interaction.addendum);
			if(arr[i] in addendum)
				res.set(arr[i],addendum[arr[i]]);
			else
				res.set(arr[i],"");
			}
		}
		return(res);
		
	}

	set_union(setA,setB){
		var union = new Set(setA);
		for(let i of setB)
			union.add(i);
		return union;
	}
}
