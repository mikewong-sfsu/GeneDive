<?php include_once( '../session.php' ); ?>
<html>

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <link rel="stylesheet" type="text/css" href="/static/bootstrap/bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="/static/fonts/css/fontawesome.min.css">
  <link rel="stylesheet" type="text/css" href="/static/fonts/css/fa-solid.min.css">
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>

  <title>Add a Data Source</title>
  <style>

#required-fields th.field,td.field {
  width: 20%;
}

#required-fields th.description,td.description {
  width: 80%;
}

.goto-top {
  color: #333;
  border: 0;
  cursor: n-resize;
}

small {
  margin: 0 0 0 6px;
}

.actions {
  width: 100%;
}

button{
  margin: auto;
  position:relative;
}

form button {
  position: relative;
  bottom: 0;
}

form button[type="submit"] {
  left: calc( 100% - 208px );
}

form button.cancel {
  left: calc( 100% - 246px );
}

.datasource-list-item {
  height: 96px;
}

.datasource-list-item .datasource-info {
  position: absolute;
  top: 0;
  left: 0;
  width: calc( 100% - 120px );
  height: 96px;
  padding: 5px 15px 5px 15px;
}

.datasource-list-item .datasource-actions {
  position: absolute;
  top: 0;
  right: 0;
  width: 120px;
  height: 96px;
}

.datasource-list-item .datasource-actions {
  position: absolute;
  top: 32px;
}


  </style>

</head>

<body>
  <div class="container">
    <div class="page-header"><h1>Add or Remove Data Source</h1></div>
    <p>You can import your data into GeneDive to query, visualize, and compare with
    provided data sources or your other data sources. You can remove your data
    sources at any time. Your data remains local to your computer and is never
    transmitted to the GeneDive server or any other server.</p>
    <div class="row">
      <div class="col-xs-2"></div>
      <div class="col-xs-8">
        <div class="panel panel-primary">
          <div class="panel-heading"><h3 class="panel-title">Add a Data Source</h3></div>
          <div class="panel-body">
            <p>All fields are required.</p>
            <form action="/datasource/import.php" method="post" enctype="multipart/form-data" class="form-horizontal">
              <div class="form-group row">
                <label for="dsname" class="col-sm-2 control-label">Name</label>
                <div class="col-sm-10"><input type="text" class="form-control"name="dsname" id="dsname" placeholder="My Data Source"/></div>
              </div>
              <div class="form-group">
                <label for="dsdesc" class="col-sm-2 control-label">Description</label>
                <div class="col-sm-10"><input type="text" class="form-control"name="dsdesc" id="dsdesc" placeholder="My DGR interaction data"/></div>
              </div>
              <div class="form-group">
                <label for="dsfile" class="col-sm-2 control-label">Filename</label>
                <div class="col-sm-10"><input type="file" class="form-control"name="dsfile" id="dsfile"/>
                <small id="dsfile-privacy" class="form-text form-muted">Your data is kept local and private to your computer</small></div>
              </div>
              <div class="form-group actions">
                <button class="btn btn-danger cancel">Cancel</button>
                <button type="submit" class="btn btn-primary">Import Data Source</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-xs-2"></div>
    </div>

    <h2>Required File Format</h2>
    <p>The file format must be comma-separated values (CSV), with required
    fields as described in the next section and optional fields as described in the
    section after next. Each row describes one interaction. Interactions are
    assumed to be non-directional, so ordering of fields numbered 1 and 2 (e.g.
    ids1, ids2, mention1, mention2) are not important.</p>

    <h3>Required Fields</h3>
    <p>The required fields describe each entity for the interaction, where
    <i>x</i> is either 1 or 2.  Interactions are assumed to be non-directional, so
    ordering of the entities is not important, so long as the ordering is
    internally consistent within each interaction (e.g. entity #1 is described by
    <code>mention1</code>, <code>id1</code>, and <code>type1</code>; entity #2
    is described by <code>mention2</code>, <code>id2</code>, and
    <code>type2</code>).</p>
    <table class="table table-sm table-bordered table-striped" id="required-fields">
      <tr class="bg-primary">
        <th class="bg-primary field">Field</th>
        <th class="bg-primary description">Description</th>
      </tr>
      <tr>
        <td class="field">mention<i>x</i></td>
        <td class="description">Symbol name (e.g. BRCA1) for the interacting DGR entities. </td>
      </tr>
      <tr>
        <td class="field">id<i>x</i></td>
        <td class="description">Accession IDs for the interacting DGR entities. Interactions are assumed to be non-directional, so order is not important. Gene IDs must be from NCBI Entrez, Disease IDs must be from MESH, and Drug IDs must be from PharmGKB. </td>
      </tr>
      <tr>
        <td class="field">type<i>x</i></td>
        <td class="description">Type must be one of: <code>Gene</code>, <code>Disease</code>, <code>Drug</code></td>
      </tr>
    </table>
    <h3>Optional Fields</h3>
    <table class="table table-sm table-bordered table-striped" id="required-fields">
      <tr class="bg-primary">
        <th class="bg-primary field">Field</th>
        <th class="bg-primary description">Description</th>
      </tr>
      <tr>
        <td class="field">mention<i>x</i>_offset</td>
        <td class="description">Mention (symbol name) character offset from beginning of sentence</td>
      </tr>
      <tr>
        <td class="field">journal</td>
        <td class="description">Publisher or journal title (e.g. PLoS, PMC)</td>
      </tr>
      <tr>
        <td class="field">article_id</td>
        <td class="description">Article identifier (e.g. Diabetes, Nov 17 2011, Vol 60 Num 11, pp2883-2891)</td>
      </tr>
      <tr>
        <td class="field">sentence_id</td>
        <td class="description">Sentence identifier (e.g. SENT123)</td>
      </tr>
      <tr>
        <td class="field">probability</td>
        <td class="description">Interaction confidence score from 0 to 1 </td>
      </tr>
      <tr>
        <td class="field">context</td>
        <td class="description">Text for the sentence (supporting evidence) describing the interaction</td>
      </tr>
      <tr>
        <td class="field">section</td>
        <td class="description">Article section containing the sentence (e.g. Abstract, Methods, Conclusion)</td>
      </tr>
    </table>

    </div>
