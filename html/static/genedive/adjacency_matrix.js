var adjacency_matrix = {};

new JSZip.external.Promise(function (resolve, reject) {
  JSZipUtils.getBinaryContent('/static/genedive/json/adjacency_matrix.json.zip', function(err, data) {
    if( err ) {
      reject( err );
    } else {
      resolve( data );
    }
  });
}).then( ( data ) => {
  return JSZip.loadAsync( data );
})
.then(( zipfile ) => {
  zipfile.file( 'adjacency_matrix.json' ).async( 'string' ).then(( data ) => { 
    adjacency_matrix = JSON.parse( data ); 
    console.log( "Adjacency Matrix loaded from zip" );
  });
});
