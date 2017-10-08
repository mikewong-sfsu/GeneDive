 class GenePairList {
  
  constructor ( viewport, interactions ) {
    this.interaction_count = interactions.length;
    this.interactions = GeneDive.grouper.group( interactions );
    this.viewport = $(viewport).html("");
    this.groups = Object.keys( this.interactions );

    this.sort("interactions");

    this.groups.forEach( ( group ) => {
      this.viewport.append( this.buildGroup( group, this.interactions[group] ) );
      this.initHistogram( group, this.interactions[group].map( i => i.probability ) );
    });

    $(".messaging-and-controls .metadata").html(`<span class="count">${this.interaction_count}</span> Interaction(s) in <span class="groups">${this.groups.length}</span> Group(s)`);
  }

  buildGroup ( key, group ) {
    let card = $("<div/>")
      .addClass("group-card")
      .addClass( group.some(( i => i.highlight )) ? "highlight" : "" )
      .data("key", key);

    group = group.sort( (a,b) => a.probability >= b.probability ? -1 : 1 );

    card.append(this.buildTitle( group[0] ));
    card.append(this.buildCount( group.length, _.uniq(group.map( g => g.article_id)).length ));
    card.append(this.buildExcerpt( group[0] ));
    card.append(this.buildHistogram( key ));
    card.append(this.buildProbabilities( group[0].probability, group[group.length - 1].probability ));

    card.on("click", (event) => {
      let card = $(event.currentTarget);

      if ( !card.data("expanded") ) {
        card.append( this.buildDetail( this.interactions[card.data("key")] ) );
        card.data("expanded", true);  
      } else {
        card.children(".detail").remove();
        card.data("expanded", false);
      }
    });

    return card;
  }

  buildTitle ( interaction ) {
    let div = $("<div/>")
      .addClass("group-title");

    let h4 = $("<h4/>");

    let gene1 = $("<span/>").html(interaction.mention1).css("color", interaction.mention1_color);
    let gene2 = $("<span/>").html(interaction.mention2).css("color", interaction.mention2_color);

    h4.append(gene1).append("<span> - </span>").append(gene2);

    div.append(h4);

    return div;
  }

  buildCount ( count, articles ) {
    let div = $("<div/>")
      .addClass("count");

    let p = $("<p/>")
      .html(`<span class="interactions">${count}</span> Interaction(s) in <span class="articles">${articles}</span> Article(s)`);

    div.append(p);

    return div;
  }

  buildExcerpt ( interaction ) {
    let excerpt = this.styleExcerpt( interaction.context, interaction.mention1, interaction.mention1_color );
        excerpt = this.styleExcerpt( excerpt, interaction.mention2, interaction.mention2_color );

    let div = $("<div/>")
      .addClass("excerpt")
      .append( $("<p/>").html("Sample Excerpt").addClass("text-muted") )
      .append( $("<p/>").html(excerpt) );
      
    return div;
  }

  buildHistogram ( group ) {
    let div = $("<div/>")
      .addClass("histogram")
      .attr("id", `d3-${group}`);
    return div;
  }

  buildProbabilities ( max, min ) {
    let div = $("<div/>")
      .addClass("probs");

    let minspan = $("<span/>")
      .html(`<span class="min-tag">Min. Prob.</span><span class="min-value">${min}</span>`);

    let maxspan = $("<span/>")
      .html(`<span class="max-tag">Max. Prob.</span><span class="max-value">${max}</span>`);

    div.append(minspan).append(maxspan);

    return div;
  }

  buildDetail ( group ) {
    let div = $("<div/>")
      .addClass("detail");

    let header = $("<div/>")
      .addClass("detail-row")
      .append( $("<span/>").html("Article").addClass("article") )        
      .append( $("<span/>").html("Excerpt").addClass("excerpt").css("margin-left","40px") )
      .append( $("<span/>").html("Probability").addClass("probability") )
      .append( $("<span/>").html("PubmedLink").addClass("pubmed") );

    div.append(header);

    group.forEach( g => {
      let excerpt = this.styleExcerpt( g.context, g.mention1, g.mention1_color );
        excerpt = this.styleExcerpt( excerpt, g.mention2, g.mention2_color );

      let row = $("<div/>")
        .addClass("detail-row")
        .addClass( g.highlight ? "highlight" : "" )
        .append( $("<span/>").html(g.article_id).addClass("article") )        
        .append( $("<span/>").html(excerpt).addClass("excerpt") )
        .append( $("<span/>").html(g.probability).addClass("probability") )
        .append( $("<span/>").html(this.buildPubmedLink( g.pubmed_id )).addClass("pubmed") );

      div.append(row);
    });

    return div;
  }

  initHistogram ( group, probabilities ) {
    // Init histogram
    d3.select(`#d3-${group}`)
      .datum( this.interactions[group].map( i => i.probability ) )
      .call(
        histogramChart()
        .bins(
          d3.scale
            .linear()
            .ticks(10)
          )
      );
  }

  addSynonym ( gene, synonym ) {
    return `${gene} <span class="text-muted">[aka ${synonym}]</span>`;
  }

  styleExcerpt ( excerpt, symbol, color ) {
    return excerpt.replace( new RegExp( `#${symbol}#` ), `<span style="color:${color};">${symbol}</span>` );
  }

  buildPubmedLink ( pubmedID ) {
    return `
      <a href='https://www.ncbi.nlm.nih.gov/pubmed/${pubmedID}/' target='_blank'>
        <i class="fa fa-file-text-o" aria-hidden="true"></i>
        <i class="fa fa-arrow-right" aria-hidden="true"></i>
      </a>`;
  }

  sort ( order ) {
    switch ( order ) {
      case "probability":
        this.groups.sort( (a,b) => _.max(this.interactions[a].map( i => i.probability )) >= _.max(this.interactions[b].map( i => i.probability )) ? -1 : 1 );
        break;
      case "interactions":
        this.groups.sort( (a,b) => this.interactions[a].length >= this.interactions[b].length ? -1 : 1 );
        break;
    } 
  }

}

/*
  let mention1 = row.mention1_synonym ? this.addSynonym(row.mention1, row.mention1_synonym) : row.mention1;
  let mention2 = row.mention2_synonym ? this.addSynonym(row.mention2, row.mention2_synonym) : row.mention2;

  let excerpt = this.styleExcerpt( row.context, row.mention1, row.mention1_color );
    excerpt = this.styleExcerpt( excerpt, row.mention2, row.mention2_color );

*/