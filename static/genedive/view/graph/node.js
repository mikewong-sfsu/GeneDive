/* Note: This class has a hard dependency on the adjacency_matrix global */

class Node {
  constructor ( id, name, color ) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.interactants = [];
    this.counts = {};
  }

  generateConnectionData( minProb ) {
    let interactants = [];
    let counts = {};
    minProb = minProb * 1000;

    interactants = Object.keys(adjacency_matrix[this.id]);

    // First pass - remove interactants that have no probs above min
    interactants = interactants.filter( i => adjacency_matrix[this.id][i].some( p => p >= minProb ) );

    // Now generate connection counts for each that remains - if any
    interactants.forEach( i => {
      counts[i] = adjacency_matrix[this.id][i].filter( p => p >= minProb ).length;
    });

    this.interactants = interactants;
    this.counts = counts;

  }
  
}
