<?php include_once "auth.php"; ?>

<?php include "header.php"; ?>

<!-- Main Display is a full-screen grid element holding all sub-views -->
<div class="container-fluid main-display">

  <!-- Control View - left sidebar for all global controls (ie those effecting table and graph) -->
  <div class="control-view">

    <div class="titlebar">GeneDive</div>
    
    <!-- Search Controls -->
    <div class="module search-module">
      <div class="title">
        <h5><!-- <i class="fa fa-search" aria-hidden="true"></i> -->Search</h5>
      </div>
      <div class="topology-row">
        <h6>Type</h6>
        <select class="topology-selector form-control">
          <option value="1hop">1-Hop</option>
          <option value="2hop">2-Hop</option>
          <option value="3hop">3-Hop</option>
          <option value="clique">Clique (Max 1 Gene)</option>
        </select>
      </div>
      <input type="text" placeholder="search a gene..." class="form-control search-input">

      <!-- Search Sets displays current search objects -->
      <div class="search-sets">
      </div>
    </div>
 
    <!-- Filter Controls -->
    <div class="module filter-module">
      <div class="title">
        <h5><!-- <i class="fa fa-filter" aria-hidden="true"></i> -->Filter</h5>
      </div>

      <!-- Probability Filter Submodule -->
      <div class="min-prob-titlebar">
        <h6>Minimum Probability</h6>
        <span class="min-prob-slider-value">0.7</span>
      </div>
      <input class="min-prob-slider" type="text" name="min-prob-value" data-provider="slider" data-slider-min="0" 
              data-slider-max="1" data-slider-step="0.01" data-slider-value="0.7">

      <!-- Text Filter Submodule -->
      <h6>Text Filters</h6>
      <form id="add-filter" onsubmit="return false;">
        <div class="top-row">
          <select class="filter-select">
            <option>Gene</option>
            <option>Excerpt</option>
          </select>
          <div class="filter-is-not">
            <span><input type="radio" name="isnot" value="is" class="is" checked > is </span>
            <span><input type="radio" name="isnot" value="not"> not </span>
          </div>
        </div>
        <div class="input-group filter-input-group">
          <input type="text" class="form-control filter-input" placeholder="value..." required>
          <span class="input-group-btn">
            <button type="submit" class="btn btn-default" type="button">Add</button>
          </span>
        </div>
      </form>

      <!-- Filter Sets displays current filter objects -->
      <div class="filters">
      </div>
    </div>

    <!-- Highlight Module -->
    <div class="module highlight-module">
      <div class="title">
        <h5><!-- <i class="fa fa-pencil" aria-hidden="true"></i> -->Highlight Rows</h5>
      </div>
      <input type="text" placeholder="highlight term..." class="form-control highlight-input">
    </div>

    <!-- Grouper -->
    <div class="module grouper-module">
      <div class="title">
        <h5>Group Results (Table Only)</h5>
      </div>
      <select class="table-grouping-selector form-control" selected="gene">
        <option value="gene">Gene Pair</option>
        <option value="article">Article</option>
      </select>
    </div>

    <!-- Account Module -->
    <div class="module account-module">
    </div>

  </div> <!-- End Control View -->

  <!-- Table View -->
  <div class="table-view ui-widget-content">
    <div class="messaging-and-controls hide-on-start">
      <span class="go-back"><i class="fa fa-arrow-left" aria-hidden="true"></i> Back</span>
      <span class="metadata"></span>
    </div>
  </div>

  <!-- Graph View -->
  <div class="graph-view">
    <div id="graph">
    </div>
  </div>

<?php include "footer.php"; ?>