<!--/form-->
</li>

  <!-- JQuery -->
  <script src="/static/jquery/jquery-3.2.1.min.js"></script>
  <!-- <script src="static/jquery/jquery-ui.min.js"></script> -->

  <!-- Bootstrap and Modules -->
  <script src="/static/bootstrap/bootstrap.min.js"></script>
  <script src="/static/bootstrap/bootstrap-slider/bootstrap-slider.min.js"></script>
  <script src="/static/bootstrap/bootstrap-toggle/bootstrap-toggle.min.js"></script>

  <!-- Alertify -->
  <!--script src="/static/alertify/js/alertify.min.js"></script-->
<script src="//cdn.jsdelivr.net/npm/alertifyjs@1.11.4/build/alertify.min.js"></script>

  <script>
$( "form button.cancel" ).off( 'click' ).click(( ev ) => {
  window.close();
});

var manifest = <?php include( '/usr/local/genedive/data/sources/manifest.json' ); ?>;
var listitem = $( '.datasource-list-item' ).detach();
Object.entries( manifest ).forEach(([ id, datasource ]) => {
  if( id.match( /^(?:plos-pmc|pharmgkb)$/ )) { return; }
  let entry = listitem.clone();
  entry.find( '.name' ).html( datasource.name );
  entry.find( '.description' ).html( datasource.description );
  entry.find('.datasource_id').html(datasource.id);
  entry.attr('id',datasource.id);
  let toggle = entry.find( 'input.datasource-toggle' );
  toggle.attr({ id: datasource.id, name: datasource.id });
  $( '#datasources' ).append( entry );
});

$('.btn_remove').on('click',function(){
  var ds_id = this.parentNode.parentNode.id;
  var ds_name = document.getElementById(ds_id).children[0].children[0].innerHTML
  var retVal = confirm("Do you confirm to delete \"" + ds_name + "\"?");
  if( retVal == true ) {
   $.ajax({
     url:"./delete.php",
     type:"POST",
     dataType:'html',
     data:{"ds_id" : ds_id},
     success:function(result){
       	location.reload();
	//alert(result);
     }
   }); 
    return true;
  } else {
    return false;
  }
})
</script>

</body>

</html>
