<?php

include_once("sql.php");

function Employees_getAll() {

    $conn = connect();

	$sql = "
        SELECT
        -- empl.emp_img as img,
        empl.id,
        CONCAT(empl.f_name, ' ', empl.l_name) as name,
        empl.email,
        empl.phone,
        -- empl.pc_model,
        empl.park_space,
        comp.comp_name as comp,
        models,
        p.id as location

    FROM `employees` empl
    LEFT JOIN `company` comp
        ON empl.id_company = comp.id
    LEFT JOIN (SELECT employee_id, GROUP_CONCAT(model separator ', ') as models FROM `equipment` GROUP by employee_id) eq on eq.employee_id = empl.id
    LEFT JOIN `points` p
        ON p.id_emp = empl.id
    ORDER BY empl.f_name ASC,  empl.l_name ASC
";
    //     SELECT
    //         empl.id,
    //         CONCAT(empl.f_name, ' ', empl.l_name) as name,
    //         empl.email,
    //         empl.phone,
    //         empl.pc_model,
    //         comp.comp_name as comp,
    //         models,
    //         p.id as location

    //     FROM `employees` empl
    //     LEFT JOIN `company` comp
    //         ON empl.id_company = comp.id
    //     LEFT JOIN (SELECT employee_id, GROUP_CONCAT(model separator ', ') as models FROM `equipment` GROUP by employee_id) eq on eq.employee_id = empl.id
    //     LEFT JOIN `points` p
    //         ON p.id_emp = empl.id
    // ";
    $result = $conn->query($sql);
        $ret = [];

        if ($result->num_rows > 0) {
            // output data of each row
            while($row = $result->fetch_assoc()) {
                $ret[] = $row;
            }
            return $ret;
        } else echo "0 results";
}
