<?php

$search = filter_var(strtolower($_GET['name']), FILTER_SANITIZE_STRING);

include_once("sql.php");
$conn = connect();
/*
$sql = "SELECT
		empl.id as employee,
		CONCAT(empl.f_name, ' ', empl.l_name) as name,
		empl.email,
		empl.phone,
		empl.park_space,
		comp.comp_name as comp,
		eq.models as models,
		p.id as location,
		depart.dep_name as depart,
		team.team_name as team
	FROM `employees` empl
	LEFT JOIN `company` comp ON empl.id_company = comp.id
	LEFT JOIN `departments` depart ON empl.id_department = depart.id
	LEFT JOIN `team_group` team ON empl.id_team = team.id
	LEFT JOIN (SELECT employee_id, GROUP_CONCAT(model separator ', ') as models FROM `equipment` GROUP by employee_id) eq on eq.employee_id = empl.id
	LEFT JOIN `points` p
            ON p.id_emp = empl.id

 where
	lower(empl.id) like '%{$search}%' or
	lower(empl.f_name) like '%{$search}%' or
	lower(empl.l_name) like '%{$search}%' or
	lower(empl.park_space) like '%{$search}%' or
	lower(eq.models) like '%{$search}%' or
	lower(empl.phone) like '%{$search}%' or
	lower(comp.comp_name) like '%{$search}%' or
	lower(p.id) like '%{$search}%' or
	lower(depart.dep_name) like '%{$search}%' or
	lower(team.team_name) like '%{$search}%'
	ORDER BY name ASC

	";
*/
$sql = "
    SELECT 
		`id` as 'employee', 
		CONCAT(`first_name`, ' ', `last_name`) as 'name',
		`phone`,
		`email`, 
		`address`, 
		`image`, 
		'' as 'park_space',
		dep_emp.deps as 'depart',
		'' as 'team',
		'' as 'comp',
		'' as 'models',
		emp_locations.points as points,
		emp_locations.locations as 'location'
    FROM `employees`
    inner JOIN
    ( SELECT employee_id, GROUP_CONCAT(name SEPARATOR ' / ') as 'deps' FROM departments inner join employee_departments on departments.id = employee_departments.department_id GROUP BY employee_id) as dep_emp
    on dep_emp.employee_id = employees.id
    left join
    (SELECT `employee_id`,GROUP_CONCAT(`id` SEPARATOR ',') as points, GROUP_CONCAT(location SEPARATOR ' / ') as locations FROM `point_details` GROUP BY `employee_id`) as emp_locations
	on emp_locations.employee_id = employees.id
	
	where
	lower(employees.id) like '%{$search}%' or
	lower(employees.first_name) like '%{$search}%' or
	lower(employees.last_name) like '%{$search}%' or
	lower(employees.phone) like '%{$search}%' or
	lower(emp_locations.locations) like '%{$search}%' or
	lower(dep_emp.deps) like '%{$search}%'
	ORDER BY name ASC

";

$result = $conn->query($sql);
$ret = [];

while($row = $result->fetch_assoc()) {
    $ret[] = $row;
}

header('Content-Type: application/json');
echo count($ret) ? json_encode($ret) : '[]';