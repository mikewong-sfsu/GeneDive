<?php include_once "auth.php"; ?>

<?php include "header.php"; ?>

<!-- Main Display is a full-screen grid element holding all sub-views -->
<div class="container-fluid main-display">

  <!-- Control View - left sidebar for all global controls (ie those effecting table and graph) -->
  <div class="control-view">
    <h4>GeneDive</h4>

    <!-- Search Controls -->
    <div class="module search-module">
      <div class="title">
        <h5>Search</h5>
        <span class="module-help" data-unit="search">Help</span>
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
        <h5>Filter</h5>
        <span class="module-help" data-unit="filter">Help</span>
      </div>

      <!-- Probability Filter Submodule -->
      <div class="min-prob-titlebar">
        <h6>Minimum Probability</h6>
        <span class="min-prob-slider-value">0.7</span>
      </div>
      <input class="min-prob-slider" type="text" name="min-prob-value" data-provider="slider" data-slider-min="0" 
              data-slider-max="1" data-slider-step="0.01" data-slider-value="0.7">

      <div class="divider"></div>

      <!-- Text Filter Submodule -->
      <h6>Text Filters</h6>
      <form id="add-filter">
        <div class="top-row">
          <select class="filter-select">
            <option>Journal</option>
            <option>Article</option>
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
        <h5>Highlight</h5>
        <span class="module-help" data-unit="highlight">Help</span>
      </div>
      <input type="text" placeholder="highlight term..." class="form-control highlight-input">
    </div>

    <!-- Account Module -->
    <div class="module account-module">
    </div>

  </div> <!-- End Control View -->

  <!-- Table View -->
  <div class="table-view ui-widget-content">
    <div class="topbar">
      <div class="back">
        <span><i class="fa fa-caret-left"></i>Back</span>
      </div>
      <div class="message"><span class="message-text"></span></div>
      <div class="grouping-controls">
        <h6>Group Table By</h6>
        <select class="table-grouping-selector" selected="gene">
          <option value="gene">Gene</option>
          <option value="article">Article</option>
        </select>
      </div>
    </div>
    <div class="table-responsive">
    </div>
  </div>

  <!-- Graph View -->
  <div class="graph-view">
    <div class="graph">
      Graph
    </div>
  </div>

<?php include "footer.php"; ?>