<div class="menu dropdown">
  <button class="btn btn-lg btn-link dropdown-toggle" type="button" id="menu-dropdown-button" data-toggle="dropdown"><span class="fa fa-bars"></span></button>
  <ul class="dropdown-menu dropdown-menu-right" style="margin-left: 20px; min-width: 240px;">
    <li class="dropdown-header">Manage Data Sources</li>
    <li class="dropdown-item" style="cursor: pointer;"><a class="datasources" data-toggle="tooltip-initial" title="Select different data sources to query"><span class="fas fa-database"></span><span class="fas fa-check-square" style="font-size: 8pt; margin-left: 1px"></span> Select Data Source</a></li>
    <li class="dropdown-item" style="cursor: pointer;"><a class="datasource-add" href="datasource/add.php" target="_blank" data-toggle="tooltip-initial" title="Import your own DGR interaction data."><span class="fas fa-database"></span><span class="fas fa-plus-square" style="font-size: 8pt; margin-left: 1px"></span> Add Data Source</a></li>
    <li class="dropdown-item" style="cursor: pointer;"><a class="datasource-remove" href="datasource/remove.php" target="_blank" data-toggle="tooltip-initial" title="Remove a DGR interaction datasource."><span class="fas fa-database"></span><span class="fas fa-minus-square" style="font-size: 8pt; margin-left: 1px"></span> Remove Data Source</a></li>
    <li class="divider" role="separator"></li>
    <li class="dropdown-header">Save/Restore Session</li>
    <li class="dropdown-item" style="cursor: pointer;"><a class="download-module download" data-toggle="tooltip-initial" title="Download the current graph image, the current state, state history, and a CSV of the interactions as a zip file."><span class="fas fa-download"></span> Save Session</a></li>
    <li class="dropdown-item" style="cursor: pointer;"><a class="download-module upload" data-toggle="tooltip-initial" title="Upload a previously downloaded GeneDive Session zip file to resume that session."><span class="fas fa-upload"></span> Restore Session</a></li>
    <li class="divider" role="separator"></li>
<?php if( file_exists( 'static/genedive/docker/images/genedive-docker.gz' )): ?>
    <li class="dropdown-header">GeneDive Docker Image (GDI)</li>
    <li class="dropdown-item" style="cursor: pointer;"><a class="docker" data-toggle="tooltip-initial" href="/static/genedive/docker/images/genedive-docker.gz" title="Download the GeneDive Docker image. The GeneDive Docker image will allow you to import your own structured DGR data for search and visualization in GeneDive."><span class="fab fa-docker"></span> Download GDI (<?php echo( sprintf( "%.1f GB", filesize( 'static/genedive/docker/images/genedive-docker.gz')/ (1024 * 1024 * 1024 ))) ?>)</a></li>
<?php endif; ?>
    <li class="divider" role="separator"></li>
    <li class="dropdown-header">More Information</li>
    <li class="dropdown-item" style="cursor: pointer;"><a class="help"  data-toggle="tooltip-initial" href="/help.html" target="_blank" title="Quickstart guide on how to use GeneDive and interpret results."><span class="fas fa-question-circle"></span> Help</a></li>
    <li class="dropdown-item" style="cursor: pointer;"><a class="about" data-toggle="tooltip-initial" href="/about.html" target="_blank" title="Citation, architecture and design, contact, and general information about GeneDive"><span class="fas fa-info-circle"></span> About</a></li>
  </ul>
</div>
