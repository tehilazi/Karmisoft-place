function building(id, title) {
	var wrap= doc.createElement('li'),
		a   = doc.createElement('a');
	wrap.setAttribute('data-build-id', id);
	a.setAttribute('href', '#');
	a.innerHTML = title;
	wrap.appendChild(a);
	return wrap;
}

function floor(floor, isAdd) {
	var wrap= doc.createElement('li'),
		span= doc.createElement('span'),
		a   = doc.createElement('a');
	wrap.setAttribute('image', floor.image);
	wrap.setAttribute('data-id-floor', floor.id);
	a.setAttribute('href', '#');
	a.innerHTML = floor.name;
	wrap.appendChild(a);
	if(!isAdd) {
		span.className = 'glyphicon glyphicon-pencil editFloor';
		wrap.appendChild(span);
		return wrap;
	} else {
		wrap.setAttribute('add', 'add new');
		return wrap;
	}
}

function eventForNewFloor(btn) {

	if(btn) {
		btn.onclick = function() {
			$("#floorBuildingID").val(selectedBuilding);
			$('#modal2').modal('show');
		};
	} else {
		doc.querySelector('#addNewFloor').onclick = function() {
			$("#floorBuildingID").val(selectedBuilding);
			$('#modal2').modal('show');
		};
	}
}

function floorsUpdate(floors) {
	var wrapFloors = doc.getElementById('menu-of-floors');
	wrapFloors.innerHTML = '';
	for (var i = 0; i< floors.length; i++) {
		var tmpFl = floor(floors[i]);
		wrapFloors.appendChild(tmpFl);
		eventToFloor(tmpFl);
	}
	tmpFl = floor({name: 'Add new floor', id: '-1'}, true);
	wrapFloors.appendChild(tmpFl);
	eventForNewFloor(tmpFl);
}

function eventToFloor(floor) {
	// для карандаша обработка событий - нужно добавить
	floor.onclick = function() {
		showRightSideTab("persons");
		var liChecked = doc.querySelector('.checked_map');
		if(liChecked) liChecked.className = '';
		this.className = 'checked_map';
		floorsMenu.innerHTML = this.querySelector('li a').innerHTML;
		floorsMenu.setAttribute('data-id-floor', floor.getAttribute('data-id-floor'));
		var imageName = this.getAttribute('image');

		selectedFloor = floor.getAttribute('data-id-floor');
		selectedFloorImage = floor.getAttribute('image');
	
		$.get('models/places.php', function(data) {
			places = data;
			places = listPlacesForCurrentFloor(selectedFloor,places);
			resetMap(selectedFloorImage, places);
			// обновить список людей справа - но пока не предпринимаем ничего
		});
		// Doron add
		$.get('models/rooms.php?floorID='+selectedFloor.toString(), function(data) {
			rooms = data;
		});
	}
}




function updateBuildingFloors(buildingID){
	objToServer['controller'] = 'read floors';
	objToServer['building_id'] = buildingID;
	$.post('models/edit.php', objToServer, function(resp) {
		floorsUpdate(resp);
		$("#floorsDropdown").removeClass("disabled");
	});
}

function eventToBuilding(building) {
	building.unbind('click');
	building.click(function() {
		hideMap();
		showRightSideTab("company");
		$('#menu-of-buildings li').removeClass("activated");
		$(this).addClass("activated");
		selectedBuilding = $(this).data("buildId");

		buildingsMenu.setAttribute('data-build-id', selectedBuilding);
		buildingsMenu.innerHTML = this.querySelector('a').innerHTML;
		floorsMenu.innerHTML = 'Floors';

		updateBuildingFloors(selectedBuilding);
	});
}

function eventForNewBuilding(building) {
	//building.unbind('click');
	building.click(function() {
		$('#modal-add-building').modal('show');
	});
}





// Initialize active floor
$( document ).ready(function() {
    $('ul#menu-of-floors li').removeClass("checked_map");
	$('ul#menu-of-floors li:first').addClass("checked_map");
	selectedFloor = $("#menu-of-floors .checked_map").data("floorId");

	if (buildings && buildings.length >0){
		// for buildings floors update
		for (var i = buildings.length - 2; i > -1; i--) {
			eventToBuilding($(buildings[i]));
		}
		var addNewBuildingEl = $(buildings[buildings.length-1])
		eventForNewBuilding(addNewBuildingEl); // Event fot add a new building
	}


});

// button add new buiding
doc.querySelector('#modal-add-building form').onsubmit = function(e) {
	e.preventDefault();
};
/*
doc.querySelector('#menu-of-buildings li[id]').onclick = function() {
	eventForNewBuilding(this);
	//$('#modal-add-building').modal('show');
};*/
doc.querySelector('#modal-add-building button[value=Add]').onclick = function() {
	var wrap = doc.getElementById('modal-add-building');

	objToServer['controller'] = 'add building';
	objToServer['name'] = wrap.querySelector('#buildingName').value;
	objToServer['company_id'] = selectedCompany;
	objToServer['city'] = wrap.querySelector('#buildingCity').value;
	objToServer['address'] = wrap.querySelector('#buildingAddress').value;
	objToServer['zip'] = wrap.querySelector('#buildingZip').value;
	if(objToServer['name'] === '') {
		alert('Please enter building name.');
	} else {
		$.post('models/edit.php', objToServer, function(resp) {
			// console.log(resp);
			if(resp !== 'undefined') {
				// alert('Добавлено новое здание.');
				var wrapLiBuildings = doc.querySelector('#menu-of-buildings'),
					newBuilding = building(resp, objToServer['name']);
				wrapLiBuildings.insertBefore(newBuilding, wrapLiBuildings.querySelector('li[id]'));
				newBuilding.onclick = function() {
					objToServer['controller'] = 'read floors';
					objToServer['id_building'] = this.getAttribute('data-build-id');
					buildingsMenu.setAttribute('data-build-id', objToServer['id_building']);
					buildingsMenu.innerHTML = this.querySelector('a').innerHTML;
					floorsMenu.innerHTML = 'Floors';
					$.post('models/edit.php', objToServer, function(resp) {
						// console.log(resp);
						if(resp.indexOf('Error') === -1) {
							floorsUpdate(resp);
						}
					});
				};
				$('#modal-add-building').modal('hide');
				resetPage();
			} else {
				// alert('Ошибка с бд. Здание не добавлено.');
			}
		});
	}
};