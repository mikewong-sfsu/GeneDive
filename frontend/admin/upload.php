<?php
require_once "../phpLib/environment.php";
if(!IS_DOCKER_CONTAINER)
  exit("Not in docker container");

?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Upload file to <?php echo ENVIRONMENT_NAME;?></title>
</head>
<body>
  <form action="import.php" method="post" enctype="multipart/form-data">
    TSV file: <input type="file" name="file1"  accept=".tsv"/>
    <input type="submit">
  </form>
</body>
</html>