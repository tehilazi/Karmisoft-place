<?php
// session_start(); 
include('models/login.php');
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-widthinitial-scale=1, shrink-to-fit=no">
	<link href="img/favicon.ico" rel="icon" type="image/x-icon" />
	<title>Map</title>

	<link rel="stylesheet" href="lib/css/bootstrap.min.css" />
	<link rel="stylesheet" href="css/login.css" />

	<script src="lib/jquery-3.2.1.min.js"></script>
	<script src="lib//js/bootstrap.min.js"></script>
</head>
<body>
	<h1>The Floor Plan</h1>
	<div id="form_login">
		<form action="" method="POST">
			<div class="form-group">
				<label for="username">Username:</label>
				<input type="text" class="form-control" name="username" id="username" />
			</div>
			<div class="form-group">
				<label for="password">Password:</label>
				<input type="password" class="form-control" name="password" id="password" />
			</div>
			<input type="submit" class="btn btn-default" name="login" value="Login" />
			<div class="error">
				<?php echo $error; ?> 
			</div>
		</form>
	</div>
	<!--============================= footer ===========================
================================================================ -->
		<footer>
			<span>&copy; <?php echo date("Y"); ?><a href="https://sapwin.agirusbook.com/">&nbsp;&nbsp;&nbsp;SapWin&nbsp;&nbsp;&nbsp; </a>All Rights Reserved.</span>
		</footer>
	<script>
		// function validateForm() {
		// 	var x = document.forms["login"]["username"].value;
		// 	if (x == null || x == "") {
		// 		alert("Username is empty");
		// 		return false;
		// 	}
		// 	var x = document.forms["login"]["password"].value;
		// 	if (x == null || x == "") {
		// 		alert("Password is empty");
		// 		return false;
		// 	}
		// }
	</script>
	
</body>
</html>
