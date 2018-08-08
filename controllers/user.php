<?php
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");

include_once("../models/sql.php");
require __DIR__ . '/../vendor/autoload.php';	
use \Firebase\JWT\JWT;


function getUserDetails($decodedToken){
	$userID = $decodedToken["user_id"];
	$conn = connect();
	$response = array(
		"firstName" => "Doron",
		"lastName" => "Test",
		"email" => "dd@dd.com"
	);
	// $token = $_GET['token'];
	if ($userID){
		$query = "SELECT `first_name`,`last_name`,`email` FROM `users` WHERE id = ? LIMIT 1"
		or die("Failed to query database" . mysqli_error());

		$sql = $conn->prepare($query);
		$sql->bind_param('s', $userID);
		$sql->execute();

		$sql->bind_result($firstName,$lastName,$email);
		$sql->fetch();
		$response["firstName"] = $firstName;
		$response["lastName"] = $lastName;
		$response["email"] = $email;
	}


	
	header ('Content-Type: application/json');
	echo json_encode($response);
}






if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action'])){
	// The request is using the GET method
	$action = $_GET['action'];
	// $jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9leGFtcGxlLm9yZyIsImF1ZCI6Imh0dHA6XC9cL2V4YW1wbGUuY29tIiwiaWF0IjoxNTI0MDQ1MTE0LCJ1c2VyX2lkIjoxLCJ1c2VyX3JvbGUiOiJhcHBfYWRtaW4ifQ.WZfCu4L7MksvTdjiy8kBQ-w6arpkiz6FMVP7G0EDMwc";
	$token = $_GET['token'];
	$key = "example_key";
	$decoded = JWT::decode($token, $key, array('HS256'));
	if ($decoded){
		$decoded_array = (array) $decoded;
	}
	switch ($action) {
		case 'get user details':
			getUserDetails($decoded_array);
		break;
	}
}
else if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
//	  The request is using the POST method
	$action = $_POST['action'];
	// switch ($action) {
	// }
}