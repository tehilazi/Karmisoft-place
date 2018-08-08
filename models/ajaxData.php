<?php 
/*
include_once("sql.php");
$conn = connect();

if(isset($_POST['depID']) && !empty($_POST['depID'])) {
	$query_team = $conn->query("SELECT * FROM team_group WHERE id_dep = ".$_POST['depID']." ORDER BY team_name ASC");
		$team_data = $query_team->num_rows; 
}

        if($team_data > 0){
        	echo '<option value = "">Select team group</option>';
            while($row = $query_team->fetch_assoc()){ 
                echo '<option value="'.$row['id'].'">'.$row['team_name'].'</option>';

			}
        } else {

			echo '<option value="">not available</option>';

    	}
				        
*/