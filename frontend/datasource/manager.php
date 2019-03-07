<style>
    .ajs-dialog {
        max-width: 800px !important;
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
    .datasource-list-item .datasource-actions .toggle {
        position: absolute;
        top: 10px;
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

<a class="datasource-add list-group-item">
    <div class="datasource-info">
        <h5 class="name"><span class="fa fa-plus-circle"></span> Add a Data Source</h5>
        <p class="description">Upload your own data to search and view in GeneDive'</p>
    </div>
</a>


<div id="datasource-manager">
    <h4>Data Sources</h4>
    <div class="row">
        <ul class="list-group">
        </ul>
    </div>
</div>

<script>
GeneDive.datasource = {};
GeneDive.datasource.list = <?php echo base64_decode( $_SESSION[ 'sources' ]) ?>;
var manifest = <?php include( '/usr/local/genedive/data/sources/manifest.json' ); ?>;
// ===== INITIALIZE DATASOURCE MANAGER
var listitem = $( '.datasource-list-item' ).detach();
GeneDive.datasource.refreshUI = () => {
    Object.entries( manifest ).forEach(([ key, datasource ]) => {
        let entry = listitem.clone();
        entry.find( '.name' ).html( datasource.name );
        entry.find( '.description' ).html( datasource.description );
        let toggle = entry.find( 'input.datasource-toggle' );
        toggle.attr({ id: datasource.id, name: datasource.id });
        $( '#datasource-manager .list-group' ).append( entry );
    });
};
GeneDive.datasource.refreshUI();

let add_entry = $( '.datasource-add' ).detach();
$( '#datasource-manager .list-group' ).append( add_entry );

let dsm = $( '#datasource-manager' ).detach();
$( '.datasources' ).off( 'click' ).click(( ev ) => {
    alertify.confirm( 'Data Source Manager', dsm.html(), () => { alertify.success( 'Ok' ); }, () => { alertify.error( 'Cancel' ); });
    $( 'input.datasource-toggle' ).bootstrapToggle( 'destroy' ).bootstrapToggle();
    $( 'input.datasource-toggle' ).each(( i, item ) => { 
        let key      = $( item ).attr( 'id' );
        let all      = [ 'plos-pmc', 'pharmgkb' ].includes( key ) && GeneDive.datasource.list.includes( 'all' );
        let selected = GeneDive.datasource.list.includes( key );
        if( all || selected ) { $( item ).bootstrapToggle( 'on' ); } else { $( item ).bootstrapToggle( 'off' );}
    });
    $( 'input.datasource-toggle' ).change(( ev ) => {
        GeneDive.datasource.list = $( 'input.datasource-toggle' ).map(( i, item ) => { 
            let key = $( item ).attr( 'id' ); 
            if( $( item ).prop( 'checked' )) { return key; } else { return null; }
        }).toArray();
        if( [ 'plos-pmc', 'pharmgkb' ].every(( item ) => { return GeneDive.datasource.list.includes( item ); })) {
            GeneDive.datasource.list = [ 'all' ];
        }
        let value = btoa( JSON.stringify( GeneDive.datasource.list ));
        $.ajax({
            url: `/datasource/change.php?value=${value}`,
            method: 'GET'
        })
        .done(( message ) => {
            console.log( message, GeneDive.datasource.list );
        })
        .fail(( error ) => { console.log( error ); });
    });
});
</script>
