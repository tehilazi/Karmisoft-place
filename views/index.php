<?php
	session_start();
	// echo "Welcome " .$_SESSION['username'];
	if(!isset($_SESSION['username'])) {
		header('Location: login.php');
	} else {
		//header('Location: index.html');
		//include("views/SPA/index.html");
		include("index.html");
	}

