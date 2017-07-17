let GENEDIVE_COLORS = ["#ff8787","#748ffc","#ffd43b","#4dadf7","#69db7c","#3bc9db","#38d9a9","#9775fa","#ffa94d","#da77f2","#a9e34b","#f783ac"];

class Color {
  
  constructor() {
    this.colormap = {};
    this.nextColor = 0;
  }  

  reset () {
    this.colormap = {};
    this.nextColor = 0;
  }

  getColor ( id ) {
    return this.colormap[id] || "#bbbbbb";
  }

  setColor ( ids, color ) {
    ids.forEach( id => this.colormap[id] = color );
  }

  allocateColor ( ids ) {
    let color = GENEDIVE_COLORS[ this.nextColor++ % GENEDIVE_COLORS.length ];
    this.setColor( ids, color );
    return color;
  }

  colorInteractions ( interactions ) {
    interactions.forEach( i => {
      i.mention1_color = this.colormap[i.mention1];
      i.mention2_color = this.colormap[i.mention2]; 
    });
    return interactions;
  }

}