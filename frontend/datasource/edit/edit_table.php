<?php
$dslist = json_decode( base64_decode( $_SESSION[ 'sources' ]));
$path ="/var/www/html/datasource/view/table/plugin/sources/";
if( $dslist == '' ) { $dslist = []; }


?>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <link rel="stylesheet" type="text/css" href="/static/bootstrap/bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="/static/fontawesome/css/all.min.css">
  <link rel="stylesheet" type="text/css" href="editdatasource.css">
  <link rel="stylesheet" type="text/css" href="codemirror/lib/codemirror.css">
  <title>Edit a Data Source</title>
</head>
<body>
  <script type="text/javascript" src="/static/jquery/jquery-3.2.1.min.js"></script>
  <script type="text/javascript" src="codemirror/lib/codemirror.js"></script>
  <li class="datasource-list-item list-group-item">
    <div class="datasource-info">
      <h5 class="name">Name</h5>
      <p class="description">Description</p>
    </div>
    <div class="datasource-actions">
      <input class="datasource-select" type="radio" name="selectDatasource"></input>
    </div>
  </li>
  <div class="container">
  <div class="page-header"><h1>Edit Data Source<button class="btn btn-primary cancel pull-right">Return to Search</button></h1></div>
  <p>You can edit table columns displayed or map new columns into GeneDive to query, visualize, and compare with
    provided data sources or your other data sources.</p>
  <div class="row">
  <div class="col-xs-2"></div>
    <div class="col-xs-8">
      <div class="panel panel-primary">
	<div class="panel-heading"><h3 class="panel-title">Edit a Data Source</h3></div>
	<div class="panel-body">
	Select the datasource to edit
	  <form id="edit_ds" method="post" enctype="multipart/form-data" class="form-horizontal">	
	    <div id="datasource-manager">
	      <ul class="list-group">
	      </ul>
	    </div> 
	  </form>
	</div>
      </div>
    </div>
    <div class="col-xs-2"></div>
  </div>
  </div>
  <!--code editor-->
  <div class="container">
    <h2>
      Edit here
    </h2>
   <button class="btn  btn-primary btn_edit" id="datasource-edit" style="float: right;"><span class="fas fa-play"></span>&nbsp;Update</button> 
    <div id="editor"></div>
  </div>
  <div><br><br></div>
</body>
<script>
//Map the datasources on UI
datasource = {};
datasource.list = <?= json_encode( $dslist ) ?>;
var manifest = <?php include( '/usr/local/genedive/data/sources/manifest.json' ); ?>;
// ===== INITIALIZE DATASOURCE MANAGER
var listitem = $( '.datasource-list-item' ).detach();
datasource.refreshUI = () => {
console.log("inside refreshUI");
Object.entries( manifest ).forEach(([ key, datasource ]) => {
let entry = listitem.clone().css({ display: 'block' });
entry.find( '.name' ).html( datasource.name );
entry.find( '.description' ).html( datasource.description );
let toggle = entry.find( 'input.datasource-select' );
toggle.attr({ id: datasource.id ,value:datasource.id});
$( '#datasource-manager .list-group' ).append( entry );
});
};
datasource.refreshUI();

$(document).ready(function() {

//initialize the code editor
var editor = CodeMirror(document.getElementById("editor"), {
    value: "Select datasource to populate editor",
    mode: "javascript",
    indentUnit: 4,
    lineNumbers: true
});
//on selecting radio button
$('input[type=radio]').on('change', function(){
  ds_id = $('input[name="selectDatasource"]:checked').val();
  $.ajax({
    method: "POST",
    url: "import.php",
    data: { ds_id: ds_id },
    //sucess: function(data){ return data;}
  })
  .done(function( msg ) {
    ds = msg.toString();
    //set the code of corresponding class in editor
    editor.setValue(ds);
  });
});
//update the file with new changes
$('.btn_edit').on('click',function(){
  var retVal = confirm("Do you confirm to save the changes ?");
  if( retVal == true ) {
   $.ajax({
     url:"update.php",
     type:"POST",
     dataType:'html',
     data:{data : editor.getValue() }
     //success:function(result){
       //	location.reload();
	//alert(result);
   }) 
   .done(function(msg){
     location.reload();
   });
   return true;
  } else {
    return false;
  }
})

//close button
$( "button.cancel" ).off( 'click' ).click(( ev ) => {
  self.opener.location.reload(); 
  window.close();
});

});

</script>
