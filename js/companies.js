function Company(id, title) {
	var wrap= doc.createElement('li'),
		a   = doc.createElement('a');
	wrap.setAttribute('data-company-id', id);
	a.setAttribute('href', '#');
	a.innerHTML = title;
	wrap.appendChild(a);
	return wrap;
}

function addNewCompany(){
	objToServer["controller"] = "add company";
	objToServer["name"] = $("#companyName").val();
	$.ajax({
		url: 'models/edit.php',
		method: "POST",
		data: objToServer,
		dataType: 'json',
		success: function(resp){
			if (resp && resp.isSucceeded){
				alert("New company added successfully.")
				window.FloorPlan.closeModal();
			} else {
				alert("Insert failed. Please try again or contact the website administrator.");
			}
			if (resp){
				updateCompanies(resp.canAddMore)
			}
		}
	});
}

function addNewDepartment(){
	objToServer["controller"] = "add department";
	objToServer["company_id"] = selectedCompany;
	objToServer["name"] = $("#departmentName").val();
	$.ajax({
		url: 'models/edit.php',
		method: "POST",
		data: objToServer,
		dataType: 'json',
		success: function(resp){
			if (resp && resp.isSucceeded){
				alert("New department added successfully.")
				window.FloorPlan.closeModal();
			} else {
				alert("Insert failed. Please try again or contact the website administrator.");
			}
			if (resp){
				updateCompanyPageContent();
			}
		}
	});
}

function eventForNewCompany() {
	// prepare popup settings
	var container = $("<div></div>");

	// company name field
	var nameField = $("<div></div>").attr("class", "form-group");
	var lable = $("<lable />",{
		'text' : "Company name",
		'for' : "companyName"

	});
	var input = $("<input />",{
		'type' : "text",
		'id' : "companyName",
		'class' : "form-control-file"

	});
	nameField.append(lable).append("<br />").append(input);

	container.append(nameField);
	// open popup
	window.FloorPlan.openModal({
		title:"Add a new company",
		content: container,
		yesBtnText : "Add",
		noBtnText : "Cancel",
		onYesBtnClick: function(){
			addNewCompany();
		}
	});
}


function eventForNewDepartment() {
	// prepare popup settings
	var container = $("<div></div>");

	// company name field
	var nameField = $("<div></div>").attr("class", "form-group");
	var lable = $("<lable />",{
		'text' : "Department name",
		'for' : "departmentName"

	});
	var input = $("<input />",{
		'type' : "text",
		'id' : "departmentName",
		'class' : "form-control-file"

	});
	nameField.append(lable).append("<br />").append(input);

	container.append(nameField);
	// open popup
	window.FloorPlan.openModal({
		title:"Add a new department",
		content: container,
		yesBtnText : "Add",
		noBtnText : "Cancel",
		onYesBtnClick: function(){
			addNewDepartment();
		}
	});
}

function updateCompanyPageContent(){
	if (selectedCompany){
		$(".wrap-company-details .company-name h1").text(selectedCompanyName + " company");
		objToServer['controller'] = 'read departments';
		objToServer['company_id'] = selectedCompany;
		$.post('models/edit.php', objToServer, function(resp){
			if (resp){
				var departments = resp;
				var departmentsList = $(".wrap-company-details .company-departments .departments-list")
				departmentsList.html("");
				if (departments.length === 0){
					$(".wrap-company-details .company-departments .no-data-available").show();
				} else{
					$(".wrap-company-details .company-departments .no-data-available").hide();
					for (var i=0; i<departments.length;i++){
						var departmentItem = $("<li />",{
							'class' : "list-group-item",
							'text' : departments[i].name,
							'data-department-id' : departments[i].id
						});
						departmentsList.append(departmentItem);
					}
				}
	
			}
		})
	}

}

function eventToCompany(company){
	company.click(function(){
		hideMap();
		//showRightSideTab("company");
		selectedCompany = $(this).data("companyId");
		selectedCompanyName =  $(this).text();

		// Update menu
		companiesMenu.setAttribute('data-company-id', selectedCompany);
		companiesMenu.innerHTML = this.querySelector('a').innerHTML;
		buildingsMenu.innerHTML = 'Buildings';
		$("#buildingsDropdown").removeClass("disabled");
		updateCompanyBuildings(selectedCompany);
		floorsMenu.innerHTML = 'Floors';
		$("#floorsDropdown").addClass("disabled");

		// Update company page content
		updateCompanyPageContent();
		updateListPeople();
	});
}

function updateCompanies(addMore){
	objToServer['controller'] = 'read company';
	$.post('models/edit.php', objToServer, function(resp) {
		if (resp){
			var companies = resp;
			masCompanies = companies;
			updateFormCompanies(companies); // Update companies in person form
			var wrapCompanies = doc.getElementById('menu-of-companies');
			wrapCompanies.innerHTML = '';
			for (var i = 0; i< companies.length; i++) {
				var tmpCompany = Company(companies[i].id,companies[i].name);
				eventToCompany($(tmpCompany));
				wrapCompanies.appendChild(tmpCompany);
			}
			if (addMore){
				addCompanyElement = Company(-1,"Add new Company");
				$(addCompanyElement).attr("id","addNewCompany");
				$(addCompanyElement).attr("class","add-menu-item");
				//eventForNewCompany($(tmpCompany));;
				wrapCompanies.appendChild(addCompanyElement);
				$("#addNewCompany").click(function(){
					eventForNewCompany();
				})
			}

		}

	});
}

function updateCompanyBuildings(companyID){
	objToServer['controller'] = 'read buildings';
	objToServer['company_id'] = companyID;
	$.post('models/edit.php', objToServer, function(resp) {
		buildingsUpdate(resp);
	});
}


function buildingsUpdate(buildings) {
	var wrapBuildings = doc.getElementById('menu-of-buildings');
	wrapBuildings.innerHTML = '';
	for (var i = 0; i< buildings.length; i++) {
		var tmpBuild = building(buildings[i].id,buildings[i].name);
		eventToBuilding($(tmpBuild));
		wrapBuildings.appendChild(tmpBuild);
	}
	tmpBuild = building(-1,"Add new building");
	eventForNewBuilding($(tmpBuild));;
	wrapBuildings.appendChild(tmpBuild);
	
}

$( document ).ready(function() {
	if ($('ul#menu-of-companies li:first').data("companyId")){
		selectedCompany =$('ul#menu-of-companies li:first').data("companyId");
	}
	/*
	doc.querySelector('#menu-of-companies li[id]').onclick = function(){
		eventForNewCompany();	
	}*/
	$("#addNewCompany").click(function(){
		eventForNewCompany();
	})

	for (var i = 0; i< companies.length; i++) {
		selectedCompany = $(companies[i]).data("companyId");
		if (selectedCompany>0){
			eventToCompany($(companies[i]));
		}
	}

	/*
	$('#menu-of-companies li a').click(function (e) {
		e.preventDefault();
		//var companyID
		$(this).tab('show')
	  });
*/
	  $("#addDepartmentBtn").click(function(){
		if (selectedCompany){
			eventForNewDepartment();
		} else{
			alert("No company selected.")
		}
	  });
});

