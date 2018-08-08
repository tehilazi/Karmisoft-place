<?php 
include_once("sql.php");
// include_once("db.php");
$conn = connect();
$controller = $_POST['controller'];

if(isset($_POST["empl_id"])) {  
      $query = "SELECT * FROM employees WHERE id = '".$_POST["empl_id"]."'";  
      $result = mysqli_query($conn, $query);  
      $row = mysqli_fetch_array($result);
      echo json_encode($row);  
 }
$responce = array();
switch ($controller) {
	case 'add person':
		$id = $_POST['id'];
		$f_name = $_POST['f_name'];
		$l_name = $_POST['l_name'];
		$email = $_POST['email'];
		$phone = $_POST['phone'];
		$id_company = $_POST['id_company'];
		$park_space = $_POST['park_space'];
		$pc_model = $_POST['pc_model'];
		$location_input = $_POST['location_input'];
		// points
		//$query = "UPDATE points SET id_emp='$id' WHERE id='$location_input' LIMIT 1";
		// it's working
		$query = "INSERT INTO employees(id, f_name, l_name, email, phone, pc_model, id_company, park_space) VALUES ('".$id."', '".$f_name."', '".$l_name."', '".$email."', '".$phone."', '".$pc_model."', '".$id_company."', '".$park_space."')";
      	$result = mysqli_query($conn, $query);
      	echo json_encode($result); 
	break;
	case 'edit person':
	break;
}
