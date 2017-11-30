<?php include_once "auth.php"; ?>

<?php include "header.php"; ?>

<div class="main-display">
  <div class="control-view">

    <div class="titlebar"><a href="/">GeneDive</a>
    </div>

    <!-- Search Controls -->
    <div class="module search-module">
      <div class="topology-row">
        <div class="btn-group topology-selector" style="width:100%;" role="group" aria-label="...">
          <button data-toggle="tooltip" data-placement="right"  title="Provide one gene to view all interactions with that gene. Provide multiple genes or genesets to view interactions between all input genes." style="width:25%;" type="button" class="btn btn-default active" data-type="1hop">1-Hop</button>
          <button data-toggle="tooltip" data-placement="right"  title="Provide two genes as input. GeneDive will show interactions between the two genes through up to 1 (one) intermediary gene." style="width:25%;" type="button" class="btn btn-default" data-type="2hop">2-Hop</button>
          <button data-toggle="tooltip" data-placement="right"  title="Provide two genes as input. GeneDive will show interactions between the two genes through up to 2 (two) intermediary genes." style="width:25%;" type="button" class="btn btn-default" data-type="3hop">3-Hop</button>
          <button data-toggle="tooltip" data-placement="right"  title="Provide one gene as input. GeneDive will show those genes that interact with the input gene as well as one other input interactant." style="width:25%;" type="button" class="btn btn-default" data-type="clique">Clique</button>
        </div>
      </div>

      <input type="text" placeholder="enter a gene symbol..." class="form-control search-input">

      <!-- Search Sets displays current search objects -->
      <div class="search-sets">
      </div>
    </div>

    <!-- Filter Controls -->
    <div class="module filter-module">
      <!-- Probability Filter Submodule -->
      <div class="min-prob-titlebar">
        <h5>Minimum Probability</h5>
        <span class="min-prob-slider-value">0.70</span>
      </div>
      <input class="min-prob-slider" type="text" name="min-prob-value" data-provider="slider" data-slider-min="0" data-slider-max="1" data-slider-step="0.01" data-slider-value="0.7" style="width:100%">

      <!-- Text Filter Submodule -->
      <h5 class="h5-second">Filter Results</h5>
      <form id="add-filter" onsubmit="return false;">
        <div class="top-row">
          <select class="filter-select">
            <option>Article</option>
            <option selected="selected">Excerpt</option>
            <option>Gene</option>
            <option>Journal</option>
            <option>Section</option>
          </select>
          <div class="filter-is-not">
            <span><input type="radio" name="isnot" value="is" class="is" checked > is </span>
            <span><input type="radio" name="isnot" value="not"> not </span>
          </div>
        </div>

        <div class="input-group filter-input-group">
          <input type="text" class="form-control filter-input filter-text" placeholder="value...">
          <select class="form-control filter-input filter-dropdown" style="display:none;">
          </select>
          <span class="input-group-btn">
            <button type="submit" class="btn btn-default" type="button">Add</button>
          </span>
        </div>
      </form>

      <!-- Filter Sets displays current filter objects -->
      <div class="filters">
      </div>
    </div>

    <div class="divider"></div>

    <!-- Highlight Module -->
    <div class="module highlight-module">
      <div class="title">
        <h5><!-- <i class="fa fa-pencil" aria-hidden="true"></i> -->Highlight Excerpts Containing</h5>
      </div>
      <input type="text" placeholder="highlight term..." class="form-control highlight-input">
    </div>

    <div class="divider"></div>

    <!-- Grouper -->
    <div class="module grouper-module">
      <div class="title">
        <h5>Group Table Results By</h5>
      </div>

      <div class="btn-group table-grouping" style="width:100%;" role="group" aria-label="...">
        <button style="width:50%;" type="button" class="btn btn-default active" data-type="gene">Gene Pair</button>
        <button style="width:50%;" type="button" class="btn btn-default" data-type="article">Article</button>
      </div>
    </div>

    <div class="divider"></div>

    <!-- Download -->
    <div class="module download-module">
      <button style="width:100%;" type="button" class="btn btn-default download">Download Results</button>
    </div>

    <div class="module about-module">
      <a href="/privacy.html" target="_blank">T&C/Privacy</a>
      <a href="/help.php" target="_blank">Help</a>
      <a href="/about.html" target="_blank">About</a>
    </div>
  </div>

  <div class="table-graph-holder">
    <!-- Table View -->
    <div class="table-view ui-widget-content" id="table-view">
      <div class="messaging-and-controls">
        <span class="go-back"><i class="fa fa-arrow-left" aria-hidden="true"></i> Back</span>
        <span class="metadata"></span>
      </div>
      <div class="spinner table-rendering-spinner">
        <div>
          <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
        </div>
      </div>
      <div class="help table-help">
        <?php include "help-search.php"; ?>
      </div>
      <div class="no-results">
        <h3>No Results Found</h3>
      </div>
    </div>

    <!-- Graph View -->
    <div class="graph-view" id="graph-view">
      <div class="absent">
        <div>View Absent Nodes List</div>
      </div>
      <div class="legend">
        <p>Click To Drag</p>
        <p>Shift-Click to Add</p>
        <p>Ctrl-Click to Replace</p>
      </div>
      <div id="graph">
      </div>
      <div class="spinner graph-rendering-spinner">
        <div>
          <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
        </div>
      </div>
      <div class="help graph-help">
        <?php include "help-graph.php"; ?>
      </div>
    </div>
    </div>
  </div>
</div>

<?php include "footer.php"; ?>