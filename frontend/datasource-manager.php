<div id="datasource-manager">
</div>
<script>
var dsm = $( '#datasource-manager' ).detach();
$( '#datasources' ).off( 'click' ).click(( ev ) => {
    alertify.confirm( 'Data Source Manager', dsm, () => { alertify.success( 'Ok' ); }, () => { alertify.error( 'Cancel' ); });
});
</script>
