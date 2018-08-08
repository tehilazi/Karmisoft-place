<?php
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");

// function alert($msg) {
//     echo "<script type='text/javascript'>alert('$msg');</script>";
// }
include_once("sql.php");
// include_once("setPlace.php");
// include_once("db.php");
$conn = connect();

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

if (isset($request->controller)){
	$controller = $request->controller;
	$result = array();
	$responce = array();
	$get_id = 1;

	switch ($controller) {
		case 'add person':
			$response = array( 
				"isSucceeded" => true,
				"errors" => [] 
			);


			// Get data
			$id = (isset($_POST['id']))? $_POST['id'] : null;
			$firstName = (isset($_POST['f_name']))? $_POST['f_name'] : null;
			$lastName = (isset($_POST['l_name']))? $_POST['l_name'] : null;
			$email = (isset($_POST['email']))? $_POST['email'] : null;
			$phone = (isset($_POST['phone']))? $_POST['phone'] : null;
			$companyID = (isset($_POST['id_company']))? $_POST['id_company'] : null;
			$departments = (isset($_POST['departments']))? $_POST['departments'] : null;

			// Validations
			$validationPass= true;
			if (!$id){
				$validationPass= false;
				$response["isSucceeded"] = false;
				$response["errors"][] = "Employee ID is required.";
			}
			if (!$firstName){
				$validationPass= false;
				$response["isSucceeded"] = false;
				$response["errors"][] = "First name is required.";
			}
			if (!$lastName){
				$validationPass= false;
				$response["isSucceeded"] = false;
				$response["errors"][] = "Last name is required.";
			}
			if (!$email){
				$validationPass= false;
				$response["isSucceeded"] = false;
				$response["errors"][] = "Email is required.";
			}
			if (!$phone){
				$validationPass= false;
				$response["isSucceeded"] = false;
				$response["errors"][] = "Phone is required.";
			}
			if (!$companyID){
				$validationPass= false;
				$response["isSucceeded"] = false;
				$response["errors"][] = "Company is required.";
			}
			if (!$departments){
				$validationPass= false;
				$response["isSucceeded"] = false;
				$response["errors"][] = "Departments are required.";
			}


			$result = false;

			if ($validationPass){
				$firstName = $conn->real_escape_string($firstName);
				$lastName = $conn->real_escape_string($lastName);
				$phone = $conn->real_escape_string($phone);
				$email = $conn->real_escape_string($email);
				// Insert employee
				$query = "   INSERT INTO `employees`(`id`, `first_name`, `last_name`, `phone`, `email`,`company_id`) 
				VALUES ({$id},'{$firstName}','{$lastName}','{$phone}','{$email}',{$companyID})";
				$result = mysqli_query($conn, $query);

				if (!$result){
					$response["isSucceeded"] = false;
					$response["errors"][] = "Failed to add the employee.Please try again.";
				}
				else {
					// Insert employee's departments
					foreach ($departments as $key => $value) {
						$query = "   INSERT INTO `employee_departments`(`employee_id`, `department_id`) 
										VALUES ('{$id}',{$value})";
						$result = mysqli_query($conn, $query);	
						if (!$result){
							$response["isSucceeded"] = false;
							$response["errors"][] = "Failed to add the employee.Please try again.";
						}
					}

				}
			}



			header ('Content-Type: application/json');
			echo json_encode($response);
		break;
		case 'edit person':
			$id = $_POST['id'];
			$f_name = $_POST['f_name'];
			$l_name = $_POST['l_name'];
			$email = $_POST['email'];
			$phone = $_POST['phone'];
			$id_company = intval($_POST['id_company']);
			$departments = $_POST['departments'];
			//$team = intval($_POST['team']) == '' ? 'NULL' : $_POST['team'];
			// $team = NULL;
			//$models = $_POST['models'] ? $_POST['models'] : -1;
			// $id_company = 104;
			//$park_space = $_POST['park_space'];
			// $pc_model = $_POST['pc_model'];
			//$location_input = $_POST['location'];

			$query = "UPDATE employees SET first_name = '$f_name', last_name = '$l_name', email = '$email', phone = '$phone' WHERE id = $id LIMIT 1";
			$result = mysqli_query($conn, $query);
			if ($conn->errno) {
				die($conn->error);
			}

			if ($result && $departments && count($departments)>0){
				$query = "DELETE FROM `employee_departments` WHERE `employee_id`={$id}";
				$result = mysqli_query($conn, $query);

				if ($result){
					foreach ($departments as $key => $value) {
						$query = "INSERT INTO `employee_departments`(`employee_id`, `department_id`) 
								VALUES ('{$id}',{$value})";
						$result = mysqli_query($conn, $query);	
					}
				}
			}
			

	/*
			$query = "UPDATE equipment SET employee_id = null WHERE employee_id = $id";
			mysqli_query($conn, $query);
			if ($conn->errno) {
				die($conn->error);
			}
			$query = "UPDATE equipment SET employee_id = $id WHERE id IN ($models)";
			mysqli_query($conn, $query);
			if ($conn->errno) {
				die($conn->error);
			}

			$query = "UPDATE points SET id_emp = '$id' WHERE id = '$location_input' LIMIT 1";
			$result[] = mysqli_query($conn, $query);
			$result[] = $id_company;
			*/
			// if ($conn->errno == 1062) {
			// 	$query =  "UPDATE points SET id_emp = null WHERE id_emp = '$id' LIMIT 1";
			// 	$query	= "UPDATE points SET id_emp = '$id' WHERE id = '$location_input' LIMIT 1";

			// $result[] = mysqli_query($conn, $query);
			// }
			// header ('Content-Type: application/json');
			echo json_encode($result);
		break;
		case 'add point':
			$response = array( 
				"isSucceeded" => false
			);
			if (isset($request->floor_id) && isset($request->point_x) && isset($request->point_y)){
				$id_floor = $request->floor_id;
				$id_room = null;
				if (isset($request->room_id)){
					$id_room = $request->room_id;
				} else {
					$id_room = "NULL";
				}
				$point_x = $request->point_x;
				$point_y = $request->point_y;

				// Room ID number -1 means Open Space
				// if ((int)$id_room === -1){
				// 	$id_room = "NULL";
				// }

				$query = "INSERT INTO points (floor_id, room_id, point_x, point_y) VALUES (".$id_floor.", ".$id_room.", ".$point_x.", ".$point_y.")";
				$result = mysqli_query($conn, $query);
				$response['isSucceeded'] = 	$result;			
			}


			header ('Content-Type: application/json');
			echo json_encode($result);

		break;
		case 'add building':
			$response = array( 
				"isSucceeded" => false
			);
			if (isset($request->name) && isset($request->city) && isset($request->address) && isset($request->zip) && isset($request->company_id)){
				$name = $request->name;
				$city = $request->city;
				$address = $request->address;
				$zip = $request->zip;
				$companyID = $request->company_id;

				$query = "   INSERT INTO `buildings`(`name`, `city`, `address`, `zip`, `company_id`) 
							VALUES ('{$name}','{$city}','{$address}','{$zip}',{$companyID})";
				$result = mysqli_query($conn, $query);
				$get_id = $conn->insert_id;
				$response["building_id"]=$get_id;
				$response["isSucceeded"] =  $result;
			}


			header ('Content-Type: application/json');
			echo json_encode($response);

		break;
		case 'add company':
			$name = $_POST['name'];

			$response = array( 
				"isSucceeded" => false,
				"canAddMore" => true // is the user can add more companies
			);

			if ($_POST['name']){
				session_start();
				$username = $_SESSION['username'];
				$userRole = $_SESSION['userRole'];
				$companyID =  $_SESSION['companyID'];
				if ($userRole ==="app_admin" ){
					$query = "   INSERT INTO `companies`(`name`) 
								VALUES ('{$name}')";
					$result = mysqli_query($conn, $query);
					$response["isSucceeded"] =  $result;
				} else if (!$companyID){
					$query = "   INSERT INTO `companies`(`name`) 
								VALUES ('{$name}')";
					$result = mysqli_query($conn, $query);
					if ($result){
						$companyID = $conn->insert_id;
						$query = "   UPDATE  `users` SET `company_id`={$companyID} 
									Where `username` ='{$username}'";
						$result = mysqli_query($conn, $query);
						$response["isSucceeded"] =  $result;
						if ($result){
							$_SESSION['companyID'] = $companyID;
							$response["canAddMore"] =  false;
						}
					}
				}
			}


			header ('Content-Type: application/json');
			echo json_encode($response);

		break;
		case 'add department':
			$response = array( 
				"isSucceeded" => false
			);
			if (isset($request->name) && isset($request->company_id)){
				$name = $request->name;
				$companyID = $request->company_id;

				if ($name && $companyID){
					$name = $conn->real_escape_string($name);
					$query = "   INSERT INTO `departments`(`name`,`company_id`) 
								VALUES ('{$name}',{$companyID})";
					$result = mysqli_query($conn, $query);
					$get_id = $conn->insert_id;
					$response["department_id"]=$get_id;
					$response["isSucceeded"] =  $result;
				}
			}



			header ('Content-Type: application/json');
			echo json_encode($response);

		break;
		case 'add group':
			$response = array( 
				"isSucceeded" => false
			);
			if (isset($request->name) && isset($request->company_id) && isset($request->department_id)){
				$name = $request->name;
				$companyID = $request->company_id;
				$departmentID = $request->department_id;



				if ($name && $companyID && $departmentID){
					$name = $conn->real_escape_string($name);
					$query ="INSERT INTO `groups`(`name`) 
								VALUES ('{$name}')";
					$result = mysqli_query($conn, $query);
					$get_id = $conn->insert_id;
					$response['group_id']=$get_id;
					$query ="INSERT INTO `group_department`(`group_id`,`department_id`) 
								VALUES ({$get_id},{$departmentID})";
					$result = mysqli_query($conn, $query);
					$response['group_department_id']=$get_id;
					$response["isSucceeded"] =  $result;
				}
			}



			header ('Content-Type: application/json');
			echo json_encode($response);

		break;

		case 'add team':
			$response = array( 
				"isSucceeded" => false
			);
			if (isset($request->name) && isset($request->company_id) && isset($request->group_id)){
				$name = $request->name;
				$companyID = $request->company_id;
				$groupID = $request->group_id;



				if ($name && $companyID && $groupID){
					$name = $conn->real_escape_string($name);
					$query ="INSERT INTO `teams`(`name`) 
								VALUES ('{$name}')";
					$result = mysqli_query($conn, $query);
					$get_id = $conn->insert_id;
					$response["team_id"] =  $get_id;
					$query ="INSERT INTO `team_group`(`team_id`,`group_id`) 
								VALUES ({$get_id},{$groupID})";
					$result = mysqli_query($conn, $query);
					$response["isSucceeded"] =  $result;
				}
			}



			header ('Content-Type: application/json');
			echo json_encode($response);

		break;

		case 'add employee':
			$response = array( 
				"isSucceeded" => false,
				"employee_id" => null
			);
			if (isset($request->firstName) && isset($request->lastName) && isset($request->phone)
			&& isset($request->email) && isset($request->company_id) && isset($request->team_id)){
				$firstName = $request->firstName;
				$lastName = $request->lastName;
				$phone = $request->phone;
				$email = $request->email;
				$address = $request->address;
				$companyID = $request->company_id;
				$teamID = $request->team_id;



				if ($firstName  && $lastName && $phone && $email && $companyID && $teamID){
					$firstName = $conn->real_escape_string($firstName);
					$lastName = $conn->real_escape_string($lastName);
					$phone = $conn->real_escape_string($phone);
					$email = $conn->real_escape_string($email);
					$query ="INSERT INTO `employees`(`first_name`, `last_name`, `phone`, `email`, `address`, `image`,`company_id`) 
								VALUES ('{$firstName}','{$lastName}',$phone,'{$email}','{$address}',Null,'{$companyID}')";
					$result = mysqli_query($conn, $query);
					if ($result){
						// Succeeded to insert new employee
						$employeeID = $conn->insert_id;
						$response["employee_id"]= $employeeID;
						$query ="INSERT INTO `employee_team`(`employee_id`,`team_id`) 
									VALUES ({$employeeID},{$teamID})";
						$result = mysqli_query($conn, $query);
						if($result) {
							$query = "SELECT * FROM `team_group` left join `group_department` on `team_group`.`group_id`= `group_department`.`group_id`
							WHERE `team_group`.`team_id`={$teamID}";
							$result = mysqli_query($conn, $query);
							if(!$result) {
								die('<br/>MySQL Error: ' . mysql_error());
							}
							else {
								$row = mysqli_fetch_array($result);
								$departmentID = $row['department_id'];
							}
							$query ="INSERT INTO `employee_departments`(`employee_id`,`department_id`) 
									VALUES ({$employeeID},{$departmentID})";
							$result = mysqli_query($conn, $query);
							$response["isSucceeded"] =  $result;
						}

					}
				}
			}



			header ('Content-Type: application/json');
			echo json_encode($response);

		break;

		case 'read companies':
			$companies = array();
			$query = "SELECT * FROM companies ORDER BY name ASC";
			if ($query){
				$query_company = $conn->query($query);
				if ($query_company){
					while($row = $query_company->fetch_assoc()){
						$companies[] = $row;
					}
				}

			}
/*
			session_start();
			$conn = connect();
			$companies = array();
			if ($_SESSION['userRole']){
				$userRole = $_SESSION['userRole'];
				$companyID =  $_SESSION['companyID'];
				$query = null;
				if ($userRole === "app_admin"){
					$query = "SELECT * FROM companies ORDER BY name DESC";

				} else if ($companyID){
					$query = "SELECT * FROM companies where id={$companyID}";
				} 
				if ($query){
					$query_company = $conn->query($query);
					if ($query_company){
						while($row = $query_company->fetch_assoc()){
							$companies[] = $row;
						}
					}

				}
			}
*/
			header ('Content-Type: application/json');

			echo json_encode($companies);
			// die();
		break;
		case 'read pc_model':
			$sql = " SELECT * FROM equipment ";
			$result = $conn->query($sql);
			$persons = [];

			if ($result && $result->num_rows > 0) {
				// output data of each row
				while($row = $result->fetch_assoc()) {
					$persons[] = $row;
				}
			} else echo "0 results";

			header ('Content-Type: application/json');

			echo json_encode($persons);
			// die();
		break;
		case 'read persons':
				$sql2 = " SELECT * FROM employees ";
				$result = $conn->query($sql2);
				$companies = [];

				if ($result->num_rows > 0) {
					// output data of each row
					while($row = $result->fetch_assoc()) {
						$companies[] = $row;
					}
				} else echo "0 results";

			header ('Content-Type: application/json');

			echo json_encode($companies);
			// die();
		break;
		case 'read park_spaces':
			$sql2 = " SELECT * FROM parking_space ";
			$result = $conn->query($sql2);
			$spaces = [];
			if ($result && $result->num_rows > 0) {
				// output data of each row
				while($row = $result->fetch_assoc()) {
					$spaces[] = $row;
				}
			} else echo "0 results";
			header ('Content-Type: application/json');
			echo json_encode($spaces);
			// die();
		break;
		case 'read free park_spaces':
			// Doron set in comment
			/*
			$query_park = $conn->query("SELECT parking_space.id FROM parking_space LEFT JOIN employees ON (employees.park_space = parking_space.id) WHERE employees.park_space is null
				ORDER BY id ASC");
			$park_data = $query_park->num_rows;
			*/
			$free_ps = array();
			/*
			if($park_data > 0) {
				while($row = $query_park->fetch_assoc()){
					$free_ps[] = $row['id'];
				}
			}
			*/
			header ('Content-Type: application/json');
			echo json_encode($free_ps);
		break;
		case 'read departments':
			$departments = array();
			if (isset($request->company_id)){
				$companyID = $request->company_id;
				$query_dep = $conn->query("SELECT id,name FROM departments where company_id={$companyID} ORDER BY name ASC");
				
				if ($query_dep){
					while($row = $query_dep->fetch_assoc()){
						$departments[] = $row;
				}
				}
			}
			header ('Content-Type: application/json');
			echo json_encode($departments);

		break;
		case 'read groups':
			$groups = array();
			if (isset($request->company_id)){
				$companyID = $request->company_id;
				//$query_dep = $conn->query("SELECT id,name,department_id FROM groups where company_id={$companyID} ORDER BY name ASC");
				$query_dep = $conn->query("SELECT groups.id, groups.name 'group_name',departments.id 'department_id', departments.name 'department_name' FROM group_department,groups,departments WHERE groups.id= group_department.group_id and departments.id=group_department.department_id and departments.company_id={$companyID} ORDER BY groups.name ASC");
				
				if ($query_dep){
					while($row = $query_dep->fetch_assoc()){
						$groups[] = $row;
				}
				}
			}
			header ('Content-Type: application/json');
			echo json_encode($groups);

		break;
		case 'read teams':
			$teams = array();
			if (isset($request->company_id)){
				$companyID = $request->company_id;
				//$query_team = $conn->query("SELECT * FROM team_group");
				$query_team = $conn->query("SELECT teams.id, teams.name 'team_name', groups.id 'group_id', groups.name 'group_name' FROM team_group,teams,groups,departments,group_department WHERE teams.id=team_group.team_id and groups.id=team_group.group_id and groups.id= group_department.group_id and departments.id=group_department.department_id and departments.company_id={$companyID} ORDER BY groups.name ASC");
				if ($query_team){
					while($row = $query_team->fetch_assoc()){
						$teams[] = $row;
					}
				}
			}
			header ('Content-Type: application/json');
			echo json_encode($teams);
		break;
		case 'read employees':
			$employees = array();
			if (isset($request->company_id)){
				$companyID = $request->company_id;
				//$query_team = $conn->query("SELECT * FROM team_group");
				//$query_employees = $conn->query("SELECT teams.name 'team_name', groups.name 'group_name' FROM team_group,teams,groups,departments,group_department WHERE teams.id=team_group.team_id and groups.id=team_group.group_id and groups.id= group_department.group_id and departments.id=group_department.department_id and departments.company_id={$companyID} ORDER BY groups.name ASC");
				$query_employees = $conn->query("SELECT employees.id , employees.first_name,employees.last_name,
				employees.phone,employees.email ,employees.address, teams.name 'team_name' FROM team_group,teams,groups,departments,group_department,employee_team,employees WHERE employee_team.employee_id=employees.id and employee_team.team_id=teams.id and teams.id=team_group.team_id and groups.id=team_group.group_id and groups.id= group_department.group_id and departments.id=group_department.department_id and departments.company_id={$companyID} ORDER BY employees.last_name ASC");
				
				if ($query_employees){
					while($row = $query_employees->fetch_assoc()){
						$employees[] = $row;
					}
				}
			}
			header ('Content-Type: application/json');
			echo json_encode($employees);
		break;
		case 'read buildings':
			$buildings = array();
			if (isset($request->company_id)){
				$company_id = $request->company_id;
				$query_buildings = $conn->query("SELECT * FROM buildings WHERE company_id=$company_id ORDER BY convert(`name`,decimal) DESC");
				
				while($row = $query_buildings->fetch_assoc()){
					$buildings[] = $row;
				}
			}

			header ('Content-Type: application/json');
			echo json_encode($buildings);
		break;
		case 'read floors':
			$floors = array();
			if (isset($request->company_id)){
				$companyID= $request->company_id;
				$query_floor = $conn->query("SELECT floors.id, floors.name, floors.image, floors.building_id, buildings.name as 'building_name'
											FROM floors
											INNER JOIN buildings
											on floors.building_id = buildings.id
											WHERE buildings.company_id=$companyID
											ORDER BY convert(floors.name,decimal) DESC");
				while($row = $query_floor->fetch_assoc()){
					$floors[] = $row;
				}
			}
			header ('Content-Type: application/json');
			echo json_encode($floors);
		break;
		case 'read building floors':
			$floors = array();
			if (isset($request->building_id)){
				$buildingID= $request->building_id;
				$query_floor = $conn->query("SELECT floors.id, floors.name, floors.image, floors.building_id, buildings.name as 'building_name'
											FROM floors
											INNER JOIN buildings
											on floors.building_id = buildings.id
											WHERE buildings.id=$buildingID
											ORDER BY convert(floors.name,decimal) DESC");
				while($row = $query_floor->fetch_assoc()){
					$floors[] = $row;
				}
			}
			header ('Content-Type: application/json');
			echo json_encode($floors);
		break;
		case 'read single floor':
			$floor = array(
				"id" => null,
				"name" => "",
				"building" => array(
					"id" => null,
					"name" => ""
				),
				"companyID" => null,
				"img" => "",
				// "img" => "/img/floors/floor_51.jpg",
				// "img" => "http://18.195.126.0/img/floors/floor_71.jpg",
				"chairs" => array()
			);
			if (isset($request->floor_id)){
				$floorID= $request->floor_id;
				$query_floor = $conn->query("SELECT floors.id, floors.name, floors.image, floors.building_id, buildings.name as 'building_name', buildings.company_id
							FROM floors
							INNER JOIN buildings
							on floors.building_id = buildings.id
							WHERE floors.id=$floorID
							ORDER BY convert(floors.name,decimal) DESC");
				$row = $query_floor->fetch_assoc();
				if ($row){
					$floor['id'] = $row['id'];
					$floor['name'] = $row['name'];
					$floor['building']["id"] = $row['building_id'];
					$floor['building']["name"] = $row['building_name'];
					$floor['companyID'] = $row['company_id'];
					$floor['img'] = $row['image'];

					$chairs = array(); 
					$query_points = $conn->query("SELECT * FROM `point_details` WHERE floor_id=$floorID");
					while($row = $query_points->fetch_assoc()){
						$chairs[] = array(
							"id" => $row['id'],
							"lat" => $row['point_x'],
							"lng" => $row['point_y'],
							"roomID" => $row['room_id'],
							"employeeID" => $row['employee_id'],
							'location' => $row['location']
						);
					}
					$floor['chairs'] = $chairs;
				}


			}
			/*
			if (isset($request->floorID)){
				$companyID= $request->company_id;
				$query_floor = $conn->query("SELECT floors.id, floors.name, floors.image, floors.building_id, buildings.name as 'building_name'
											FROM floors
											INNER JOIN buildings
											on floors.building_id = buildings.id
											WHERE buildings.company_id=$companyID
											ORDER BY convert(floors.name,decimal) DESC");
				while($row = $query_floor->fetch_assoc()){
					$floors[] = $row;
				}
			}*/
			header ('Content-Type: application/json');
			echo json_encode($floor);
		break;
		case 'edit department':
			$response = array( 
				"isSucceeded" => false
			);
			if (isset($request->department_id) && isset($request->department_name) && isset($request->company_id)){
				$departmentID = $request->department_id;
				$companyID = $request->company_id;
				$departmentName = $request->department_name;



				if ($departmentID  && $departmentName && $companyID){
					$query = "UPDATE `departments` SET `name` = '{$departmentName}'
							WHERE `departments`.`id` = {$departmentID}";//, `company_id` = '{$companyID}' 
					$result = mysqli_query($conn, $query);
					$response["isSucceeded"] =  $result;
				}
			}
			header ('Content-Type: application/json');
			echo json_encode($response);

		break;
		case 'edit group':
			$response = array( 
				"isSucceeded" => false
			);
			if (isset($request->group_id) && isset($request->group_name) && isset($request->department_id)){
				$groupID = $request->group_id;
				$groupName = $request->group_name;
				$departmentID = $request->department_id;

				if ($groupID && $departmentID  && $groupName){
					$query = "UPDATE `groups` SET `name` = '{$groupName}' 
							WHERE `groups`.`id` = {$groupID}";
					$result = mysqli_query($conn, $query);
					$query = "UPDATE `group_department` SET `department_id` = '{$departmentID}' 
							WHERE `group_id` = {$groupID}";
					$result = mysqli_query($conn, $query);
					$response["isSucceeded"] =  $result;
				}
			}
			header ('Content-Type: application/json');
			echo json_encode($response);

		break;
		case 'edit team':
			$response = array( 
				"isSucceeded" => false
			);
			if (isset($request->team_id) && isset($request->team_name) && isset($request->group_id)){
				$teamID = $request->team_id;
				$teamName = $request->team_name;
				$groupID = $request->group_id;

				if ($teamID && $groupID  && $teamName){
					$query = "UPDATE `teams` SET `name` = '{$teamName}' 
							WHERE `teams`.`id` = {$teamID}";
					$result = mysqli_query($conn, $query);
					if ($result){
						// Update team name succeeded. Update team's group
						$query = "UPDATE `team_group` SET `group_id` = '{$groupID}' 
								WHERE `team_id` = {$teamID}";
						$result = mysqli_query($conn, $query);
					}
					$response["isSucceeded"] =  $result;
				}
			}
			header ('Content-Type: application/json');
			echo json_encode($response);

		break;
		case 'edit employee':
			$response = array( 
				"isSucceeded" => false
			);
			if (isset($request->employee_id)&&isset($request->firstName) && isset($request->lastName) && isset($request->phone)
			&& isset($request->email) && isset($request->company_id) && isset($request->team_id)){
				$employeeID=$request->employee_id;
				$firstName = $request->firstName;
				$lastName = $request->lastName;
				$phone = $request->phone;
				$email = $request->email;
				$address = $request->address;
				$companyID = $request->company_id;
				$teamID = $request->team_id;



				if ($employeeID && $firstName  && $lastName && $phone && $email && $companyID && $companyID && $teamID){
					$firstName = $conn->real_escape_string($firstName);
					$lastName = $conn->real_escape_string($lastName);
					$phone = $conn->real_escape_string($phone);
					$email = $conn->real_escape_string($email);
					$query ="UPDATE `employees`
								SET `first_name`='{$firstName}',`last_name`='{$lastName}',`phone`=$phone,
								`email`='{$email}', `address`='{$address}'
								WHERE `employees`.`id` = {$employeeID}";
					$result = mysqli_query($conn, $query);
					$get_id = $conn->insert_id;
					$query ="UPDATE `employee_team` SET `team_id`= {$teamID}
								WHERE employee_team.employee_id={$employeeID}";
					$result = mysqli_query($conn, $query);
					$response["isSucceeded"] =  $result;
				}
			}

			header ('Content-Type: application/json');
			echo json_encode($response);

		break;
		case 'edit building':
			$response = array( 
				"isSucceeded" => false
			);
			if (isset($request->building_id) && isset($request->building_name) && isset($request->company_id)
					&& isset($request->building_city) && isset($request->building_address)
					&& isset($request->building_zip))
			{
				$buildingID = $request->building_id;
				$companyID = $request->company_id;
				$buildingName = $request->building_name;
				$buildingCity = $request->building_city;
				$buildingAddress = $request->building_address;
				$buildingZip = $request->building_zip;


				if ($buildingID  && $buildingName && $buildingCity &&$buildingAddress && $buildingZip && $companyID){
					$query = "UPDATE `buildings` SET `name` = '{$buildingName}', 
							`city` = '{$buildingCity}', 
							`address` = '{$buildingAddress}', 
							`zip` = '{$buildingZip}'
							WHERE `buildings`.`id` = {$buildingID}";//, `company_id` = '{$companyID}' 
					$result = mysqli_query($conn, $query);
					$response["isSucceeded"] =  $result;
				}
			}
			header ('Content-Type: application/json');
			echo json_encode($response);

		break;
		case 'edit floor':
			$response = array( 
				"isSucceeded" => false
			);
			if (isset($request->floor_id) && isset($request->floor_name) )
			{
				$floorID = $request->floor_id;
				//$companyID = $request->company_id;
				$floorName = $request->floor_name;
				
				if ($floorID  && $floorName ){
					$query = "UPDATE `floors` SET `name` = '{$floorName}' 
							WHERE `floors`.`id` = {$floorID}";//, `company_id` = '{$companyID}' 
					$result = mysqli_query($conn, $query);
					$response["isSucceeded"] =  $result;
				}
			}
			header ('Content-Type: application/json');
			echo json_encode($response);

		break;
		case 'delete department':
			$response = array( 
				"isSucceeded" => false
			);
			if (isset($request->department_id)){
				$id = $request->department_id;

				if ($id){
					$query = " DELETE FROM `group_department` WHERE `group_department`.`department_id`={$id};";
					$result = mysqli_query($conn, $query);
					if($result){
						$query = "DELETE FROM `employee_departments` WHERE `employee_departments`.`department_id`={$id};";
						$result = mysqli_query($conn, $query);
					}
					if($result){
						$query = "DELETE FROM `departments` WHERE `departments`.`id`={$id};";
						$result = mysqli_query($conn, $query);
					}

					$response["isSucceeded"] =  $result;
				}
			}



			header ('Content-Type: application/json');
			echo json_encode($response);

		break;
		case 'delete group':
			$response = array( 
				"isSucceeded" => false
			);
			if (isset($request->group_id)){
				$id = $request->group_id;

				if ($id){
					$query = " DELETE FROM `group_department` WHERE `group_department`.`group_id`={$id};";
					$result = mysqli_query($conn, $query);
					if($result){
						$query = "DELETE FROM `team_group` WHERE `group_id`={$id};";
						$result = mysqli_query($conn, $query);
					}
					if($result){
						$query = "DELETE FROM `groups` WHERE `groups`.`id`={$id};";
						$result = mysqli_query($conn, $query);
					}

					$response["isSucceeded"] =  $result;
				}
			}
			header ('Content-Type: application/json');
			echo json_encode($response);

		break;
		case 'delete team':
			$response = array( 
				"isSucceeded" => false
			);
			if (isset($request->team_id)){
				$id = $request->team_id;

				if ($id){
					$query = " DELETE FROM `team_group` WHERE `team_group`.`team_id`={$id};";
					$result = mysqli_query($conn, $query);
					if($result){
						$query = "DELETE FROM `employee_team` WHERE `employee_team`.`team_id`={$id};";
						$result = mysqli_query($conn, $query);
					}
					if($result){
						$query = "DELETE FROM `teams` WHERE `teams`.`id`={$id};";
						$result = mysqli_query($conn, $query);
					}

					$response["isSucceeded"] =  $result;
				}
			}
			header ('Content-Type: application/json');
			echo json_encode($response);

		break;
		case 'delete employee':
			$response = array( 
				"isSucceeded" => false
			);
			if (isset($request->employee_id)){
				$id = $request->employee_id;

				if ($id){
					$query = " DELETE FROM `employee_departments` WHERE `employee_departments`.`employee_id`={$id};";
					$result = mysqli_query($conn, $query);
					if($result){
						$query = "DELETE FROM `employee_team` WHERE `employee_team`.`employee_id`={$id};";
						$result = mysqli_query($conn, $query);
					}
					if($result){
						$query = "DELETE FROM `employees` WHERE `employees`.`id`={$id};";
						$result = mysqli_query($conn, $query);
					}

					$response["isSucceeded"] =  $result;
				}
			}
			header ('Content-Type: application/json');
			echo json_encode($response);

		break;
		case 'delete building':
			$response = array( 
				"isSucceeded" => false
			);
			if (isset($request->building_id)){
				$id = $request->building_id;
				if ($id){
					// delete all floors ref to building id
					$query = "SELECT id FROM `floors` WHERE `floors`.`building_id`={$id}; ";
					if ($query){
						$query_floor = $conn->query($query);
						if ($query_floor){
							while($row = $query_floor->fetch_assoc()){
								$floor_id_for_delete =  $row["id"];
								if ($floor_id_for_delete) {
									$query = " DELETE FROM `rooms` WHERE `rooms`.`floor_id`={$floor_id_for_delete};";
									$result = mysqli_query($conn, $query);
								}
								if($result){
									$query = " DELETE FROM `points` WHERE `points`.`floor_id`={$floor_id_for_delete};";
									$result = mysqli_query($conn, $query);
								
								}
							}
						}

					}
					else {
 					   // echo "0 results";
					}
					// delete building
					if($result){
						$query = "DELETE FROM `floors` WHERE `floors`.`building_id`={$id}; ";
						$result = mysqli_query($conn, $query);
					}
					if($result){
						$query = "DELETE FROM `buildings` WHERE `id`={$id};";
						$result = mysqli_query($conn, $query);
					} 
					$response["isSucceeded"] =  $result;
				}
			}
			header ('Content-Type: application/json');
			echo json_encode($response);

		break;
		case 'delete floor':
			$response = array( 
				"isSucceeded" => false
			);
			if (isset($request->floor_id)){
				$id = $request->floor_id;

				if ($id){
					$query = " DELETE FROM `points` WHERE `floor_id`={$id};";
					$result = mysqli_query($conn, $query);
					if($result){
						$query = " DELETE FROM `rooms` WHERE `rooms`.`floor_id`={$id};";
						$result = mysqli_query($conn, $query);
					}
					if($result){
						$query = "DELETE FROM `points` WHERE `points`.`floor_id`={$id};";
						$result = mysqli_query($conn, $query);
					}
					if($result){
						$query = "DELETE FROM `floors` WHERE `floors`.`id`={$id};";
						$result = mysqli_query($conn, $query);
					}

					$response["isSucceeded"] =  $result;
				}
			}
			header ('Content-Type: application/json');
			echo json_encode($response);

		break;
		// case 'read from floor':
		// 	$id_floor = $_POST['floor'];
		// 	$q = $conn->query("SELECT * FROM points WHERE id_floor=$id_floor");
		// 	resultToClient($q);
		// break;
		default: echo json_encode('default'); break;
	}
}

/*
if(isset($_POST["empl_id"])) {
      $query = "SELECT * FROM employees WHERE id = '".$_POST["empl_id"]."'";
      $result = mysqli_query($conn, $query);
      $row = mysqli_fetch_array($result);
      header('Content-Type: application/json');
      echo json_encode($row);
      // die();
}
*/




function resultToClient($query) {
	$mas = array();
	while($row = $query->fetch_assoc()){
	       $mas[] = $row;
	}
	header ('Content-Type: application/json');
	echo json_encode($mas);
 }