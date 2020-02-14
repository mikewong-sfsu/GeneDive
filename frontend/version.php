<?php

$release = [ 
  "major" => 2,
  "minor" => 5,
  "patch" => 0,
  "date"  => "2020-02-14"
];

function genedive_version() {
  global $release;
  return $release[ 'major' ] . '.' . $release[ 'minor' ];
}  

function genedive_patch_level() {
  global $release;
  return $release[ 'major' ] . '.' . $release[ 'minor' ] . '.' . $release[ 'patch' ];
}  

function genedive_release_date() {
  global $release;
  return $release[ 'date' ];
}  

?>
