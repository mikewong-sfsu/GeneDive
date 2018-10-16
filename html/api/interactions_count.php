<?php

require_once "../auth.php";
require_once "../environment.php";

$data = [];

// Gets the key
if(isset($_GET['queryKey']))
{
    $queryKey = $_GET['queryKey'];
    $queryVal = "interactions_$queryKey";
}
else
    exit("Error: queryKey missing");

// Gets the value. If the value is found, delete it from the session so as to save space
if(isset($_SESSION[ $queryVal])){
        $data["count"] = $_SESSION[ $queryVal];
        unset($_SESSION[ $queryVal]);
        $data["found"] = true;
}
else
    $data["found"] = false;


echo json_encode($data);