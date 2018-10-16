<?php
require_once "lib/environment.php";
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Upload file to <?php echo ENVIRONMENT_NAME;?></title>
</head>
<body>
  <form action="api/import.php" method="post" enctype="multipart/form-data">
    TSV file: <input type="file" name="file1"  accept=".tsv"/>
    <input type="submit">
  </form>
</body>
</html>