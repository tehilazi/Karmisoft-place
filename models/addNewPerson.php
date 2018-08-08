<?php

include_once("sql.php");
$conn = connect();


// if(isset($_POST['submit'])) {

	$id = $_POST['id'];
	$f_name = $_POST['f_name'];
	$l_name = $_POST['l_name'];
	$email = $_POST['email'];
	$phone = $_POST['phone'];
	$pc_model = $_POST['pc_model'];
	$id_company = $_POST['id_company'];
	$park_space = $_POST['park_space'];
	
	

$sql = mysqli_query($conn, "INSERT INTO employees (id, f_name, l_name, email, phone, pc_model, id_company, park_space)VALUES ('$id','$f_name','$l_name','$email','$phone', '#pc_model', '#id_company', '#park_space'
		)");

// 		if ($conn->query($sql) === TRUE) {
//     echo "New record created successfully";
// } else {
//     echo "Error: " . $sql . "<br>" . $conn->error;

//  exit(); 
//    $conn->close();
// }
