<?php
  $dslist = json_decode( base64_decode( $_SESSION[ 'sources' ]));
  if( $dslist == '' ) { $dslist = []; }
?>
<style>
    .ajs-dialog {
        max-width: 800px !important;
    }
    .datasource-list-item {
	display: none;
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
    .datasource-list-item .datasource-actions .toggle {
        position: absolute;
        top: 28px;
        left: 10px;
        width: 100px;
    }

</style>

<li class="datasource-list-item list-group-item">
    <div class="datasource-info">
        <h5 class="name">Name</h5>
        <p class="description">Description</p>
    </div>
    <div class="datasource-actions">
        <input class="datasource-toggle" type="checkbox" data-toggle="toggle" data-on="Enabled" data-off="Disabled" data-onstyle="success" data-offstyle="default"></input>
    </div>
</li>

<div id="datasource-selector">
    <p>Enable or disable the data sources below for search. Enabled data sources will be searched for disease, gene, or drug/Rx (DGR) interactions. </p>
    <div class="row" style="overflow-y: auto;">
        <ul class="list-group">
        </ul>
    </div>
</div>

<script>
GeneDive.datasource = {};
GeneDive.datasource.list = <?= json_encode( $dslist ) ?>;
var std_ds = new Set(["pharmgkb","plos-pmc","all"]);
var manifest = <?php include( '/usr/local/genedive/data/sources/manifest.json' ); ?>;

// ===== INITIALIZE DATASOURCE MANAGER
var short_id_map = new Map();

// ===== INITIALIZE DATASOURCE MANAGER
var listitem = $( '.datasource-list-item' ).detach();
GeneDive.datasource.refreshSelectionUI = () => {
    var std_flag = 0;//to display the standard data source header
    var local_flag = 0;//to display the local data source header
    var datasource_name;
    //add the default standard datasources
    short_id_map.set("plos-pmc","G1");
    short_id_map.set("pharmgkb","G2");
    short_id_map.set("all","G1,G2");
    var i = 1;

    Object.entries( manifest ).forEach(([ key, datasource ]) => {
    	let entry = listitem.clone().css({ display: 'block' });
	//if all included, add them as separate entries
	datasource_name = datasource.name;
	//concatinate name with identifier
	if(short_id_map.has(datasource.id)){
		datasource_name += " [" + short_id_map.get(datasource.id) + "]";
	}
	else{
		short_id = "L" + i;
		datasource_name += " [" + short_id + "]";
		short_id_map.set(datasource.id,short_id);
		i++;
	}
	
	entry.find( '.name' ).html( datasource_name );
        entry.find( '.description' ).html( datasource.description );
        let toggle = entry.find( 'input.datasource-toggle' );
	toggle.attr({ id: datasource.id, name: datasource.id });
	if(std_flag == 0 && std_ds.has(datasource.id)){
	$( '#datasource-selector .list-group' ).append("<p><i>GeneDive Datasources</i></p>");
	std_flag = 1;
	}
	else if(local_flag == 0 && !std_ds.has(datasource.id)){
	$( '#datasource-selector .list-group' ).append("<br><p><i>Local Datasources</i></p>");
	local_flag = 1;
	}	
	$( '#datasource-selector .list-group' ).append( entry );
    });
    //update the shortid list
    let dsid_map = btoa (JSON.stringify( Object.fromEntries(short_id_map.entries())));
    $.ajax({
	url: `/datasource/managelist.php?id_map=${dsid_map}`,
        method: 'GET'
    })
    .fail(( error ) => { console.log( error ); });

};
GeneDive.datasource.refreshSelectionUI();

// ===== DATASOURCE MANAGER DIALOG
let dss = {
  dom: $( '#datasource-selector' ).detach(),
  show : () => {
    let response = $.getJSON( '/datasource/manifest.php?get=manifest' );
    if( response.statusText == 'OK' ) { manifest = response.responseJSON; }
    alertify.confirm( 
      'Select Datasources', 
      dss.dom.html(), 

      // OK button behavior
      () => { 
          GeneDive.datasource.list = $( 'input.datasource-toggle' ).map(( i, item ) => { 
              let key = $( item ).attr( 'id' ); 
              if( $( item ).prop( 'checked' )) { return key; } else { return null; }
          }).toArray();
          let list = GeneDive.datasource.list.map( sourceid  => manifest[ sourceid ].name ).sort().join( ', ' );
          alertify.success( `Now searching on<br>${list}` ); 
          let use_native = [ 'plos-pmc', 'pharmgkb' ].every( item => GeneDive.datasource.list.includes( item ));
          if( use_native ) {
              GeneDive.datasource.list = GeneDive.datasource.list.filter( x => x != 'plos-pmc' && x != 'pharmgkb' );
              GeneDive.datasource.list.unshift( 'native' );
          }
	  let dsl = btoa( JSON.stringify( GeneDive.datasource.list ));
	  let dsid_map = btoa (JSON.stringify( Object.fromEntries(short_id_map.entries())));
          $.ajax({
              url: `/datasource/change.php?value=${dsl}&shortid_map=${dsid_map}`,
              method: 'GET'
          })
          .done(( message ) => {
            window.location.reload();
          })
          .fail(( error ) => { console.log( error ); });
      }, 

      // Cancel button behavior
      () => { 
          let datasources = GeneDive.datasource.list.includes( 'native' ) ? [ 'plos-pmc', 'pharmgkb' ] : GeneDive.datasource.list;
          let list        = datasources.map( sourceid  => sourceid in manifest ? manifest[ sourceid ].name : null ).filter( x => x ).sort().join( ', ' );
          alertify.message( 'Data sources remain unchanged' + ( list ? `<br>(${list})` : '' )); 
      }
    ).set( 'closable', false );
    $( '.ajs-header' ).css({ 'background-color' : '#337ab7', 'border-color' : '#2e6da4', 'color' : 'white', 'font-weight' : 'bold' });
    $( 'input.datasource-toggle' ).bootstrapToggle( 'destroy' ).bootstrapToggle();
    $( 'input.datasource-toggle' ).each(( i, item ) => { 
      let key        = $( item ).attr( 'id' );
      let selected   = GeneDive.datasource.list.includes( key );
      let use_native = GeneDive.datasource.list.includes( 'native' );
      let native_ds  = key == 'plos-pmc' || key == 'pharmgkb';
      if( selected ) { $( item ).bootstrapToggle( 'on' ); } 
      else           { $( item ).bootstrapToggle( 'off' );}
      if( use_native && native_ds ) { $( item ).bootstrapToggle( 'on' ); }
    });
  }
};

$( '.datasource-select' ).off( 'click' ).click(( ev ) => {
  if( GeneDive.history.stateHistory.length > 0 ) {
   alertify.confirm(
      'You have an Unsaved Session',
      'Selecting a Datasource will restart your work session. Click [Cancel] to return to search (and save your session) or click [OK] to Select a Datasource (and lose your session)',
      () => { setTimeout(() => { dss.show(); }, 500 ); },
      () => {}
    );
  } else {
    dss.show();
  }
});
$( '.datasource-add' ).off( 'click' ).click(( ev ) => {
  if( GeneDive.history.stateHistory.length > 0 ) {
   alertify.confirm(
      'You have an Unsaved Session',
      'Adding a Datasource will restart your work session. Click [Cancel] to return to search (and save your session) or click [OK] to Add a Datasource (and lose your session)',
      () => { window.location = "/datasource/add.php" },
      () => {}
    );
  } else {
    window.location = "/datasource/add.php";
  }
});


$( '.datasource-edit' ).off( 'click' ).click(( ev ) => {
  if( GeneDive.history.stateHistory.length > 0 ) {
   alertify.confirm(
      'You have an Unsaved Session',
      'Adding a Datasource will restart your work session. Click [Cancel] to return to search (and save your session) or click [OK] to Add a Datasource (and lose your session)',
      () => { window.location = "/datasource/edit/edit_table.php" },
      () => {}
    );
  } else {
    window.location = "/datasource/edit/edit_table.php";
  }
});

</script>
