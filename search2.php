<?php include_once "auth.php"; ?>

<?php include "header.php"; ?>

<div class="container-fluid search-display">
  <div class="control-view">

    <div class="controls-search">

      <div class="title-bar">
        <h5>Search</h5>
        <span>Help</span>
      </div>

      <input type="text" placeholder="search a gene..." class="form-control search-input">

      <div class="search-item">
        <span class="name">BRCA2</span>
        <span class="remove">X</span>
      </div>

      <div class="search-item">
        <span class="name">ABC1</span>
        <span class="remove">X</span>
      </div>

    </div>

    <div class="controls-topology">
      
      <div class="title-bar">
        <h5>Topology</h5>
        <span>Help</span>
      </div>

      <div class="btn-group" role="group">
        <button type="button" class="btn btn-default">None</button>
        <button type="button" class="btn btn-default">Clique</button>
        <button type="button" class="btn btn-default">n-Hop</button>
      </div>

    </div>

    <div class="controls-filter">

      <div class="title-bar">
        <h5>Filters</h5>
        <span>Help</span>
      </div>

      <div class="top-row">
        <select class="filter-select">
          <option>Journal</option>
          <option>Article</option>
          <option>Gene</option>
          <option>Excerpt</option>
        </select>

        <div class="filter-is-not">
          <input type="radio" name="isnot" value="is" checked> is<br>
          <input type="radio" name="isnot" value="not" checked> not<br>
        </div>

      </div>

      <input type="text" placeholder="filter..." class="form-control filter-input">

    </div>

    <div class="controls-account">
      <h4>GeneDive</h4>
      <span>brookthomas@gmail.com</span>
    </div>

  </div>

  <div class="table-view">
    <div class="controls">
      <div class="close">
        <i class="fa fa-times" aria-hidden="true"></i>
      </div>
      <div class="option">
        <input type="radio"> Article<br>
        <input type="radio"> Gene<br>
      </div>
    </div>
    <div class='expand-collapse'>
      <i class="fa fa-bars" aria-hidden="true"></i>
    </div>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </div>
  <div class="graph-view">
    <div class='expand-collapse'>
      <i class="fa fa-bars" aria-hidden="true"></i>
    </div>
  </div>
</div>

<?php include "footer.php"; ?>


<script>

$('.table-view .expand-collapse').on('click', function () {
  $('.table-view .controls').animate({"width":"200px"}, 1000);
});

</script>