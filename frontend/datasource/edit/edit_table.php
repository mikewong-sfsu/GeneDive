<?php
$dslist = json_decode( base64_decode( $_SESSION[ 'sources' ]));
$path ="/var/www/html/datasource/view/table/plugin/sources/";
if( $dslist == '' ) { $dslist = []; }


?>
<?php include_once( '../../session.php' ); ?>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <link rel="stylesheet" type="text/css" href="/static/bootstrap/bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="/static/alertify/css/alertify.min.css">
  <link rel="stylesheet" type="text/css" href="/static/alertify/css/alertify.bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="/static/fontawesome/css/all.min.css">
  <link rel="stylesheet" type="text/css" href="editdatasource.css">
  <link rel="stylesheet" type="text/css" href="codemirror/lib/codemirror.css">
  <link rel="stylesheet" type="text/css" href="codemirror/addon/fold/foldgutter.css">
  <link rel="stylesheet" type="text/css" href="https://codemirror.net/addon/lint/lint.css">
  <title>Edit a Data Source</title>
</head>
<body>
  <script type="text/javascript" src="/static/jquery/jquery-3.2.1.min.js"></script>
  <script type="text/javascript" src="/static/alertify/js/alertify.min.js"></script>
  <script type="text/javascript" src="/static/genedive/alertify-defaults.js"></script>
  <script type="text/javascript" src="codemirror/lib/codemirror.js"></script>
  <script type="text/javascript" src="codemirror/addon/fold/foldcode.js"></script>
  <script type="text/javascript" src="codemirror/addon/fold/foldgutter.js"></script>
  <script type="text/javascript" src="codemirror/addon/fold/brace-fold.js"></script>
  <script type="text/javascript" src="codemirror/addon/fold/indent-fold.js"></script>
  <script type="text/javascript" src="codemirror/addon/fold/comment-fold.js"></script>
  <script src="codemirror/addon/edit/closebrackets.js"></script>
  <script type="text/javascript" src="codemirror/mode/javascript/javascript.js"></script>
  <script src="https://unpkg.com/jshint@2.9.6/dist/jshint.js"></script>
  <script src="https://unpkg.com/jsonlint@1.6.3/web/jsonlint.js"></script>
  <script src="https://unpkg.com/csslint@1.0.5/dist/csslint.js"></script>
  <script src="codemirror/addon/lint/lint.js"></script>
  <script src="codemirror/addon/lint/javascript-lint.js"></script>
  <script src="codemirror/addon/lint/json-lint.js"></script>
  <script src="codemirror/addon/lint/css-lint.js"></script>
<!-- -->
<div class="container">
<div class="page-header">
	<h1>Edit Tables</h1>
	<p>You can edit table columns displayed or map new columns into GeneDive 
	to query, visualize, and compare with provided data sources or your other data sources.Columns 
	removed will not be displayed in the hide columns option on the Details view</p>
	<!--button id="edit-summary" class="btn btn-primary">Edit Summary View</button-->
	<button id="edit-detail" class="btn btn-primary">Edit Detail View</button>
	<button class="btn btn-primary cancel">Return to Search</button>		
</div>
<form id="datasource-edit" method="post" enctype="multipart/form-data" class="form-horizontal">	
	<div id="datasource-manager">
		<ul class="list-group" id="datasources-available-for-edit">
		</ul>
	</div> 
</form>

<li class="datasource-edit-item list-group-item row">
  <div class="datasource-info col-xs-10">
    <h5 class="name">Name</h5>
    <p class="description">Description</p>
  </div>
  <div class="datasource-actions col-xs-2" style="margin-top: 18px;">
   <input class="datasource-select" type="radio" name="selectDatasource"></input> 
  </div>
</li>

</div>
<!-- -->
  <!--code editor-->
  <div class="container">
    <h2>
      Table Plugin for datasource <span id="ds_name"> </span>
    </h2>
    <div id="editor" style="position :relative;">
	 <button  class=" btn btn-primary btn_edit" id="datasource-edit" style="z-index: 10; right:110px; position: fixed;">Update Datasource</button>
    </div>
  </div>
  <div><br><br></div>
</body>
<script>
datasource = {};
datasource.list = <?= json_encode( $dslist ) ?>;
var manifest = <?php include( '/usr/local/genedive/data/sources/manifest.json' ); ?>;
var edit = $( '.datasource-edit-item' ).detach();
refreshEditUI = () => {
  $( '#datasources-available-for-edit' ).empty();
  Object.entries( manifest ).forEach(([ id, datasource ]) => {
    if( id.match( /^(?:plos-pmc|pharmgkb)$/ )) { return; }
    let entry = edit.clone();
    entry.find( '.name' ).html( datasource.name );
    entry.find( '.description' ).html( datasource.description );
    entry.attr({ 'data-id': datasource.id, 'data-name': datasource.name });
    let toggle = entry.find( 'input.datasource-select' );
    toggle.attr({ id: datasource.id ,value:datasource.id});
   $( '#datasources-available-for-edit' ).append( entry );
  });
};
refreshEditUI();

//initialize the code editor
var editor = CodeMirror(document.getElementById("editor"), {
    value: "Select datasource to populate editor",
    mode: "javascript",
    indentUnit: 4,
    lineNumbers: true,
    lineWrapping: true,
    extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor());
    }},
    foldGutter: true,
    gutters: ["CodeMirror-lint-markers","CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    lint: true,
    height:"auto",
    autoCloseBrackets: true
});
//editor.setOption("lint",true);
editor.setSize("100%", "100%");
editor.foldCode(CodeMirror.Pos(0, 0));
//on selecting radio button
var dse_selected = () => {
  ds_id = $('input[name="selectDatasource"]:checked').val();
  $.ajax({
    method: "POST",
    url: "import.php",
    data: { ds_id: ds_id },
  })
  .done(function( msg ) {
    ds = msg.toString();
    //set the code of corresponding class in editor
    editor.setValue(ds);
  });
}
//update the file with new changes
$('.btn_edit').on('click',function(){
  var retVal = confirm("Do you confirm to save the changes ?");
  if( retVal == true ) {
   $.ajax({
     url:"update.php",
     type:"POST",
     dataType:'html',
     data:{data : editor.getValue() }
   }) 
	   .done(function(msg){
   });
  } 
})

//close button
$( "button.cancel" ).off( 'click' ).click(( ev ) => {
  self.opener.location.reload(); 
  window.close();
  });

var dse = $( '#datasource-edit' ).detach();

let dse_show = () => {
    alertify.confirm( 
      'Select datasource to edit', 
      dse.html(),
      () =>  { 
      	dse_selected();
	},
      () => {}
    );
}

$( "#edit-detail" ).click(function()  {
  dse_show();
});

$( "#edit-summary").click(function() {
  var ds_id = "summarytable";
  $.ajax({
    method: "POST",
    url: "import.php",
    data: { ds_id: ds_id },
  })
  .done(function( msg ) {
    ds = msg.toString();
    //set the code of corresponding class in editor
    editor.setValue(ds);
  }); 
});
</script>
