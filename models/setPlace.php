<?php

require_once 'sql.php';
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");

$response = array( 
	"isSucceeded" => false
);

if (isset($_POST['point_id']) && $_POST['point_id'] && isset($_POST['employee_id']) && $_POST['employee_id']
    && isset($_POST['action']) && (strtolower($_POST['action'])==='add' || strtolower($_POST['action'])==='replace') ){
	$conn = connect();

	$pointID = filter_var($_POST['point_id'], FILTER_SANITIZE_NUMBER_INT);
	$employeeID = filter_var($_POST['employee_id'], FILTER_SANITIZE_NUMBER_INT);
	
	// Place employee in new point
	$query = "UPDATE points SET employee_id = {$employeeID} WHERE id = {$pointID}";
	
	$result = mysqli_query($conn, $query);

	if ($conn->errno === 0){
		// Place employee succeeded
		if (strtolower($_POST['action'])==='add'){
			$response["isSucceeded"] = true;
		}else if (strtolower($_POST['action'])==='replace'){
			    // Free the other points that placed by the employee
				$query = "UPDATE points SET employee_id = NULL WHERE employee_id={$employeeID} and id <> {$pointID}";
				$result = mysqli_query($conn, $query);
				if ($conn->errno === 0){
					// Free the other points succeeded
					$response["isSucceeded"] = true;
				}
		}

	}
}

header ('Content-Type: application/json');
echo json_encode($response);
 