<?php
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");

include_once("../models/sql.php");
require __DIR__ . '/../vendor/autoload.php';	
use \Firebase\JWT\JWT;


function readCompanies($tokenData){
	$conn = connect();
	$companies = array();
	$role = $tokenData["user_role"];
	$userID = $tokenData["user_id"];
	$query = '';
	if ($role === 'app_admin'){
		$query = "SELECT `id`,`name` FROM companies ORDER BY name ASC";
		$query_company = $conn->query($query);
		if ($query_company){
			while($row = $query_company->fetch_assoc()){
				$companies[] = $row;
			}
		}
	} else if ($role === 'company_admin' && $userID){
		
		$query = "SELECT `companies`.`id`,`companies`.`name` FROM `companies`
				  inner join `user_company`
				  ON `companies`.id = `user_company`.`company_id`
				  WHERE `user_company`.`user_id` = '{$userID}'
				  ORDER BY `companies`.`name` ASC";
		$query_company = $conn->query($query);
		if ($query_company){
			while($row = $query_company->fetch_assoc()){
				$companies[] = $row;
			}
		}
	}


	
	header ('Content-Type: application/json');
	echo json_encode($companies);
}

function addCompany($tokenData){
	$conn = connect();
	$response = array( 
		"isSucceeded" => false,
		"canAddMore" => true, // is the user can add more companies
		"companyID" => null
	);
	$role = $tokenData["user_role"];
	$userID = $tokenData["user_id"];
	$companyName = $_POST['name'];
	if ($companyName){
		$query = "INSERT INTO `companies`(`name`) 
				  VALUES ('{$companyName}')";
		$result = mysqli_query($conn, $query);
		$response["isSucceeded"] =  $result;
		if ($result){
			$companyID = $conn->insert_id;
			$response["companyID"] = $companyID; 
			if ($role === 'company_admin' && $userID){
				$query = "INSERT INTO `user_company`(`user_id`, `company_id`) 
				          VALUES ({$userID},{$companyID})";
				$result = mysqli_query($conn, $query);
				$response["isSucceeded"] =  $result;
			}
		}
		
	}

	header ('Content-Type: application/json');
	echo json_encode($response);
}




if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action'])){
	// The request is using the GET method
	$action = $_GET['action'];
	$token = $_GET['token'];
	$key = "example_key";
	$decoded = JWT::decode($token, $key, array('HS256'));
	if ($decoded){
		$tokenData = (array) $decoded;
	}
	switch ($action) {
		case 'read companies':
			readCompanies($tokenData);
		break;
	}
}
else if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
	 // The request is using the POST method
	$token = $_POST['token'];
	$key = "example_key";
	$decoded = JWT::decode($token, $key, array('HS256'));
	if ($decoded){
		$tokenData = (array) $decoded;
	}
	$action = $_POST['action'];
	switch ($action) {
		case 'add company':
			addCompany($tokenData);
		break;
	}
}