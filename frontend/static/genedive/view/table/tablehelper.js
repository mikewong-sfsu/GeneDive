function appendHeader(additional_columns){
	console.log("additional columns:",additional_columns);
	console.log("in the helper function:");
	for(let i = 0; i<additional_columns.length; i++){
  	 this.append( $(document.createElement("th")).text( additional_columns[i] ).attr({ id : 'th-addendum', "toggle": "tooltip", "title": "Addtional information"}) ); 
   }
	console.log("after adding the columns : ",this);

}

function appendBody(additional_columns,row){
if(row.addendum){
  let addendum = JSON.parse(row.addendum);
  for (let i in additional_columns){
    let key = additional_columns[i];
    if(key in addendum){
      console.log("hi");
      this.append( $(document.createElement("td")).html(addendum[key]) );
     }
    else{
      this.append($(document.createElement("td")).html(""));
    }
  }
}

}

