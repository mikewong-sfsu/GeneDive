var adjacency_matrix = {};

class AdjacencyMatrix {

  static refresh() {
      new JSZip.external.Promise(function (resolve, reject) {
        JSZipUtils.getBinaryContent( '/cache.php?get=adjacency_matrix', function(err, data) {
          if( err ) {
            reject( err );
          } else {
            resolve( data );
          }
        });
      })
          
      .then( ( data ) => {
        return JSZip.loadAsync( data );
      })

      .then(( zipfile ) => {
        zipfile.file( 'adjacency_matrix.json' ).async( 'string' ).then(( data ) => { 
          adjacency_matrix = JSON.parse( data ); 
          console.log( `Adjacency matrix loaded from zip with ${Object.keys(adjacency_matrix).length} entries` );
        });
      });
  }
}

AdjacencyMatrix.refresh();
