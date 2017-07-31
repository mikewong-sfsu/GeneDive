/* Note: This class has a hard dependency on the adjacency_matrix global */

class Node {
  constructor ( id, name, color ) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.connections = [];
    this.counts = {};
  }

  generateConnectionData( minProb ) {
    let connections = [];
    let counts = {};
    minProb = minProb * 1000;

    connections = Object.keys(adjacency_matrix[this.id]);

    // First pass - remove connections that have no probs above min
    connections = connections.filter( i => adjacency_matrix[this.id][i].some( p => p >= minProb ) );

    // Now generate connection counts for each that remains - if any
    connections.forEach( i => {
      counts[i] = adjacency_matrix[this.id][i].filter( p => p >= minProb ).length;
    });

    this.connections = connections;
    this.counts = counts;

  }
  
}
