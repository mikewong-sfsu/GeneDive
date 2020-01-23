<?php include_once( '../session.php' ); ?>
<html>

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <link rel="stylesheet" type="text/css" href="/static/bootstrap/bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="/static/fontawesome/css/all.min.css">
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>

  <title>Remove a Data Source</title>
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
    <div class="page-header"><h1>Remove Data Source</h1></div>
    <p>You can remove data you have previously added to GeneDive. Once removed,
    your data will be deleted from GeneDive; if you keep a backup copy of the
    original CSV file, you can always add your data into GeneDive again later.</p>

    <div class="row">
      <div class="col-xs-2"></div>
      <div class="col-xs-8">
        <div class="panel panel-primary">
	  <div class="panel-heading"><h3 class="panel-title">Remove a User-Provided Data Source</h3></div>
	  <div class="panel-body">
            <ul class="list-group" id="datasources">
	    </ul>
	  </div>
        </div>
      </div>
      <div class="col-xs-2"></div>
    </div>

    <div class="form-group actions"> 
      <button class="btn btn-primary cancel pull-right">Return to Search</button> 
    </div>
  </div>

<li class="datasource-list-item list-group-item">
    <div class="datasource-info">
        <h5 class="name">Name</h5>
        <p class="description">Description</p>
    </div>
    <div class="datasource-actions">
      <button class="btn btn-xs btn-danger btn_remove " id="datasource-remove"><span class="fas fa-trash"></span>&nbsp;Remove</button>
    </div>
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
$( "button.cancel" ).off( 'click' ).click(( ev ) => {
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
?>

