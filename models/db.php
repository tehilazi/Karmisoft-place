<?php
	$db = false;

	function prepareData($str) {
		return htmlspecialchars(trim($str));
	}
	function resultToArray($result) {
		$array = array();
		while($row = $result->fetch()) {
			$array[] = $row;
		}
		return $array;
	}
	function connectDB() {
		global $db;
		$db = connect();
		// $db = new PDO('mysql:host=localhost;dbname=plan_floor', 'root', 'mamram');
		// $db->exec('SET NAMES UTF8');
	}
	function closeDB() {
		global $db;
		$db = Null;
	}
	function read($table_name, $limit, $row, $record) {
		global $db;
		connectDB();
		if($db) {
			switch ($limit) {
				case 'all':
					$query = $db->query("SELECT * FROM ".$table_name);
					break;
				case '':
					$query = $db->prepare("SELECT * FROM $table_name WHERE $row=?");
					$query->execute(array($record));
					break;
				default:
					$query = $db->prepare("SELECT * FROM $table_name WHERE $row=? LIMIT $limit");
					$query->execute(array($record));
					break;
			}
		} else {
			return 'false';
		}
		closeDB();
		return resultToArray($query);
	}
	function write($table_name, $args) {
		global $db;
		connectDB();
		if($db) {
			$str_p = '';
			$str_q = '';
			$arr_v = array();
			foreach ($args as $key => $value) {
				$str_p .= ', ' . $key;
				$str_q .= ', ?';
				array_push($arr_v, $value);
			}
			$query = $db->prepare("INSERT INTO $table_name (id".$str_p.") VALUES (''".$str_q.")");
			$query->execute($arr_v);
			return 'true';
		} else {
			return 'false';
		}
		closeDB();
	}
	function update($table_name, $limit, $row, $record, $args) {
		global $db;
		connectDB();
		if($db) {
			$str_q = '';
			$arr_v = array();
			foreach ($args as $key => $value) {
				$str_q .= $key.'=? ';
				array_push($arr_v, $value);
			}
			if($limit === 'all') {
				$query = $db->prepare("UPDATE $table_name SET $str_q");
				$query->execute($arr_v);
			} else {
				array_push($arr_v, $record);
				if($limit === '') {
					$query = $db->prepare("UPDATE $table_name SET $str_q WHERE $row=?");
					$query->execute($arr_v);
				} else {
					$query = $db->prepare("UPDATE $table_name SET $str_q WHERE $row=? LIMIT $limit");
					$query->execute($arr_v);
				}
			}
			return 'true';
		} else {
			return 'false';
		}
		closeDB();
	}
	function delete($table_name, $limit, $row, $record) {
		global $db;
		connectDB();
		if($db) {
			if($limit == 'all') {
				$query = $db->query("DELETE FROM $table_name");
			} else if($limit != '') {
				$query = $db->query("DELETE FROM $table_name WHERE $row=$record LIMIT $limit");
			}
			return 'true';
		} else {
			return 'false';
		}
		closeDB();
	}
?>