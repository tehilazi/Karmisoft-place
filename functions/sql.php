<?php

function Sql_connect() {

    $servername = "localhost";
    $username = "root";
    $password = "mamram";
    $dbname = "plan_floor";

// Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 
}
// echo "Connected successfully";
