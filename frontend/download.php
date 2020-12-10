<?php require_once "session.php" ?>
<html lang="en">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <link rel="stylesheet" type="text/css" href="static/bootstrap/bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="static/fontawesome/css/all.min.css">
  <link rel="stylesheet" type="text/css" href="static/jquery/add-ons/fancybox/jquery.fancybox.min.css">
  <script src="static/jquery/jquery-3.2.1.min.js"></script>
  <script src="static/jquery/add-ons/fancybox/jquery.fancybox.min.js"></script>

  <title>Getting Started with the GeneDive Docker Image</title>
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

    <h1>Importing Your Data with the GeneDive Docker Image</h1>
    <p>GeneDive is a powerful but easy-to-use application that can search,
    sort, group, filter, highlight, and visualize interactions between diseases,
    genes, and drugs (DGR). Refer to <a target="_blank"
    href="//www.ncbi.nlm.nih.gov/pubmed/29218917">Previde et al [2018]</a> for more details.</p>

    <p>The GeneDive Docker Image is a downloadable version of GeneDive for use
    on a user's local system. This allows the user access to the native
    GeneDive database when network is available; additionally, the user
    can import, manage, query, and visualize their own DGR interaction data
    within the local GeneDive application. Imported user data exists locally
    on their own system, and is not shared on the network during the import
    process.</p>

    <h2>Get Docker Desktop</h2>
    <p>You will need <b>Docker Desktop</b> to run the GeneDive Docker Image.
    Click the button below to visit <code>docker.com</code>, get more information,
    and download the Docker Desktop.</p>
    <p><a class="btn btn-primary" href="https://www.docker.com/products/docker-desktop" target="_blank"><span class="fas fa-external-link-alt"></span> Get Docker Desktop</a></p>

    <h3>Installing Docker on UNIX Systems without Root Access</h3>
	<p>If you are installing Docker on a shared UNIX system (e.g. a cluster)
	and you do <b>not</b> have root access, you can run Docker in Rootless
	mode by following the instructions here: <a href="https://docs.docker.com/engine/security/rootless">https://docs.docker.com/engine/security/rootless</a></p>

    <h2>Download the GeneDive Docker Image</h2>
<?php if( $_SESSION[ 'is_auth' ]): ?>
<?php if( file_exists( 'static/genedive/docker/images/genedive-docker.gz' )): ?>
    <p><a class="btn btn-primary docker" data-toggle="tooltip-initial" href="/static/genedive/docker/images/genedive-docker.gz" title="Download the GeneDive Docker image. The GeneDive Docker image will allow you to import your own structured DGR data for search and visualization in GeneDive."><span class="fab fa-docker"></span> Download GeneDive Docker Image (<?php echo( sprintf( "%d MB", filesize( 'static/genedive/docker/images/genedive-docker.gz')/ (1024 * 1024 ))) ?>)</a></p>
<?php endif; ?>
<?php else: ?>
    <p>You must <a class="btn btn-primary" href="index.php" ><span class="fas fa-key"></span> Log in</a> to download the GeneDive Docker image.</p>
<?php endif; ?>

    <h2>Run GeneDive with Docker</h2>
    <p>Once you've installed Docker Desktop and downloaded the GeneDive Docker Image,
    you are ready to run a local version of GeneDive. Windows users may need to
    install <code>gunzip</code>, or some other <i>gz-compression</i> utility
    first. Open a terminal window and type the following:</p>
    
<pre>
    gunzip genedive-docker.gz 
    docker load -i genedive-docker
    docker run -d -p 8456:80 --name genedive-v2.5.2-local genedive-v2.5.2
</pre>

    <p>You can substitute port <code>8456</code> with another available port if
    8456 is already in use.</p>

	<p>When all the above is done, point your browser to 
	<a href="http://localhost:8456" target="_blank">http://localhost:8456</a> 
	(or the port of your choice) to begin using GeneDive on Docker.</p>

	<h2>Importing Your Data</h2>
	<p>To import your data, you will need to <i>add a data source</i> to GeneDive.
	First login to your local GeneDive Docker application at <a href="http://localhost:8456" target="_blank">http://localhost:8456</a>.
	Click on the hamburger menu in the upper-left corner as shown in the image
	below. Select <i>Add a Data Source</i> from the menu, and follow the
	instructions. You will need to reformat your data into CSV format, following
	the specifications set forth in the instructions as part of importing your
	data into GeneDive.</p>

	<div style="text-align: center;"><a href="static/genedive/images/datasource/import/add-data-source.png" style="border: none;"><img src="static/genedive/images/datasource/import/add-data-source.png" width="480px"></a></div>

    <h2>Cite Us</h2>
    <p>To cite this work, please use the following publication:</p>
    <p id="citation">Previde P., Thomas B., Wong M., Mallory E., Petkovic D.,
    Altman R., and Kulkarni A. (2018) <a target="_blank"
    href="//www.ncbi.nlm.nih.gov/pubmed/29218917">GeneDive: A Gene Interaction
    Search and Visualization Tool to Facilitate Precision Medicine.</a> In the
    Proceedings of Pacific Symposium on Biocomputing, Vol 23, pp. 590-601. January
    2018.</p>

  </div>
  <!-- /container -->
</body>

</html>
