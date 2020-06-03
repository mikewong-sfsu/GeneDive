    <!-- JQuery -->
    <script src="static/jquery/jquery-3.2.1.min.js"></script>


    <!-- Bootstrap and Modules -->
    <script src="static/bootstrap/bootstrap.min.js"></script>
    <script src="static/bootstrap/bootstrap-slider/bootstrap-slider.min.js"></script>
    <script src="static/bootstrap/bootstrap-toggle/bootstrap-toggle.min.js"></script>

    <!-- Typeahead -->
    <script src="static/typeahead/typeahead.bundle.min.js"></script>

    <!-- SHA256 -->
    <script src="static/sha256/sha256.js"></script>

    <!-- D3.js -->
    <script src="static/d3/d3.v5.min.js"></script>
    <script src="static/d3/d3-tip.js"></script>
    <script src="static/d3hist/d3_hist.js"></script>

    <!-- Alertify -->
    <script src="static/alertify/js/alertify.min.js"></script>
    <script src="static/genedive/alertify-defaults.js"></script>

    <!-- TableSorter -->
    <script src="static/tablesorter/jquery.tablesorter.min.js"></script>

    <!-- Lodash -->
    <script src="static/lodash/lodash.js"></script>

    <!-- JSZip -->
    <script src="static/jszip/jszip.min.js"></script>
    <script src="static/jszip/jszip-utils.min.js"></script>

<script src="https://cdn.rawgit.com/caldwell/renderjson/master/renderjson.js"></script>
    <!-- Typeahead cache -->
    <script src="cache.php?get=disease_id"></script>
    <script src="cache.php?get=gene_id"></script>
    <script src="cache.php?get=drug_id"></script>
    <script src="cache.php?get=set_id"></script>

    <!-- Import plugin class -->
    <?php include("addselectsource.php");?>

    <!-- Adjacency Matrix -->
    <script src="cache.php?get=adjacency_matrix"></script>

    <!-- FileSaver -->
    <script src="static/filesaver/filesaver.min.js"></script>

    <!-- jQuery Resizeable -->
	<script src="static/jquery/add-ons/jquery-resizable.min.js"></script>

    <!-- Cytoscape -->
    <script src="static/cytoscape/cytoscape.min.js"></script>
    <script src="static/cytoscape/cytoscape-euler.js"></script>
    <script src="static/cytoscape/jquery.qtip.min.js"></script>
    <script src="static/cytoscape/cytoscape-qtip.js"></script>

    <!-- GeneDive Classses -->
    <script src="static/genedive/GeneDiveAPI.js"></script>
    <script src="static/genedive/search/graphsearch.js"></script>
    <script src="static/genedive/search/disambiguation.js"></script>
    <script src="static/genedive/search/loading.js"></script>
    <script src="static/genedive/search/search.js"></script>
    <script src="static/genedive/color/color.js"></script>
    <script src="static/genedive/synonym/synonym.js"></script>
    <script src="static/genedive/filter/probabilityfilter.js"></script>
    <script src="static/genedive/filter/textfilterplugin.js"></script>
    <script src="static/genedive/filter/textfilter.js"></script>
    <script src="static/genedive/highlight/highlightplugin.js"></script> 
    <script src="static/genedive/highlight/highlight.js"></script>
    <script src="static/genedive/grouper/grouper.js"></script>
    <script src="static/genedive/view/table/resultstable.js"></script>
    <script src="static/genedive/view/table/buildsummarytable.js"></script>  
    <script src="static/genedive/view/table/builddetailtable.js"></script> 
    <script src="static/genedive/view/table/tabledetail.js"></script>
    <script src="static/genedive/view/table/tablesummarygene.js"></script>
    <script src="static/genedive/view/table/tablesummaryarticle.js"></script>
    <script src="static/genedive/view/graph/graph.js"></script>
    <script src="static/genedive/help/help.js"></script>
    <script src="static/genedive/download_upload/download_upload.js"></script>
    <script src="static/genedive/delay.js"></script>
    <script src="static/genedive/controls/controls.js"></script>
    <script src="static/genedive/history/history.js"></script>
    <script src="static/genedive/localdb/db.js"></script>

    <!-- Core Controller -->
    <script src="static/genedive/controller.js"></script>

    <?php include( 'datasource/select.php' ) ?>
    <?php include( 'datasource/remove.php' ) ?>

  </body>
</html>

