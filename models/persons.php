<?php
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");

$persons = [];

if (isset($_GET['company_id']) && $_GET['company_id']!=null){
    $companyID = $_GET['company_id'];

    include_once("sql.php");
    $conn = connect();
    
    
    $sql = "
    SELECT 
    employees.`id`, 
    `first_name` as firstName,
    `last_name` as lastName,
    CONCAT(`first_name`, ' ', `last_name`) as 'name',
    `phone`,
    `email`, 
    `address`, 
    `image`, 
    '' as 'park_space',
    dep_emp.deps as 'departments',
    dep_emp.deps_ids as 'deps_ids',
    `company_id`, 
    '' as 'team',
    '' as 'comp',
    '' as 'models',
    emp_locations.points as points,
    emp_locations.locations as 'locations',
    employee_team.team_id,
    teams.name as 'team_name'
    FROM `employees`
    inner JOIN
    ( SELECT employee_id, GROUP_CONCAT(departments.id SEPARATOR ',') as 'deps_ids', GROUP_CONCAT(name SEPARATOR ' / ') as 'deps' FROM departments inner join employee_departments on departments.id = employee_departments.department_id GROUP BY employee_id) as dep_emp
    on dep_emp.employee_id = employees.id
    left join
    (SELECT `employee_id`,GROUP_CONCAT(`id` SEPARATOR ',') as points, GROUP_CONCAT(location SEPARATOR ' / ') as locations FROM `point_details` GROUP BY `employee_id`) as emp_locations
    on emp_locations.employee_id = employees.id
    left JOIN 
     employee_team on employees.id=employee_team.employee_id
     LEFT JOIN teams on teams.id=employee_team.team_id
    WHERE company_id={$companyID}
    ";
    
    $result = $conn->query($sql);
    $persons = [];
    
    if ($result && $result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            $persons[] = $row;
        }
    } 
}


header ('Content-Type: application/json');

echo json_encode($persons);