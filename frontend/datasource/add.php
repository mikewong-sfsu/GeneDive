<?php include_once( '../session.php' ); ?>
<html>

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <link rel="stylesheet" type="text/css" href="/static/bootstrap/bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="/static/fonts/css/fontawesome.min.css">
  
  <title>Add a Data Source</title>
  <style>

#required-fields th.field,td.field {
  width: 20%;
}

#required-fields th.description,td.description {
  width: 80%;
}

  </style>

</head>

<body>
  <div class="container">
    <h1>Add a Data Source</h1>

    <h2>Required File Format</h2>
    <p>The file format must be comma-separated values (CSV), with required
    fields as described in the next section and optional fields as described in the
    section after next. Each row describes one interaction. Interactions are
    assumed to be non-directional, so ordering of fields numbered 1 and 2 (e.g.
    ids1, ids2, mention1, mention2) are not important.</p>

    <h3>Required Fields</h3>
    <p>The required fields describe each entity for the interaction, where
    <i>x</i> is either 1 or 2.  Interactions are assumed to be non-directional, so
    ordering of the entities is not important, so long as the ordering is
    internally consistent within each interaction (e.g. entity #1 is described by
    <code>mention1</code>, <code>id1</code>, and <code>type1</code>; entity #2
    is described by <code>mention2</code>, <code>id2</code>, and
    <code>type2</code>).</p>
    <table class="table table-sm table-bordered table-striped" id="required-fields">
      <tr class="bg-primary">
        <th class="bg-primary field">Field</th>
        <th class="bg-primary description">Description</th>
      </tr>
      <tr>
        <td class="field">mention<i>x</i></td>
        <td class="description">Symbol name (e.g. BRCA1) for the interacting DGR entities. </td>
      </tr>
      <tr>
        <td class="field">id<i>x</i></td>
        <td class="description">Accession IDs for the interacting DGR entities. Interactions are assumed to be non-directional, so order is not important. Gene IDs must be from NCBI Entrez, Disease IDs must be from MESH, and Drug IDs must be from PharmGKB. </td>
      </tr>
      <tr>
        <td class="field">type<i>x</i></td>
        <td class="description">Type must be one of: <code>Gene</code>, <code>Disease</code>, <code>Drug</code></td>
      </tr>
    </table>
    <h3>Optional Fields</h3>
    <table class="table table-sm table-bordered table-striped" id="required-fields">
      <tr class="bg-primary">
        <th class="bg-primary field">Field</th>
        <th class="bg-primary description">Description</th>
      </tr>
      <tr>
        <td class="field">mention<i>x</i>_offset</td>
        <td class="description">Mention (symbol name) character offset from beginning of sentence</td>
      </tr>
      <tr>
        <td class="field">journal</td>
        <td class="description">Publisher or journal title (e.g. PLoS, PMC)</td>
      </tr>
      <tr>
        <td class="field">article_id</td>
        <td class="description">Article identifier (e.g. Diabetes, Nov 17 2011, Vol 60 Num 11, pp2883-2891)</td>
      </tr>
      <tr>
        <td class="field">sentence_id</td>
        <td class="description">Sentence identifier (e.g. SENT123)</td>
      </tr>
      <tr>
        <td class="field">probability</td>
        <td class="description">Interaction confidence score from 0 to 1 </td>
      </tr>
      <tr>
        <td class="field">context</td>
        <td class="description">Text for the sentence (supporting evidence) describing the interaction</td>
      </tr>
      <tr>
        <td class="field">section</td>
        <td class="description">Article section containing the sentence (e.g. Abstract, Methods, Conclusion)</td>
      </tr>
    </table>

  </div>

  <!-- JQuery -->
  <script src="/static/jquery/jquery-3.2.1.min.js"></script>
  <!-- <script src="static/jquery/jquery-ui.min.js"></script> -->

  <!-- Bootstrap and Modules -->
  <script src="/static/bootstrap/bootstrap.min.js"></script>
  <script src="/static/bootstrap/bootstrap-slider/bootstrap-slider.min.js"></script>
  <script src="/static/bootstrap/bootstrap-toggle/bootstrap-toggle.min.js"></script>

  <!-- Alertify -->
  <script src="/static/alertify/js/alertify.min.js"></script>

</body>

</html>
