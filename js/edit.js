var btnAddNewPerson = doc.querySelector('#js-clear-values'),
	btnSubmitInfo   = doc.querySelector('#personInf'),
	btnReset        = doc.querySelector('#js-btn-reset'),
	formDataPerson  = doc.querySelector('#person_form'),
	//checkbox_models = doc.querySelector('#checkbox_models'),
	//decorCircle     = {fillColor: '#ff0', color: "#5E8C29", strokeWidth: "3"}
	defaultCircle     = {fillColor: '#5E8C29', color: "#5E8C29", strokeWidth: "3"},
	decorCircle     = {fillColor: '#ff0', color: "#0af", strokeWidth: "3"},
	prewCircle;

function initEmployeeForm(){
	$("#id_company").prop('disabled', false);
	if (selectedCompany){
		$("#id_company").val(selectedCompany);
		updateCompanyAndDepartments(selectedCompany,[],false)
	} else{
		updateFormDepartments([]);
	}
}

function updateFormDepartments(departments){
	var $el = $("#departments");
	$el.empty(); // remove old options
	if (departments){
		for (var i=0; i<departments.length; i++){
			if (departments[i] && departments[i].id && departments[i].name){
				var value = departments[i].id;
				var text = departments[i].name;
				$el.append($("<option></option>")
				.attr("value", value).text(text));
			}
		}
	}
	$('#departments').multipleSelect('refresh');
}

function updateFormCompanies(companies){
	var $el = $("#id_company");
	$el.empty(); // remove old options
	$el.append($("<option></option>")
	.attr("value", "").text("Select company"))
	if (companies){
		for (var i=0; i<companies.length; i++){
			if (companies[i] && companies[i].id && companies[i].name){
				var value = companies[i].id;
				var text = companies[i].name;
				$el.append($("<option></option>")
				.attr("value", value).text(text));
			}
		}
	}
}

function updateCompanyAndDepartments(companyID,employeeDepartments,disableCompany){
	if(companyID) {
		objToServer['controller'] = 'read departments';
		objToServer['company_id'] = companyID;
		// alert (depID);
		$.ajax({
			type: 'POST',
			url: 'models/edit.php',
			data: objToServer,
			success: function(data){
				updateFormDepartments(data);
				$('#departments').multipleSelect('setSelects', employeeDepartments);
				$("#id_company").val(companyID);
				$("#id_company").prop('disabled', disableCompany);
			}
		});
	} else {
		updateFormDepartments([]); // Empty the departments select box
	}
}

		


/*
resetImg.onclick = function() {
	var img = doc.querySelector('label[for=emp_img]');
	if(img) {
		img.removeAttribute('style');
		img.innerHTML = 'none image';
	}
};

checkbox_models.onclick = function() {
	var display = doc.querySelector('.checkbox_pc_block').style.display,
		p = doc.querySelector('.p_checkbox').innerHTML = "click to close";
	if(display == 'none') {
		doc.querySelector('.checkbox_pc_block').style.display = "block";
	} else if (display == 'block') {
		doc.querySelector('.checkbox_pc_block').style.display = "none";
		doc.querySelector('.p_checkbox').innerHTML = "click to open";
	} else
	doc.querySelector('.checkbox_pc_block').style.display = "block";
};
*/
function updateContentSelect(isAddPerson, curPerson) {
	// update content checkbox
	var tParkSpace = doc.getElementById(fields[6]),
			tModels 	 = doc.getElementById(fields[7]),
			wrDP 		 = $('#departments'),
			wrTM 		 = doc.querySelector('#team'),
			wrPS 		 = doc.querySelector('#park_space'),
			freeModels = [], nullSpaces = [];

	function createModels(arr, isChoose) {
		for (var i = 0; i < arr.length; i++) {
			var modelsDiv 		= doc.createElement('div'),
				modelsLabel		= doc.createElement('label'),
				modelsCheckbox 	= doc.createElement('input');

			modelsDiv.className = 'form-check';
			modelsCheckbox.setAttribute('type', 'checkbox');
			modelsCheckbox.setAttribute('name', 'pc_model');
			modelsCheckbox.setAttribute('value', objFromMas(masPcModels, 'model', arr[i])['id']);
			if(isChoose) { modelsCheckbox.setAttribute('checked', 'checked'); }

			modelsLabel.appendChild(modelsCheckbox);
			modelsLabel.innerHTML += arr[i];
			modelsDiv.appendChild(modelsLabel);
			tModels.appendChild(modelsDiv);
		}
	}
	/*
	function createSpace(park_space, isChoose) {
		var	parkOption	 	= doc.createElement('option');
		if(park_space !== 'Select park space') {
			parkOption.setAttribute('value', park_space);
		} else { parkOption.setAttribute('value', ''); }

		parkOption.innerHTML = park_space;
		tParkSpace.appendChild(parkOption);
		tParkSpace.value = isChoose ? park_space : '';
		//console.log(tParkSpace);
	}
	*/
	// clear	
	// Doron set in comment
	/*
	if(wrPS) { wrPS.innerHTML = ''; }

	for (var i = masPcModels.length - 1; i > -1; i--) {
		if(!masPcModels[i]['employee_id']) {
			freeModels.push(masPcModels[i]['model']);
		}
	}
	createSpace('Select park space');
	for (var i = masIdFreeParkSpaces.length - 1; i > -1; i--) {
		createSpace(masIdFreeParkSpaces[i]);
	}

	createModels(freeModels);



	// write
	if(!isAddPerson) {
		if(curPerson['park_space']) { createSpace(curPerson['park_space'], true); }
		if(curPerson['models']) { createModels(curPerson['models'].split(', '), true); }
		if(wrDP && curPerson['depart']) {
			var tmpVal = objFromMas(masDepartments, 'dep_name', curPerson['depart'])['id'];
			wrDP.val(tmpVal);
			// wrDP.value = tmpVal;
			//123
			//console.log(wrDP);
			$('#departments option[value='+ tmpVal +']').change();
			wrDP.val(tmpVal);
		}
		// сделать через Promice
		setTimeout(function() {
			if(wrTM && curPerson['team']) {
				wrTM.value = objFromMas(masTeams, 'team_name', curPerson['team'])['id'];
			}
		}, 100);
	}*/
}


