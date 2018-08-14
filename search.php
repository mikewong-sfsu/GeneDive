<?php include_once "auth.php"; ?>
<?php include "header.php"; ?>

<div class="main-display">
  <div class="control-view">

    <div class="titlebar"><a href="/">GeneDive</a>
    <span class="subtitle">Disease, Gene, Drug (DGR)<br>Interaction Explorer</span>
    </div>

    <!-- Other Controls -->
    <div class="module control-module">
            <div class="btn-group" style="width: 100%">
                <button type="button" class="btn btn-default undo" data-toggle="tooltip-initial" data-placement="bottom" title="Undo the last action you made" disabled><i class="fas fa-undo"></i><span class="button-text">Undo</span></button>
                <!--<button type="button" class="btn btn-default reset-graph" data-toggle="tooltip-initial" data-placement="bottom" title="Regenerate the positions of the graph nodes" disabled> <span class="button-text">Redraw Graph</span></button>-->
                <button type="button" class="btn btn-default redo" data-toggle="tooltip-initial" data-placement="bottom" title="Redo the last action you undid" disabled><span class="button-text">Redo</span><i class="fas fa-redo"></i></button>
            </div>
    </div>

    <!-- Search Controls -->
    <div class="module search-module">
      <div class="topology-row">
        <div class="btn-group topology-selector" style="width:100%;" role="group" aria-label="...">
          <button data-toggle="tooltip-initial" data-placement="bottom" title="Provide one DGR to view all direct interactions with the DGR. Provide multiple DGRs or DGR sets to view interactions between all input DGRs." style="width:25%;" type="button" class="btn btn-default active" data-type="1hop">1-Hop</button>
          <button data-toggle="tooltip-initial" data-placement="bottom" title="Provide two or more DGRs as input. GeneDive will show interactions between the two DGRs through up to 1 (one) intermediary DGR."                 style="width:25%;" type="button" class="btn btn-default"        data-type="2hop">2-Hop</button>
          <button data-toggle="tooltip-initial" data-placement="bottom" title="Provide two or more DGRs as input. GeneDive will show interactions between the two DGRs through up to 2 (two) intermediary DGRs."                style="width:25%;" type="button" class="btn btn-default"        data-type="3hop">3-Hop</button>
          <button data-toggle="tooltip-initial" data-placement="bottom" title="Provide one DGR as input. GeneDive will show those DGRs that interact with input DGR and one of its interactants."        style="width:25%;" type="button" class="btn btn-default"        data-type="clique">Clique</button>
        </div>
      </div>

      <input type="text" placeholder="Enter a DGR name" class="form-control search-input">

      <!-- Search Sets displays current search objects -->
      <div class="search-sets">
      </div>
    </div>

    <!-- Filter Controls -->
    <div class="module filter-module">
      <!-- Probability Filter Submodule -->
      <div class="min-prob-titlebar">
        <h5>Minimum Confidence Score</h5>
        <span class="min-prob-slider-value">0.70</span>
      </div>
      <input id="min-prob-slider" class="min-prob-slider" type="text" name="min-prob-value" data-provider="slider" data-slider-min="0" data-slider-max="1" data-slider-step="0.01" data-slider-value="0.7" style="width:100%;">
      <h6 style="margin-top: 2px; margin-bottom: -8px;">Suggested Confidence Cutoffs</h6>
      <div class="btn-group" id="confidence-cutoff" style="width: 100%; margin-top: 12px;">
          <button data-toggle="tooltip-initial" data-placement="bottom" style="width: 33.3%;" title="Apply filter for interactions with confidence score of at least 0.70.  WARNING: May increase query response time." class="btn btn-default" id="low-confidence">Low</button>
          <button data-toggle="tooltip-initial" data-placement="bottom" style="width: 33.3%;" title="Apply filter for interactions with confidence score of at least 0.85" class="btn btn-default" id="medium-confidence">Medium</button>
          <button data-toggle="tooltip-initial" data-placement="bottom" style="width: 33.3%;" title="Apply filter for interactions with confidence score of at least 0.95" class="btn btn-default" id="high-confidence">High</button>
      </div>

      <!-- Text Filter Submodule -->
      <h5 class="h5-second" style="margin-top: 40px;">Filter Results</h5>
      <form id="add-filter" onsubmit="return false;">
        <div class="top-row">
          <select class="filter-select">
            <option>Article</option>
            <option selected="selected">Excerpt</option>
            <option>DGR</option>
            <option>Journal</option>
            <!--<option>Section</option>-->
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
        <button style="width:50%;" type="button" class="btn btn-default active" data-type="dgr">DGR Pair</button>
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
      <a href="/help.html" target="_blank">Help</a>
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
        <div class="loading-container">
          <div class="loading-info"></div>
          <div>
            <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
          </div>
          <div class="progress">
            <div class="progress-bar w-75" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
      </div>
      <div class="help table-help">
        <h3>Search Modes</h3>
        <div class="modes">
          <div class="mode">
            <h4>1-Hop</h4>
            <img src="/static/genedive/images/help/1hop.png" class="img-responsive">
            <p>Provide one <span class="dgr-blue">Disease, Gene, or Drug entitiy (DGR)</span> to view all direct interactions with that <span class="dgr-blue">DGR</span>. Provide multiple <span class="dgr-blue">DGRs</span> or <span class="dgr-blue">DGR</span> sets to view interactions between all input <span class="dgr-blue">DGRs</span>.</p>
          </div>
          <div class="mode">
            <h4>2-Hop</h4>
            <img src="/static/genedive/images/help/2hop.png" class="img-responsive">
            <p>Provide two <span class="dgr-blue">Disease, Gene, or Drug entities (DGRs)</span> as input. GeneDive will show interactions between the two <span class="dgr-blue">DGRs</span> through up to one intermediary <span class="dgr-orange">DGR</span>.</p>
          </div>
          <div class="mode">
            <h4>3-Hop</h4>
            <img src="/static/genedive/images/help/3hop.png" class="img-responsive">
            <p>Provide two <span class="dgr-blue">Disease, Gene, or Drug entities (DGRs)</span> as input. GeneDive will show interactions between the two <span class="dgr-blue">DGRs</span> through up to two intermediary <span class="dgr-orange">DGRs</span>.</p>
          </div>
          <div class="mode">
            <h4>Clique</h4>
            <img src="/static/genedive/images/help/clique.png" class="img-responsive">
            <p>Provide one <span class="dgr-blue">Disease, Gene, or Drug entity (DGR)</span> as input. GeneDive will show those <span class="dgr-orange">DGRs</span> that interact with the input <span class="dgr-blue">DGR</span> and one of its interactants.</p>
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
                        <button type="button" class="module control-module btn-group btn btn-default reset-graph" data-toggle="tooltip-initial" data-placement="bottom" title="Regenerate the positions of the graph nodes" disabled> <i class="fa fa-refresh" aria-hidden="true"></i> <span class="button-text">Redraw Graph</span></button>
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
            <h4>Move DGRs</h4>
            <p>Click and drag DGRs to move them around. DGRs will stay where you leave them.</p>
          </div>
        </div>
        <div class="modes">
          <div class="mode">
            <i class="fa fa-search-plus" aria-hidden="true"></i>
            <h4>Shift-Click DGR to Add</h4>
            <p>Shift-Click on DGRs to add them to the search. Releasing shift will start a new search.</p>
          </div>
          <div class="mode">
            <i class="fa fa-search" aria-hidden="true"></i>
            <h4>Ctrl-Click DGR to Start New Search</h4>
            <p>Ctrl-Click on a DGR to start a new search with only that DGR.</p>
          </div>
        </div>
        </div>
      </div>
    </div>

  </div>
</div>

<?php include "footer.php"; ?>
