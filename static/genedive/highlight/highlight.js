class Highlight {
  
  constructor (input ) {
    this.input = $(input);

    this.input.on("keyup", ( e ) => {
      delay( function () {
       GeneDive.onHighlightKeyup(); 
      }, 300);
    });
  }

  highlight ( interactions ) {
    let term = this.input.val();

    if ( term.length < 2 ) {
      return interactions.map( ( i ) => { i.highlight = false; return i; });
    } else {
      return interactions.map( ( i ) => { i.highlight = new RegExp(term,"i").test(i.context) ? true : false; return i; });
    }
  }

}