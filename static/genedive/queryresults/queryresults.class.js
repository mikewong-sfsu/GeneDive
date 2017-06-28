class QueryResults {

    constructor() {
        this.interactions = null;
        this.geneSets = null;
        this.setMemberships = null; // hashmap of gene ids to arrays of GeneSet objects of which that id is a member
    }

    cache (results, geneSets) {
        this.geneSets = geneSets;
	    this.setMemberships = this.generateSetMemberships();
        this.interactions = this.mapInteractionDataToObjects(results);
        Webdiggr.FilterControls.cache(this.interactions);
    }

    generateSetMemberships() {
        var setMemberships = {};
        var i; // index of GeneSets within geneSets field
        var j; // index of Genes within each GeneSet
        var numberOfGenes = 0; // number of Genes in each GeneSet
        var nextGene = undefined; // next Gene object in GeneSet
        var nextId = undefined; // id of each Gene
        for (i=0; i<this.geneSets.length; i++) {
            numberOfGenes = this.geneSets[i].genes.length;
            for (j=0; j<numberOfGenes; j++) {
                nextGene = this.geneSets[i].genes[j];
                nextId = nextGene.id;
                if (nextId in setMemberships) {
                    setMemberships[nextId].push(this.geneSets[i]);
                }
                else {
                    setMemberships[nextId] = [ this.geneSets[i] ];
                }
            }
        }
        return setMemberships;
    }

    mapInteractionDataToObjects(results) {

        let interactions = [];

        for (let row of results) {
            let interaction = {
                journal: row['journal'],
                article_id: row['article_id'],
                pubmed_id: row['pubmed_id'],
                probability: row['probability'],
                context: row['context'],
                section: row['section'].substr(0, row['section'].length - 1), // section has a CR character at the end, need to fix
                geneids1: row['geneids1'],
                mention1: row['mention1'],
                geneids2: row['geneids2'],
                mention2: row['mention2'],
                reactome: row['reactome'],
                id: row['id'],
                gene1color: (this.getColors(row['geneids1']) ? this.getColors(row['geneids1']) : ["rgb(166,166,166)"]),
                gene2color: (this.getColors(row['geneids2']) ? this.getColors(row['geneids2']) : ["rgb(166,166,166)"])
                // To go back to single colors on the graph's nodes, uncomment the lines below:
                //gene1color: (this.getColors(row[6])[0] ? this.getColors(row[6])[0] : "rgb(166,166,166)"), 
                //gene2color: (this.getColors(row[8])[0] ? this.getColors(row[8])[0] : "rgb(166,166,166)")
            };

            // Decorate Gene Mentions in Context/Excerpt
            interaction.context = interaction.context.replace(new RegExp(`#${interaction.mention1}#`,"i"), this.decorateContext(interaction.geneids1, interaction.mention1));
            interaction.context = interaction.context.replace(new RegExp(`#${interaction.mention2}#`,"i"), this.decorateContext(interaction.geneids2, interaction.mention2));

            // Apply Synonym Tags if Necessary
            let m1_synonym = this.getSynonym( interaction.geneids1, interaction.mention1 );
            let m2_synonym = this.getSynonym( interaction.geneids2, interaction.mention2 );

            if ( m1_synonym ) {
                interaction.mention1 = `${interaction.mention1} <muted>[${m1_synonym}]</muted>`;
            }

            if ( m2_synonym ) {
                interaction.mention2 = `${interaction.mention2} <muted>[${m2_synonym}]</muted>`;
            }

            interactions.push(interaction);
        }

        return interactions;
    }

    // getGeneSetMemberships() below is no longer needed because the setMemberships is an attribute of this class.
    /*
    getGeneSetMemberships() {

        var membershipsMap = {};
        this.geneSets.forEach( function(geneset) {
            geneSet.getIDs().forEach( function(id) {
                if (id in membershipsMap) {
                    //
                }
                else {
                    //
                }
        return membershipsMap;
    }
    */

    getSynonym (id, symbol) {

        let finds = this.geneSets.filter(function (geneset) { 
            if (geneset.genes.length != 1) {
                return false;
            }
            return geneset.genes[0].id == id && geneset.genes[0].symbol != symbol;
        });

        if (finds.length == 0) { return null; }
        else { return finds[0].genes[0].symbol; } 
    }

    createColorGradient(colors) {
        let increment = 100 / colors.length;
        let css = "linear-gradient(90deg, ";

        for (var x = 0; x < colors.length - 1; x++) {
            css += `${colors[x]} ${Math.floor((x+1)*increment)}%, ${colors[x+1]} ${Math.floor((x+1)*increment)}%, `;
        }

        css += `${colors[colors.length - 1]} 100%)`;

        return css;
    }

    getColors(id) {
        var setsArray = this.setMemberships[id];
        if (setsArray==undefined) return undefined;
        var colorsArray = [];
        var i;
        for (i=0; i<setsArray.length; i++) {
            colorsArray.push(setsArray[i].color);
        }
        return colorsArray;
    }


    /* Apply synonym and coloring */
    decorateContext(id, symbol) {
        let colors = undefined;
        let span = "";

        if ( !(id in this.setMemberships) ) { colors = ["rgb(166,166,166)"]; }
        else { colors = this.getColors(id); }
        
        if (colors.length == 1) {
            span = `<span class='table-gene-tag' style='background:${colors[0]};'>${symbol}</span>`;
        } else {
            span = `<span class='table-gene-tag' style='background:${this.createColorGradient(colors)};'>${symbol}</span>`;
        }


        return span;
    }


} // end of class
