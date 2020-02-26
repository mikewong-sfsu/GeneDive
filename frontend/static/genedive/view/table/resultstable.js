class ResultsTable {

  // ============================================================
  constructor ( table, interactions, additional_columns) {
  // ============================================================
    //super();
    this.table = $(table);
    this.interactions = interactions;
    var inter = interactions;
    this.table.html("");
    this.additional_columns = additional_columns;
    $(".messaging-and-controls").show();
  }
  

  // ============================================================
  buildPubmedLink ( pubmedID ) {
  // ============================================================
    if(pubmedID === "N/A")
      return "N/A";
    else
      return `
      <a class="pubmedLink" href='/api/external_link.php?action=pubmed&pubmedID=${pubmedID}' target='_blank'>
        <i class="fa fa-file-text-o" aria-hidden="true"></i>
        <i class="fa fa-link" aria-hidden="true"></i>
      </a>`;

  }

 
  // ============================================================
  updateMessage ( message ) {
  // ============================================================
    $('.table-view .messaging-and-controls .metadata').html(message);
  }

  // ============================================================
  hideBackButton () {
  // ============================================================
	  $('.table-view .messaging-and-controls .go-back').text('Summary View').css({'cursor':'default','color':'black', 'visibility':'hidden'});
	  $('.table-view .messaging-and-controls .edit-table').css({'visibility':'hidden'});
	  $('.table-view .messaging-and-controls .view-header').text('Summary View').css({'vertical-align':'middle','margin-left':'250px'}); 

  }


  // ============================================================
  showBackButton () {
  // ============================================================
    $('.table-view .messaging-and-controls .go-back').html('<i class="fa fa-arrow-left"></i>Back to Summary Page').css({'cursor':'pointer','color':'#d84b2b','visibility':'visible'});
    $('.table-view .messaging-and-controls .edit-table').html('<a id="edittable" class="edittable centered" title=" Edit columns in Table">Edit Table</a>').css({'cursor':'pointer','visibility':'visible'});
    $('.table-view .messaging-and-controls .view-header').text('Detail View');
    this.onEditTable();
  }

  // ============================================================
  addSynonym ( gene, synonym ) {
  // ============================================================
    return `${gene} <span class="text-muted">[aka ${synonym}]</span>`;
  }

  // ============================================================
  styleExcerpt ( excerpt, symbol, color ) {
  // ============================================================
    if(excerpt != null)
	  return excerpt.replace( new RegExp( `#(${symbol})#`, 'i' ), `<span style="color:${color};">$1</span>` );
    return '';
  }

  // ============================================================
  initHistogram ( group, probabilities ) {
  // ============================================================
    // Init histogram
    d3.select(`#d3-${group}`)
      .datum( this.interactions[group].map( i => i.probability ) )
      .call(
        histogramChart()
        .bins(
          d3.scale
            .linear()
            .ticks(10)
          )
      );
  }

  // ============================================================
  adjustExcerpt(row){
  // ============================================================
    let excerpt = row.context;
    if(excerpt != null){
     if(row.context.trim().toLocaleLowerCase() === "source: pharmgkb"){
       excerpt = `Source: <a href="/api/external_link.php?action=pharmgkb_combination&dgr1=${row.geneids1}&dgr2=${row.geneids2}" target="_blank" onclick="event.stopPropagation()" class="pharmgkb-excerpt-link">PharmGKB #${row.mention1}# #${row.mention2}# Combination <i class="fas fa-external-link-alt"></i></a>`
     }
    excerpt = this.styleExcerpt(excerpt, row.mention1, row.mention1_color);
    excerpt = this.styleExcerpt(excerpt, row.mention2, row.mention2_color);
    return excerpt;
    }
    return '';
  }

  // ============================================================
  mapDatasourceURL(rows){
  // ============================================================
  let row = rows[rows.length - 1];
  row.ds_map = rows.reduce((acc,cur) =>
	  {
		  let name = cur.ds_name;
		  let url = cur.ds_url;
		  let short_id = cur.short_id;
		  if(!defined(name) || !defined(url)){
		  return acc;
		  }
		  acc[name] = [url,short_id];
		  return acc;
	  },{});
  //create an aggregate list
  let res_list = '[';
    let i = 1;
    let len = Object.keys(row.ds_map).length;
    for(let key in row.ds_map){
     if(row.ds_map[key] == null){
      res_list += '<a title=' + key + '>' + i + '</a>';
     }else{
      res_list += "<a class=pubmedLink  target= _blank href=/api/external_link.php?action=ref&url_link=" + row.ds_map[key][0] + " title="+  key.replace(/ /g,'\xa0') +  " >" + row.ds_map[key][1] + "</a>";
     }
     if(i  < len ){
       res_list += ',';
     }
     i++;
    }
   res_list += ']';
   return res_list;
  }

  // ============================================================
  navigateRef(key,value){
  // ============================================================	 
	let res = '';
	if(value == null){
	  res += key;
	}
	else{
	  res += '<a  href=/api/external_link.php?action=ref&url_link=' + value + ' target=_blank>'+ key + '</a>';
	}
	return res;
  }

  // ============================================================
  refLink () {
  // ============================================================
	$(".grouped a").click(function(e){e.stopPropagation();});

  }

  // ============================================================
onEditTable(){
  // ============================================================
	$('#edittable').click(function (e) {

	let columnheader = $('<div id="columnheaders" ></div>');
	var detailTable = $('#result-table');
	let headers = [];
	//get headers
	for( let col = 0,cell;cell = detailTable[0].rows[0].cells[col] ;col++){
		let text = cell.innerHTML;
		text = text.replace(/ /g,'\xa0') 	
		if(text.includes("DGR")){
			text = "DGR"+text.charAt(text.indexOf("<sub>") + 5);
		}
		headers.push(text);
	}
	
	let row = $('<div class="row" ></div>');
	let lst = row.clone();
	//sort the headers
	headers.sort();
	//add headers as checkbox
  	$.each(headers,function(key,value){
  	lst.append($("<span class='checkbox-button'><input id="+ value +" type='checkbox' name='columnheader' value = " + value + " checked/><label for=" +value+">"+value+"</label></span>"));
	//return console.log("key:"+ key + "value:"+value);	
  	});
  	columnheader.append(lst);

	alertify.confirm('Edit Table', columnheader.html(),
	//OK function
	function(){ 
		var hideHeader = new Set();
		var indexes = {};
            	$("input:checkbox:not(:checked)").each(function() {
   		hideHeader.add(this.value);
		});
	 	var detailTable = $('#result-table');
		//update the columns in table
		for( let col = 0,cell;cell = detailTable[0].rows[0].cells[col] ;col++){
			let text = cell.innerHTML;
			text = text.replace(/ /g,'\xa0') 
			if(text.includes("DGR")){
				text = "DGR"+text.charAt(text.indexOf("<sub>") + 5);
			}
			//toggle
			if(hideHeader.has(text)){
				$('table tr').find('td:eq(' + col + '),th:eq('+ col + ')').hide();
			}else{
				$('table tr').find('td:eq(' + col + '),th:eq('+ col + ')').show();
			}
    		}
	},
	//CANCEL function
	function(){ }) ;	
});
}

}
