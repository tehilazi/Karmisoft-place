function validationForm() {
	var message = document.getElementsByClassName('validationMessage'),
    	id = document.getElementById("id").value,
    	f_name = document.getElementById("f_name"),
    	l_name = document.getElementById("l_name"),
    	phone = document.getElementById("phone");
    if (id != Number || id == "") {
    	message[0].innerHTML = "Please enter ID";
    	    	// return false;
    // } else if (id != NaN) {
    // 	message[0].innerHTML = "Please enter kjkj ID";
    // 	// return false;
    }
    if (f_name == "") {
    	message[1].innerHTML = "Please enter First Name";
    	return false;
    }
    if (l_name == "") {
    	message[2].innerHTML = "Please enter Last Name";
    }

    if (phone == "") {
    	message[3].innerHTML = "Please enter Phone";
    }

}





 //    if (!id.checkValidity()) {
 //        message[0].innerHTML = id.validationMessage;
	// }
	// if (!f_name.checkValidity()) {
 //        message[1].innerHTML = id.validationMessage;
	// } if (!l_name.checkValidity()) {
 //        message[2].innerHTML = id.validationMessage;
	// }
