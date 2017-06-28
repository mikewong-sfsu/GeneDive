class GeneSet {
    
    constructor (name, color, genes) {
        this.name = name;
        this.color = color;
        this.genes = genes || []; // genes is an array [145, 146...] for geneset, 
        return this;
    }

    addGene (id, symbol) {
        this.genes.push(new Gene(id, symbol, this.color));
    }

    getIDs() {
        return this.genes.map(function (gene) { return gene.id });
    }

    hasGene(identifier) {
        let pos = this.genes.findIndex(function (gene) { return gene.id == identifier || gene.symbol == identifier; });
        return (pos == -1) ? false : true;
    }

}
