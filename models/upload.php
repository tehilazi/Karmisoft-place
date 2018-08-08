<?php
include_once("sql.php");
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");

// header ('Content-Type: application/json');
// echo json_encode($places);

if (isset($_POST['floorName']) && isset($_POST['buildingID'])){
	$name = $_POST['floorName'];
	$buildingID = $_POST['buildingID'];
	$f_u = $_FILES['file-upload'];
	$roomsNumber = $_POST['roomsNumber'];
	//$roomsNumber = null; 
	if ($roomsNumber){
		$roomsNumber = (int)$roomsNumber;
	}

	$conn = connect();
	$sql = "
		 INSERT INTO floors(name, building_id)
		 VALUES ('$name',$buildingID)
	";
	$result = $conn->query($sql);
	
	$fileOrgName = basename($_FILES["file-upload"]["name"]);
	$extention = pathinfo($fileOrgName, PATHINFO_EXTENSION);
	$floorID = $conn->insert_id;
	$fileName = "floor_".$floorID.".".$extention;
	$target_file = "../img/floors/" . $fileName; // Relative path to upload the image
	$filePath = "/img/floors/".$fileName; // Path to get image from server
	if (move_uploaded_file($_FILES["file-upload"]["tmp_name"], $target_file)) {
		// TO DO
		$sql = "
		UPDATE floors
		SET image = '$filePath'
		Where ID = $floorID
   		";
   		$result = $conn->query($sql);
	} else {
		// TO DO
	}

	// Add rooms to the floor
	if ($roomsNumber>0){
		for ($i=1; $i<=$roomsNumber; $i++){
			$roomName = "Room ".$i;
			$sql = "
				INSERT INTO rooms(floor_id, number, name)
				VALUES ($floorID,$i,'$roomName')
			   ";
			   $result = $conn->query($sql);
		}
	}


	header ('Content-Type: application/json');

	// echo json_encode(array("id" => $floorID));
	echo json_encode($floorID);
}



?>