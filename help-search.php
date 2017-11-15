<?php 
  echo '
  <h3>Search Modes</h3>
  <div class="modes">
    <div class="mode">
      <h4>1-Hop</h4>
      <img src="/static/genedive/images/help/1hop.png" class="img-responsive">
      <p>Provide one gene (blue) to view all interactions with that gene. Provide multiple genes or genesets to view interactions between all input genes.</p>
    </div>
    <div class="mode">
      <h4>2-Hop</h4>
      <img src="/static/genedive/images/help/2hop.png" class="img-responsive">
      <p>Provide two genes (blue) as input. GeneDive will show interactions between the two genes through up to one intermediary gene (orange).</p>
    </div>
    <div class="mode">
      <h4>3-Hop</h4>
      <img src="/static/genedive/images/help/3hop.png" class="img-responsive">
      <p>Provide two genes (blue) as input. GeneDive will show interactions between the two genes through up to two intermediary genes (orange).</p>
    </div>
    <div class="mode">
      <h4>Clique</h4>
      <img src="/static/genedive/images/help/clique.png" class="img-responsive">
      <p>Provide one gene (blue) as input. GeneDive will show genes (orange) that interact with the input gene as well as one other input interactant.</p>
    </div>
  </div>
  ';
?>