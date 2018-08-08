<?php

// $floor = filter_var($_GET['floor'], FILTER_SANITIZE_NUMBER_INT);

include_once("sql.php");

$conn = connect();

$sql = "SELECT `id`,`point_x` as x, `point_y` as y, `floor_id`, `employee_id` as 'numberOfPerson' FROM points";
// WHERE id_floor = {$floor}

$result = $conn->query($sql);
$places = [];

if ($result && $result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $places[] = $row;
    }
} //else echo "0 results";

header ('Content-Type: application/json');
echo json_encode($places);