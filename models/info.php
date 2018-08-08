<?php

require_once 'config.php';
echo connect();
function connect() {
	global $servername; 
	global $username; 
	global $password; 
	global $dbname; 
	echo "servername ".$servername;

// Create connection
 // $conn = mysql_connect('localhost', 'root','Karmi123');
$conn = new mysqli($servername, $username, $password, $dbname);
//$conn = new mysqli('localhost', 'root','Karmi123', 'mysql');
// Check connection
	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	} 
	echo "Connected successfully";
	return $conn;	

}
phpinfo();
?>