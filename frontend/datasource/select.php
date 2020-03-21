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
var manifest = <?php include( '/usr/local/genedive/data/sources/manifest.json' ); ?>;

// ===== INITIALIZE DATASOURCE MANAGER
var listitem = $( '.datasource-list-item' ).detach();
GeneDive.datasource.refreshSelectionUI = () => {
    Object.entries( manifest ).forEach(([ key, datasource ]) => {
        let entry = listitem.clone().css({ display: 'block' });
        entry.find( '.name' ).html( datasource.name );
        entry.find( '.description' ).html( datasource.description );
        let toggle = entry.find( 'input.datasource-toggle' );
        toggle.attr({ id: datasource.id, name: datasource.id });
        $( '#datasource-selector .list-group' ).append( entry );
    });
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
          $.ajax({
              url: `/datasource/change.php?value=${dsl}`,
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


</script>
