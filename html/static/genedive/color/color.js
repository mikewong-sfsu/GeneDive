let GENEDIVE_COLORS = ["#4dadf7", "#ff8787", "#ffd43b", "#748ffc", "#69db7c", "#38d9a9", "#9775fa", "#ffa94d", "#da77f2", "#a9e34b", "#f783ac"];

class Color {
  constructor() {
    this.colormap = {};
    this.nextColor = 0;
    this.COLOR = {
      GREY: "#aaaaaa",
      ORANGE: "#fd7e14",
      BLUE: "#4dadf7",
    };
  }

  reset() {
    this.colormap = {};
    this.nextColor = 0;
  }

  getColor(id) {
    return this.colormap[id] || this.COLOR.GREY;
  }

  setColor(ids, color) {
    ids.forEach(id => {
      if (!(id in this.colormap)) {
        this.colormap[id] = color;
      }
    });
  }

  allocateColor(ids) {
    let color = GENEDIVE_COLORS[this.nextColor++ % GENEDIVE_COLORS.length];
    this.setColor(ids, color);
    return color;
  }

  colorInteractions(interactions, topology) {
    if (topology === "1hop")
      interactions.forEach(i => {
        i.mention1_color = this.colormap[i.geneids1] || this.COLOR.ORANGE;
        i.mention2_color = this.colormap[i.geneids2] || this.COLOR.ORANGE;
      });
    else
      interactions.forEach(i => {
        i.mention1_color = this.colormap[i.geneids1] || this.COLOR.GREY;
        i.mention2_color = this.colormap[i.geneids2] || this.COLOR.GREY;
      });
    return interactions;
  }

}