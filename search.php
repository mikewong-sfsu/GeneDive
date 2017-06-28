<?php include_once "auth.php"; ?>

<?php include "header.php"; ?>

<!-- Bootstrap navbar -->
<nav class="navbar navbar-default navbar-fixed-top topnav">
  <div class="container-fluid">
    <div class="navbar-header">
      <span class="navbar-brand" href="/search">GeneDive</span>
    </div>
    <div id='navbar-search' class='nav navbar-left navbar-form'>
    </div>
    <div class='nav navbar-left filter-hide-show'>
      <span><span class='filter-action-option'>Hide</span> Filters ( <span class='active-filter-count'>0</span> )</span>
    </div>
    <div class='nav navbar-left view-controller'>
      <i id='show-view-table' class="fa fa-table active" aria-hidden="true"></i>
      <i id='show-view-graph' class="fa fa-pie-chart" aria-hidden="true"></i>
    </div>
    <ul class="nav navbar-nav navbar-right">
    </ul>
  </div>
</nav>

<!-- Filter Fixed Navbar -->
<nav class="navbar navbar-default navbar-fixed-top" id='filter-nav'>
    <div class='container-fluid'>
        <div class='row'>
            <div class='col-sm-3 add-filter'>
                    <div class='dropdowns'>
                        <select class='form-control filter-attribute'>
                            <option value='journal'>Journal</option>
                            <option value='section'>Section</option>
                            <option value='gene'>Gene</option>
                            <option value='excerpt'>Excerpt</option>
                            <option value='probability'>Probability</option>
                            <option value='article'>Article</option>
                        </select>
                        <select class='form-control filter-operator'>
                            <option value='=='>matches</option>
                            <option value='=/='>does not match</option>
                        </select>
                    </div>
                    <input class='form-control filter-value'>
                    <button class='btn btn-primary filter-add'>Add Filter</button>
            </div>
            <div class='col-sm-5 filter-display'>

            </div>
            <div class='col-sm-4 graph-searches'>
                <button id='gs-clique' class='btn btn-default'><span>Clique</span></button>
                <button id='gs-one-hop' class='btn btn-default'><span>One-Hop</span></button>
                <button id='gs-one-hop-friends' class='btn btn-default'><span>One-Hop Friends</span></button>
                <button id='gs-one-hop-bridges' class='btn btn-default'><span>One-Hop Bridges</span></button>
            </div>
        </div>
    </div>
</nav>

<!-- SEARCH CONTROLS -->
<div class='container' id='search-controls-container'>
    <div class='row' id='search-form-row'>
        <div class='col-xs-12 col-sm-8 col-sm-offset-2' id="search-form-holder">
            <!-- Interaction Search -->
            <form id='search-form-gene' name="search-form-gene" onsubmit='return false'>
                <div class="input-group">
                    <input class='form-control tt-enabled-input' id='search-query' type='text' placeholder="Enter a gene symbol...">
                    <span class="input-group-btn"><button class='btn btn-default' type='submit'><span class="input-group-btn" style='font-size:14px;'>Go</span></button></span>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- TAB CONTROLLERS
<div class='container-fluid tabs'>
    <div class='row'>
        <div class='col-xs-12 tab-row'>
            <span id='table-tab' class='tab active-tab' data-view='table'>Table View</span>
            <span id='graph-tab' class='tab' data-view='graph'>Graph View</span>
        </div>
    </div>
</div>
-->

<!-- TABLE DISPLAYS / VIEWS -->
<div class='views container-fluid'>

    <!-- LOADING VIEW -->

    <!-- TABLE TAB -->
    <div class='tab-view' id='results'>
        <div class='row'>
            <div class='col-sm-3 col-xs-12 group-by-controls'>
                <div><span>Group By:</span></div>
                <div class="btn-group" data-toggle="buttons">
                  <label class="btn btn-primary active">
                    <input value="gene-gene" type="radio" name="options" id="option1" autocomplete="off" checked>Gene-Gene
                  </label>
                  <label class="btn btn-primary">
                    <input value="article" type="radio" name="options" id="option2" autocomplete="off">Article
                  </label>
                </div>
            </div>
            <div class='col-sm-3 col-xs-12'>
                <div class='highlight-form'>
                    <label for="highlight-input">Highlight:</label>
                    <input type="text" class="form-control highlight-input" placeholder="Highlight Term...">
                    <span class='active-highlight'></span>
                </div>
            </div>
            <div class='col-sm-3 result-count-holder'>
                <span class='result-count'></span>
            </div>
            <div class='col-sm-3 col-xs-12 download-panel'>
                <a id='download-link'>Download Results</a>
            </div>
        </div>
        <div class='row'>
            <div class='col-xs-12' id="table-view">
            </div>
        </div>
    </div>

    <!-- GRAPH TAB -->
    <div class='tab-view' id='graph-results' style='display:none;'>
        <div class='row' class='graph-controls'>
            <div class='col-sm-4'>
                <label>Run Simulation
                    <input type='checkbox' id='run-simulation' checked>
                </label>
            </div>
            <div class='col-sm-3 col-xs-12'>
                <!--
                <div class='highlight-form'>
                    <label for="highlight-input">Highlight:</label>
                    <input type="text" class="form-control highlight-input" placeholder="Highlight Term...">
                    <span class='active-highlight'></span>
                </div>
                -->
            </div>
        </div>
        <div id='graph-converging-spinner'>
            <div class='row'>
                <div class='col-xs-12 spinner-holder'>
                    <img src='/html/genedive/images/spinner.svg'>
                </div>
            </div>
        </div>
        <div class='row'>
            <div class='col-xs-12' id='graph-view-area'>
                <div class='container-fluid' id='graph-display'>
                </div>
            </div>
        </div>
    </div>

</div>

<?php include "footer.php" ?>