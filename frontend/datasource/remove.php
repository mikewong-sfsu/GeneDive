<!--?php include_once( '../session.php' ); ?-->

<div id="datasource-remover">
  <p>You can remove data you have previously added to GeneDive. Once removed,
  your data will be deleted from GeneDive; if you keep a backup copy of the
  original CSV file, you can always add your data into GeneDive again later.</p>
  <ul class="list-group" id="datasources-available-for-removal">
  </ul>
</div>

<li class="datasource-remove-item list-group-item row">
  <div class="datasource-info col-xs-10">
    <h5 class="name">Name</h5>
    <p class="description">Description</p>
  </div>
  <div class="datasource-actions col-xs-2" style="margin-top: 18px;">
    <button class="btn btn-xs btn-danger btn-remove"><span class="fas fa-trash"></span>&nbsp;Remove</button>
  </div>
</li>

<script>

var remove = $( '.datasource-remove-item' ).detach();
GeneDive.datasource.refreshRemoveUI = () => {
  let response = $.getJSON( '/datasource/manifest.php?get=manifest' );
  if( response.statusText == 'OK' ) { manifest = response.responseJSON; }

  $( '#datasources-available-for-removal' ).empty();
  Object.entries( manifest ).forEach(([ id, datasource ]) => {
    if( id.match( /^(?:plos-pmc|pharmgkb)$/ )) { return; }
    let entry = remove.clone();
    entry.find( '.name' ).html( datasource.name );
    entry.find( '.description' ).html( datasource.description );
    entry.attr({ 'data-id': datasource.id, 'data-name': datasource.name });
    $( '#datasources-available-for-removal' ).append( entry );
  });
};
GeneDive.datasource.refreshRemoveUI();

// ===== DATASOURCE REMOVAL DIALOG
var dsr = $( '#datasource-remover' ).detach();
var dsr_show = () => {
  alertify.alert( 
    'Remove a Data Source',
    dsr.html(),
    () => { window.location.reload(); }
   ).set({ 'label' : 'Return to Search', 'closable': false });

  // Remove dialog UI color theme adjustments
  $( '.ajs-header' ).css({ 'background-color' : '#d9534f', 'border-color' : '#d43f3a', 'color' : 'white' });

  // Remove Button Behavior
  $( '.btn-remove' ).off( 'click' ).click(( e ) => {
    var entry      = $( e.target ).parents( '.datasource-remove-item' );
    var datasource = { id : entry.attr( 'data-id' ), name : entry.attr( 'data-name' ) };

    alertify.confirm( 
      `Delete ${datasource.name}?`, 
      `Click [OK] to permanently remove ${datasource.name}, [Cancel] to leave ${datasource.name} alone. If you still have the original CSV for ${datasource.name}, you can always re-import ${datasource.name} later, using the <code>Add a Datasource</code> feature.`, 
      () => { $.post({ url: "/datasource/delete.php", data: { "id" : datasource.id }, success: ( e ) => { console.log( 'SUCCESS', e ); $( `.datasource-remove-item[data-id="${datasource.id}"]` ).remove(); }}); },
      () => {}
    );
  })
};
$( '.datasource-remove' ).off( 'click' ).click(( ev ) => {
  if( GeneDive.history.stateHistory.length > 0 ) {
    alertify.confirm(
      'You have an Unsaved Session',
      'Removing a Datasource will restart your work session. Click [Cancel] to return to search (and save your session) or click [OK] to Remove a Datasource (and lose your session)',
      () => { setTimeout(() => { dsr_show(); }, 500 ); },
      () => {}
    );

  } else {
    dsr_show();
  }
});
</script>