btnAddNewPerson.onclick = function() {
	// fields defined in variables.js
	fields.forEach(function (field) {
		$('#'+field).val('');
		$('#checkbox_models--content').empty();
	});
	// console.log(fields);
	updateContentSelect(true);
	btnSubmitInfo.value = 'Add';

	$(formDataPerson).show();
	$('#js-formDataPersonToServer .table.table-hover').hide();
};

function showTabEditDataPerson(idClickPerson, isAddPerson) {
	$('.personInfo-tab').click();
	var curPerson = getPerson(masPerson, idClickPerson),
		fullName  = curPerson['name'].split(' ');

	var points = [];
	if (curPerson['points']){
		points = curPerson['points'].split(',');
	}
	var companyID = curPerson['company_id'];
	var departmentIDS = [];
	if (curPerson['deps_ids']){
		departmentIDS = curPerson['deps_ids'].split(',');
	}
	updateCompanyAndDepartments(companyID,departmentIDS,true);
	setStyleChooseCircle(points);
	fields.forEach(function (field) {
		$('#'+field).val('');
		$('#checkbox_models--content').empty();
	});
	btnSubmitInfo.value = 'Edit';

	//console.log('curPerson:');
	//console.log(curPerson);
	//console.log('--');
	updateContentSelect(isAddPerson, curPerson);


	idCurPersonEdit = idClickPerson;
	var tempFields = [
		idClickPerson,
		fullName[0],
		fullName[1],
		curPerson['email'],
		curPerson['phone'],

		curPerson['comp'],
		// curPerson['park_space'],	// special
		// curPerson['models'],	// special
		// curPerson['location'],
		//curPerson['department'],
		// curPerson['team'],
		// curPerson['emp_img']	// special
	];
	// console.log(tempFields);
	var prevImg = doc.querySelector('label[for=emp_img]');
	if(prevImg) {
		prevImg.setAttribute('style', 'background-image: url("img/persons/' + curPerson['emp_img'] + '");');
		prevImg.innerHTML = '';
	}
	fields.forEach(function (field, i) {
		//console.log('field[' + i + '] = ' + field);
		if(i > 4) {
			if(i === 5) {
				//console.log(masCompanies)
				$('#'+field).val(objFromMas(masCompanies, 'comp_name', tempFields[i])['id']);
			} else if(i === 8) {
				$('#'+field).val(tempFields[i]);
			}
		} else {
			$('#'+field).val(tempFields[i]);
		}
	});
	
}
function setStyleChooseCircle(points) {
	resetStylePrewCircle(decorCircle);

	if(!points || points.length ===0) { return false; }
	var result=false;
	for (var i=0; i<points.length;i++){
		var pointID = points[i];
		var svgCircle = doc.getElementById('blockMap').querySelector('.place-' + pointID);
		if(svgCircle) {
			svgCircle.setAttribute('stroke', '#FF00FF');
			svgCircle.setAttribute('fill', '#000000');
			svgCircle.setAttribute('stroke-width', '15');
			prewCircle = svgCircle;
			result=true;
		}
	}
	
	// console.log(svgCircle);

	return result;
}
function resetStylePrewCircle(decorCircle) {
	if(prewCircle) {
		prewCircle.setAttribute('fill', decorCircle.fillColor);
		prewCircle.setAttribute('stroke', decorCircle.color);
		prewCircle.setAttribute('stroke-width', decorCircle.strokeWidth);
		return true;
	}
	return false;
}

