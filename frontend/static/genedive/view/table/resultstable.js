class ResultsTable {

  // ============================================================
  constructor ( table, interactions, additional_columns) {
  // ============================================================
    //super();
    this.table = $(table);
    this.interactions = interactions;
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
	  $('.table-view .messaging-and-controls .go-back').text('Summary View').css({'cursor':'default','color':'black'});

  }

  // ============================================================
  showBackButton () {
  // ============================================================
    $('.table-view .messaging-and-controls .go-back').html('<i class="fa fa-arrow-left"></i>Back to Summary Page').css({'cursor':'pointer','color':'#d84b2b'});
  }

  // ============================================================
  addSynonym ( gene, synonym ) {
  // ============================================================
    return `${gene} <span class="text-muted">[aka ${synonym}]</span>`;
  }

  // ============================================================
  styleExcerpt ( excerpt, symbol, color ) {
  // ============================================================
    return excerpt.replace( new RegExp( `#(${symbol})#`, 'i' ), `<span style="color:${color};">$1</span>` );
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
     if(row.context.trim().toLocaleLowerCase() === "source: pharmgkb"){
       excerpt = `Source: <a href="/api/external_link.php?action=pharmgkb_combination&dgr1=${row.geneids1}&dgr2=${row.geneids2}" target="_blank" onclick="event.stopPropagation()" class="pharmgkb-excerpt-link">PharmGKB #${row.mention1}# #${row.mention2}# Combination <i class="fas fa-external-link-alt"></i></a>`
     }
    excerpt = this.styleExcerpt(excerpt, row.mention1, row.mention1_color);
    excerpt = this.styleExcerpt(excerpt, row.mention2, row.mention2_color);
    return excerpt;
  }

  // ============================================================
  mapDatasourceURL(rows){
  // ============================================================
  let row = rows[rows.length - 1];
  row.ds_map = rows.reduce((acc,cur) =>
	  {
		  let name = cur.ds_name;
		  let url = cur.ds_url;
		  if(!defined(name)){
		  return acc;
		  }
		  acc[name] = url;
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
      res_list += '<a  target= _blank href=/api/external_link.php?action=ref&url_link=' + row.ds_map[key] + ' title='+  key + ' >' + i + '</a>';
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
}
