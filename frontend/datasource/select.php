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

<div id="datasource-manager">
    <p>Enable or disable the data sources below for search. Enabled data sources will be searched for disease, gene, or drug/Rx (DGR) interactions. </p>
    <div class="row">
        <ul class="list-group">
        </ul>
    </div>
</div>

<script>
GeneDive.datasource = {};
GeneDive.datasource.list = <?= json_encode( $dslist ) ?>;
var manifest = <?php include( '/usr/local/genedive/data/sources/manifest.json' ); ?>;
console.log( 'MANIFEST', manifest );
// ===== INITIALIZE DATASOURCE MANAGER
var listitem = $( '.datasource-list-item' ).detach();
GeneDive.datasource.refreshUI = () => {
    Object.entries( manifest ).forEach(([ key, datasource ]) => {
        let entry = listitem.clone().css({ display: 'block' });
        entry.find( '.name' ).html( datasource.name );
        entry.find( '.description' ).html( datasource.description );
        let toggle = entry.find( 'input.datasource-toggle' );
        toggle.attr({ id: datasource.id, name: datasource.id });
        $( '#datasource-manager .list-group' ).append( entry );
    });
};
GeneDive.datasource.refreshUI();

// ===== DATASOURCE MANAGER DIALOG
let dsm = $( '#datasource-manager' ).detach();
$( '.datasources' ).off( 'click' ).click(( ev ) => {
    let response = $.getJSON( '/datasource/manifest.php?get=manifest' );
    console.log( 'RESPONSE', response );
    if( response.statusText == 'OK' ) {
        manifest = response.responseJSON;
        console.log( 'MANIFEST', manifest );
    }
    alertify.confirm( 
        'Data Sources', 
        dsm.html(), 

        // OK button behavior
        () => { 
            GeneDive.datasource.list = $( 'input.datasource-toggle' ).map(( i, item ) => { 
                let key = $( item ).attr( 'id' ); 
                if( $( item ).prop( 'checked' )) { return key; } else { return null; }
            }).toArray();
            let list = GeneDive.datasource.list.map( sourceid  => manifest[ sourceid ].name ).sort().join( ', ' );
            alertify.success( `Now searching on<br>${list}` ); 
            if( [ 'plos-pmc', 'pharmgkb' ].every(( item ) => { return GeneDive.datasource.list.includes( item ); })) {
                GeneDive.datasource.list = [ 'all' ];
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
            let datasources = GeneDive.datasource.list.includes( 'all' ) ? [ 'plos-pmc', 'pharmgkb' ] : GeneDive.datasource.list;
            let list        = datasources.map( sourceid  => sourceid in manifest ? manifest[ sourceid ].name : null ).filter( x => x ).sort().join( ', ' );
            alertify.message( 'Data sources remain unchanged' + ( list ? `<br>(${list})` : '' )); 
        }
    );
    $( 'input.datasource-toggle' ).bootstrapToggle( 'destroy' ).bootstrapToggle();
    $( 'input.datasource-toggle' ).each(( i, item ) => { 
        let key      = $( item ).attr( 'id' );
        let all      = [ 'plos-pmc', 'pharmgkb' ].includes( key ) && GeneDive.datasource.list.includes( 'all' );
        let selected = GeneDive.datasource.list.includes( key );
	if( all || selected ) { $( item ).bootstrapToggle( 'on' ); } 
    //else { $( item ).bootstrapToggle( 'off' );} //commented to fix the toggle reset 
    });
});
</script>
