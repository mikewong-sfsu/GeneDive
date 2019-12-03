<!--?php require_once("session.php");echo "hi", $_SESSION ?-->
    <!-- JQuery -->
    <script src="static/jquery/jquery-3.2.1.min.js"></script>
    <!-- <script src="static/jquery/jquery-ui.min.js"></script> -->

    <!-- Bootstrap and Modules -->
    <script src="static/bootstrap/bootstrap.min.js"></script>
    <script src="static/bootstrap/bootstrap-slider/bootstrap-slider.min.js"></script>
    <script src="static/bootstrap/bootstrap-toggle/bootstrap-toggle.min.js"></script>

    <!-- Typeahead -->
    <script src="static/typeahead/typeahead.bundle.min.js"></script>

    <!-- SHA256 -->
    <script src="static/sha256/sha256.js"></script>

    <!-- D3.js -->
    <script src="static/d3/d3.min.js"></script>
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

    <!-- Typeahead cache -->
    <script src="static/genedive/cache.js"></script>

    <!-- Import datasouce class -->
    <!--script src="static/genedive/ds_class.js"></script-->
    

    <!-- Adjacency Matrix -->
    <script src="static/genedive/adjacency_matrix.js"></script>

    <!-- FileSaver -->
    <script src="static/filesaver/filesaver.min.js"></script>

    <!-- jQuery Resizeable -->
	<script src="static/jquery/add-ons/jquery-resizable.min.js"></script>

    <!-- Cytoscape -->
    <script src="static/cytoscape/cytoscape.min.js"></script>
    <script src="static/cytoscape/cytoscape-euler.js"></script>
    <script src="static/cytoscape/jquery.qtip.min.js"></script>
    <script src="static/cytoscape/cytoscape-qtip.js"></script>

    <!-- PouchDB --> <!-- MW Note this appears to be an unnecessary dependency -->
    <!-- script src="static/pouchdb/pouchdb-7.0.0.js?random=<?php echo $random_string; ?>"></script -->
    <!-- script src="static/pouchdb/pouchdb.find.js?random=<?php echo $random_string; ?>"></script -->

    <!-- GeneDive Classses -->
    <script src="static/genedive/GeneDiveAPI.js?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/search/graphsearch.js?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/search/disambiguation.js?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/search/loading.js?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/search/search.js?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/color/color.js?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/synonym/synonym.js?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/filter/probabilityfilter.js?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/filter/textfilter.js?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/highlight/highlight.js?random=<?php echo $random_string; ?>"></script>

<script src="cache.php?random=<?php echo $random_string; ?>"></script>

    <script src="static/genedive/grouper/grouper.js?random=<?php echo $random_string; ?>"></script>
    <!--include dynamic data-->
    <script type="text/javascript" src="dynamic_view.php"></script>
    <!--?php include('dynamic_view.php'); ?-->

    <script src="static/genedive/view/table/resultstable.js?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/view/table/build_table.js?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/view/table/tabledetail.js?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/view/table/tablesummarygene.js?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/view/table/tablesummaryarticle.js?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/view/graph/graph.js?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/help/help.js?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/download_upload/download_upload.js?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/delay.js?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/controls/controls.js?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/history/history.js?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/localdb/db.js?random=<?php echo $random_string; ?>"></script>

    <!-- Core Controller -->
    <script src="static/genedive/controller.js?random=<?php echo $random_string; ?>"></script>

    <?php include( 'datasource/select.php' ) ?>

  </body>
</html>

