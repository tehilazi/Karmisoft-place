<?php
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");

// $floor = filter_var($_GET['floor'], FILTER_SANITIZE_NUMBER_INT);

include_once("sql.php");

$floorID = $_GET["floorID"];

$conn = connect();

$sql = "SELECT `id`, `number` as 'room_number',`name` as 'room_name'  FROM rooms Where `floor_id`=$floorID ORDER BY `number` ASC";
// WHERE id_floor = {$floor}

$result = $conn->query($sql);
$rooms = [];

if ($result && $result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $rooms[] = $row;
    }
} //else echo "0 results";

header ('Content-Type: application/json');
echo json_encode($rooms);