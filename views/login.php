<?php
// include('../models/login.php'); // Includes Login Script

// if(isset($_SESSION['username'])){
// header("location: ../index.php");
// }
?>
<?php include '../inc/header.php';?>

<body>
	<div id="form_login">
		<form action="" method="POST">
		<!-- <form action="../models/login.php" method="POST"> -->
			<div class="form-group">
				<label for="username">Username:</label>
				<input type="text" class="form-control" name="username" id="username" />
			</div>
			<div class="form-group">
				<label for="password">Password:</label>
				<input type="password" class="form-control" name="password" id="password" />
			</div>
			<input type="submit" class="btn btn-default value="login" />
			<span>
				<!-- <?php echo $error; ?> -->
			</span>

		</form>
	</div>
	
</body>
</html>
