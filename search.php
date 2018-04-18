<?php include_once "auth.php"; ?>

<?php include "header.php"; ?>

<div class="main-display">
  <div class="control-view">

    <div class="titlebar"><a href="/">GeneDive</a>
    </div>

    <!-- Other Controls -->
    <div class="module control-module">
            <div class="btn-group" style="width: 100%">
                <button type="button" class="btn btn-default undo" data-toggle="tooltip-initial" data-placement="bottom" title="Undo the last action you made" disabled> <span style="font-family: 'Open Sans', sans-serif;">Undo</span></button>
                <button type="button" class="btn btn-default reset-graph" data-toggle="tooltip-initial" data-placement="bottom" title="Regenerate the positions of the graph nodes" disabled> <span style="font-family: 'Open Sans', sans-serif;">Redraw Graph</span></button>
                <button type="button" class="btn btn-default redo" data-toggle="tooltip-initial" data-placement="bottom" title="Redo the last action you undid" disabled> <span style="font-family: 'Open Sans', sans-serif;">Redo</span></button>
            </div>
    </div>

    <!-- Search Controls -->
    <div class="module search-module">
      <div class="topology-row">
        <div class="btn-group topology-selector" style="width:100%;" role="group" aria-label="...">
          <button data-toggle="tooltip-initial" data-placement="bottom" title="Provide one DGD (blue) to view all interactions with that DGD. Provide multiple DGDs or DGD sets to view interactions between all input DGDs." style="width:25%;" type="button" class="btn btn-default active" data-type="1hop">1-Hop</button>
          <button data-toggle="tooltip-initial" data-placement="bottom" title="Provide two DGDs as input. GeneDive will show interactions between the two DGDs through up to 1 (one) intermediary DGD."                 style="width:25%;" type="button" class="btn btn-default"        data-type="2hop">2-Hop</button>
          <button data-toggle="tooltip-initial" data-placement="bottom" title="Provide two DGDs as input. GeneDive will show interactions between the two DGDs through up to 2 (two) intermediary DGDs."                style="width:25%;" type="button" class="btn btn-default"        data-type="3hop">3-Hop</button>
          <button data-toggle="tooltip-initial" data-placement="bottom" title="Provide one DGD as input. GeneDive will show those DGDs that interact with the input DGD as well as one other input interactant."        style="width:25%;" type="button" class="btn btn-default"        data-type="clique">Clique</button>
        </div>
      </div>

      <input type="text" placeholder="enter a Disease-Gene-Drug entity (DGD)..." class="form-control search-input">

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
            <option>DGD</option>
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
        <h5><!-- <i class="fa fa-pencil" aria-hidden="true"></i> -->Highlight Rows</h5>
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
        <button style="width:50%;" type="button" class="btn btn-default active" data-type="dgd">DGD Pair</button>
        <button style="width:50%;" type="button" class="btn btn-default" data-type="article">Article</button>
      </div>
    </div>

    <div class="divider"></div>

    <!-- Download and Upload -->
    <div class="module download-module">
      <button type="button" data-toggle="tooltip-initial" data-placement="top" title="Download the current graph image, the current state, state history, and a CSV of the interactions." class="btn btn-default download" disabled>Download Results</button>
      <button type="button" class="btn btn-default upload">Upload Results</button>
    </div>

    <div class="module about-module">
      <a href="/privacy.html" target="_blank">T&C/Privacy</a>
      <a href="/help.html" target="_blank">Help</a>
      <a href="/about.html" target="_blank">About</a>
    </div>
  </div>

  <div class="views">

    <!-- Table View -->
    <div class="table-view ui-widget-content panel-top">
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
        <h3>Search Modes</h3>
        <div class="modes">
          <div class="mode">
            <h4>1-Hop</h4>
            <img src="/static/genedive/images/help/1hop.png" class="img-responsive">
            <p>Provide one <span class="dgd-blue">Disease-Gene-Drug entitiy (DGD)</span> to view all interactions with that <span class="dgd-blue">DGD</span>. Provide multiple <span class="dgd-blue">DGDs</span> or <span class="dgd-blue">DGD</span> sets to view interactions between all input <span class="dgd-blue">DGDs</span>.</p>
          </div>
          <div class="mode">
            <h4>2-Hop</h4>
            <img src="/static/genedive/images/help/2hop.png" class="img-responsive">
            <p>Provide two <span class="dgd-blue">Disease-Gene-Drug entities (DGDs)</span> as input. GeneDive will show interactions between the two <span class="dgd-blue">DGDs</span> through up to one intermediary <span class="dgd-orange">DGD</span>.</p>
          </div>
          <div class="mode">
            <h4>3-Hop</h4>
            <img src="/static/genedive/images/help/3hop.png" class="img-responsive">
            <p>Provide two <span class="dgd-blue">Disease-Gene-Drug entities (DGDs)</span> as input. GeneDive will show interactions between the two <span class="dgd-blue">DGDs</span> through up to two intermediary <span class="dgd-orange">DGDs</span>.</p>
          </div>
          <div class="mode">
            <h4>Clique</h4>
            <img src="/static/genedive/images/help/clique.png" class="img-responsive">
            <p>Provide one <span class="dgd-blue">Disease-Gene-Drug entities (DGDs)</span> as input. GeneDive will show <span class="dgd-orange">DGDs</span> that interact with the input <span class="dgd-blue">DGD</span> as well as one other input interactant.</p>
          </div>
        </div>
      </div>
      <div class="no-results">
        <h3>No Results Found</h3>
      </div>
    </div>

    <div class="splitter-horizontal"></div>

    <!-- Graph View -->
    <div class="graph-view panel-bottom">
      <div class="absent">
        <div>View Absent Nodes List</div>
      </div>
      <div class="legend">
        <p>Click To Drag</p>
        <p>Shift-Click to Add</p>
        <p>Ctrl-Click to Replace</p>
      </div>
    <div class="spinner graph-rendering-spinner">
        <div>
            <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
        </div>
    </div>
      <div id="graph">
      </div>

      <div class="help graph-help">
        <h3>Using the Graph</h3>
        <div class="modes">
          <div class="mode">
            <i class="fa fa-arrows" aria-hidden="true"></i>
            <h4>Pan</h4>
            <p>Click and drag on whitespace to move around.</p>
          </div>
          <div class="mode">
            <i class="fa fa-plus" aria-hidden="true"></i>
            <h4>Zoom</h4>
            <p>Use your mousewheel or trackpad to zoom in and out.</p>
          </div>
          <div class="mode">
            <i class="fa fa-hand-paper-o" aria-hidden="true"></i>
            <h4>Move DGDs</h4>
            <p>Click and drag DGDs to move them around. DGDs will stay where you leave them.</p>
          </div>
        </div>
        <div class="modes">
          <div class="mode">
            <i class="fa fa-search-plus" aria-hidden="true"></i>
            <h4>Shift-Click DGD to Add</h4>
            <p>Shift-Click on DGDs to add them to the search. Releasing shift will start a new search.</p>
          </div>
          <div class="mode">
            <i class="fa fa-search" aria-hidden="true"></i>
            <h4>Ctrl-Click DGD to Start New Search</h4>
            <p>Ctrl-Click on a DGD to start a new search with only that DGD.</p>
          </div>
        </div>
        </div>
      </div>
    </div>

  </div>
</div>

<?php include "footer.php"; ?>
