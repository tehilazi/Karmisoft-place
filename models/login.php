<?php

// session_start(); 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");

include_once("sql.php");
require __DIR__ . '/../vendor/autoload.php';	
use \Firebase\JWT\JWT;

$conn = connect();
$pswd = '';
$error=''; 
$response = array( 
	"isSucceeded" => false,
	"token" => null,
	"userDetails" => array(
		"firstName" => "",
		"lastName" => "",
		"email" => ""
	)
);
// if (isset($_POST['username']) && isset($_POST['password'])) {
if (isset($_POST['email']) && isset($_POST['password'])) {
	// $user = filter_var($_POST['username'], FILTER_SANITIZE_STRING);
	$email = filter_var($_POST['email'], FILTER_SANITIZE_STRING);
	$pswd = filter_var($_POST['password'], FILTER_SANITIZE_STRING);
}

$query = "SELECT `id`,`password`,`role`,`first_name`,`last_name` FROM `users` WHERE email = ? LIMIT 1"
or die("Failed to query database" . mysqli_error());

$sql = $conn->prepare($query);
// $sql->bind_param('s', $user); // ?=
$sql->bind_param('s', $email);
$sql->execute();

$sql->bind_result($id,$hash,$role,$firstName,$lastName);
$sql->fetch();

if (isset($_POST['login'])) {
	if (password_verify($pswd, $hash)) {
		// echo "Login success! Welcome " . $_SESSION['username'];
		// $_SESSION['username'] = $user;
		// $_SESSION['userID'] = $id;
		// $_SESSION['userRole'] = $role;
		// $_SESSION['companyID'] = $companyID;
		$key = "example_key";
		$token = array(
			"iss" => "http://example.org",
			"aud" => "http://example.com",
			"iat" => time(),
			// "exp" => time() + 1000,
			"user_id" => $id,
			"user_role" => $role
		);

		$jwt = JWT::encode($token, $key);
		$decoded = JWT::decode($jwt, $key, array('HS256'));

		// print_r($decoded);

		$decoded_array = (array) $decoded;
		$response["isSucceeded"] =  true;
		$response["token"] =  $jwt;
		$response["userDetails"]["firstName"] =  $firstName;
		$response["userDetails"]["lastName"] =  $lastName;
		$response["userDetails"]["email"] =  $email;

		// header('Location: index.php');
	} else {
		// $error = "* Failed to login. Try again ";
	}

	// if (empty($_POST['username']) || empty($_POST['password'])) {
	// 	$error = "* Please enter login and password.";
	// }
	header ('Content-Type: application/json');
	echo json_encode($response);
}

if(isset($_POST["logout"])) {
	// session_destroy();
	// header('Location: login.php');
}

// session_start(); 
// $_SESSION['username'] = 'test';
	// $response = array( 
	// 	"isSucceeded" => true,
	// 	"token" => 'xsjnaskjAmlkasnx123'
	// );

	// header ('Content-Type: application/json');
	// echo json_encode($response);

// Test start




// $num = 4;