$(doc).on('click', '.editdelete', function () {
    var idClickPerson = this.parentNode.getAttribute('data-id');
    for (var i = masPerson.length - 1; i > -1; i--) {
        if(masPerson[i]['employee'] == idClickPerson) {
            showTabEditDataPerson(idClickPerson, false);
            break;
        }
    }
// $('.editdelete').on('click', function () {
// 	var idClickPerson = this.parentNode.getAttribute('data-id');
// 	for (var i = masPerson.length - 1; i > -1; i--) {
// 		if(masPerson[i]['employee'] == idClickPerson) {
// 			showTabEditDataPerson(idClickPerson);
// 			break;
// 		}
// 	}

});

// formDataPerson.onsubmit = function(e) {
// e.preventDefault();
// };
btnSubmitInfo.onclick = function(e) {
	var objToServer = {};
	fields.forEach(function (field) {
		if (field === "departments"){
			objToServer[field] = $('#departments').multipleSelect('getSelects')
		} else {
			objToServer[field] = $('#'+field).val();
		}
	});

	var models = doc.querySelectorAll('#checkbox_models--content input');
	var modelsZ = Array.from(models)
		.filter(input => input.checked)
		.map(input => input.value);

	objToServer['models'] = modelsZ.join();

	switch (btnSubmitInfo.value) {
		case 'Add':
			objToServer['controller'] = 'add person';
		break;
		case 'Edit':
			objToServer['controller'] = 'edit person';
		break;
 	}
	//console.log(objToServer);

	$.ajax({
		url: 'models/edit.php',
		method: "POST",
		// processData: false,
		// contentType : false,
		// headers: {
		// 	'Content-Type': "multipart/form-data",
		// },

		data: objToServer,
		// data: createFromDataObject(objToServer),
		dataType: 'json',
		success: function(resp){
			if (!resp || !resp.errors){
				// General error
				alert("Failed to add the employee. Please try again.")
			} else if (resp.isSucceeded===false && resp.errors && resp.errors.length>0){
				// Error from server
				alert("Failed to add the employee. "+resp.errors[0]);
			}
			else {
				// Insert succeeded
				updateListPeople();
				$('.persons-tab').click();
			}
		},
		error: function(jqXHR,textStatus,errorThrown){
			debugger;
			console.log("jqXHR = "+jqXHR);
			console.log("textStatus = "+textStatus);
			console.log("errorThrown = "+errorThrown);
			alert("Failed to add the employee. Please try again.");
		}
	});
	return false;
};
function createObjPerson() {
	var objToServer = [];
	fields.forEach(function (field) {
		objToServer[field] = $('#'+field).val('');
	})
	objToServer['controller'] = 'add person';

	return objToServer;
}
function createFromDataObject(obj) {
	var data = new FormData();
	Object.keys(obj).forEach(key => {
		data.append(key, obj[key]);
	})
	//console.log(data);
	return data;
}
function selectOptionFromValue(select) {
	var options = select.querySelectorAll('option');

	return Array.from(options)
		.find(function (option) {
				return option.value === select.value;
		}).textContent;
}
function showElement(selector, isShow, displayMode) {
	// console.log(elem);
	var elem = doc.querySelectorAll(selector);
	if(elem.length === 0) { return false; }
	if(elem.length > 1) {
		for (var i = elem.length - 1; i > -1; i--) {
			if(isShow) {
				displayMode = displayMode ? displayMode : 'block';
				elem[i].setAttribute('style', 'display: ' + displayMode);
			} else {
				elem[i].setAttribute('style', 'display: none');
			}
		}
	} else {
		if(isShow) {
			displayMode = displayMode ? displayMode : 'block';
			elem[0].setAttribute('style', 'display: ' + displayMode);
		} else {
			elem[0].setAttribute('style', 'display: none');
		}
	}
	return true;
}

function updateListPeople() {
	var personsPromise = $.get('models/persons.php?company_id='+selectedCompany);

	Promise.all([personsPromise])
	.then(function (data) {
		persons = data[0];
		masPerson = persons;
		showListPeople('#redips-drag', persons, true);
	});
	// objToServer['controller'] = 'read persons';
	// ajax(xhr, "POST", 'models/edit.php', objToServer, function(resp){
	//     persons = JSON.parse(resp);
	//     console.log('persons');
	//     console.log(persons);
	//     showListPeople('#redips-drag', persons, true);
	// });
}

if(btnReset) {
	btnReset.onclick = function() {
		$('.persons-tab').click();
		resetStylePrewCircle(decorCircle);
	};
}
$(document).ready(function() {
	$('.personInfo-tab').click(function(){
		initEmployeeForm();
	})
});