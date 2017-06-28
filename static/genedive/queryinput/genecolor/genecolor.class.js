class GeneColor {
    
    constructor () {
        this.geneColors = ["#228ae6","#fd7e14","#40c057","#fa5252","#fab005","#7950f2",
                            "#15aabf","#e64980","#82c91e","#be4bdb","#12b886","#4c6ef5"];
    }

    getColor () {
        return this.geneColors.shift();
    }

    returnColor (color) {
        if (color == '#a6a6a6') { return; } // Don't put gray back on the color queue
        this.geneColors.unshift(color);
    }

}
