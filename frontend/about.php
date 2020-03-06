<?php require_once( "version.php" ); ?>
<!DOCTYPE html>

<html lang="en">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <link rel="stylesheet" type="text/css" href="static/bootstrap/bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="static/jquery/add-ons/fancybox/jquery.fancybox.min.css">
  <script src="static/jquery/jquery-3.2.1.min.js"></script>
  <script src="static/jquery/add-ons/fancybox/jquery.fancybox.min.js"></script>

  <title>GeneDive <?= genedive_version() ?>: About</title>
  <style>
#citation {
  font-size: 10pt;
  border: 1px solid #ccc;
  background-color: #eee;
  padding: 12px;
}
  </style>

</head>

<body>

  <div class="container">

    <div class="row">
      <h1>About GeneDive <?= genedive_patch_level() ?></h1>
      <p>Released: <?= genedive_release_date() ?>
      <p>GeneDive is a powerful but easy-to-use application that can search,
      sort, group, filter, highlight, and visualize interactions between drugs,
      genes, and diseases (DGR).  GeneDive also facilitates topology discovery
      through the various search modes that reveal direct and indirect interactions
      between DGR.  The search results, in textual and graphical form, can be
      downloaded along with the search settings to easily restart the session at
      later time.  Refer to <a href="https://www.ncbi.nlm.nih.gov/pubmed/29218917"
      target="_blank">Previde et al., 2018</a> for more details.</p>

      <p>GeneDive is a joint project between the Computer Science Department at
      San Francisco State University, and the Bioengineering Department at Stanford
      University</p>
    </div>

    <div class="row">
      <h2>Cite Us</h2>
      <p>To cite this work, please use the following publication:</p>
      <p id="citation">Previde P., Thomas B., Wong M., Mallory E., Petkovic D.,
      Altman R., and Kulkarni A. (2018) <a target="_blank"
      href="https://www.ncbi.nlm.nih.gov/pubmed/29218917">GeneDive: A Gene Interaction
      Search and Visualization Tool to Facilitate Precision Medicine.</a> In the
      Proceedings of Pacific Symposium on Biocomputing, Vol 23, pp. 590-601. January
      2018.</p>
    </div>

    <div class="row">
      <h2>Architecture</h2>
      <p>GeneDive is built using a modular architecture, with modules grouped
      into three subsystems: <i>control</i>, <i>backend</i>, and <i>cache</i>.
      The front-end <i>control subsystem</i> is the largest subsystem and is written
      in PHP and Javascript and relies heavily on the Bootstrap and CytoScape
      frameworks. The <i>backend subsystem</i> is written using interpreted langauges
      Python and Perl, especially the Mojolicious framework. The <i>cache subsystem</i> 
      is populated by the datasource importer module and managed by PHP scripts which
      intelligently combines requested datasources to provide a fast and responsive UI.
      Each module is responsible for a set of conceptually related features provided by
      GeneDive.</p>
      <a data-fancybox="gallery" href="static/genedive/images/architecture.png"><img src="static/genedive/images/architecture.png" width="640px"></a>
    </div>

    <div class="row">
      <h2>Contact</h2>
      <p>Mike Wong <a href="mailto: mikewong@sfsu.edu">mikewong@sfsu.edu</a></p>
    </div>

  </div>
  <!-- /container -->



</body>

</html>