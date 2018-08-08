document.addEventListener('map-start', function (e) {
	startDrag(document.getElementById('redips-drag'))
});

function startDrag(container) {
	var dataPerson,
		idMovePerson;
	// console.log(document.querySelectorAll('path.leaflet-interactive'))

	Array.from(container.querySelectorAll('.rd')).forEach(function (item) {
		item.addEventListener('dragstart', function (e) {
			// console.log(e.target.dataset.id)
			e.dataTransfer.setData('id_emp', e.target.dataset.id);
			// console.log(e)
			// console.log(e.dataTransfer.getData('id_emp'));
			idMovePerson = e.dataTransfer.getData('id_emp');
		})
		// item.addEventListener('drop', chooseChair)
	})

	function searhPerson(e) {
		var idPerson = e.target.className.baseVal.split(' ')[2];
		if(typeof idPerson !== 'undefined') {
			idPerson = idPerson.substr(3);
			for (var i = masPerson.length - 1; i > -1; i--) {
				if(masPerson[i]['employee'] === idPerson) {
					break;
				}
			}
			return masPerson[i];
		}
		return -1;
	}

	Array.from(document.querySelectorAll('path.leaflet-interactive')).forEach(function (item) {
		item.addEventListener('dragenter', function (e) {
			// e.target.style.stroke = colorRed;
			e.target.style.strokeWidth = 14;
			dataPerson = searhPerson(e);
		})
		item.addEventListener('dragleave', function (e) {
			setPreviousColor(e.target);
		})
		item.addEventListener('dragover', function (e) {
			e.preventDefault();
		})
		item.addEventListener('drop', function(e) {
			chooseChair(e, dataPerson, idMovePerson);
		});
	})
}

function setPreviousColor(circle) {
	circle.style.strokeWidth = circle.classList.contains('occupied') ? 2.5 : 2.5;
}

// Doron Lavkovsky 22/01/2018 - set in comment. using generic open popup function instead
/*
$('#modal button:not([data-dismiss=modal])').click(function (e) {
	setPlace(document.querySelector('path.leaflet-interactive[data-id_emp]'))
});
$('#modal button[data-dismiss=modal]').click(function (e) {
	var circle = document.querySelector('path.leaflet-interactive[data-id_emp]')

	setPreviousColor(circle);
	circle.removeAttribute('data-id_emp');
})
*/
function chooseChair(e, dataPerson, idMovePerson) {
	// Doron Lavkovsky 22/01/2018 - open popup using generic function
	// console.log(dataPerson);
	event.preventDefault();
	var chair = e.target;
	chair.dataset.id_emp = e.dataTransfer.getData('id_emp');

	var occupiedPlaces = findEmplByPlace(e.dataTransfer.getData('id_emp'));
	if (e.target.classList.contains('occupied')) {
		var modalContent = null;
		for (var i2 = masPerson.length - 1; i2 > -1; i2--) { if(masPerson[i2]['employee'] === idMovePerson) break; }
		if(!occupiedPlaces[0]) {
			// console.log('the seat is occupied')
			//setModalText('This seat is already occupied: ' + dataPerson['name'] + '. Do you wish to replace a person on this seat?');
			modalContent = 'This seat is already occupied: ' + dataPerson['name'] + '. Do you wish to replace a person on this seat?';
			var placesId = occupiedPlaces.map(place => place.id)
		} else {
			//setModalText('This seat is already occupied: ' + dataPerson['name'] + '. ' + masPerson[i2]['name'] + ' is occupying ' + occupiedPlaces[0]['id'] + ' place. Do you wish to move this person here?');
			modalContent =  'This seat is already occupied: ' + dataPerson['name'] + '. ' + masPerson[i2]['name'] + ' is occupying ' + occupiedPlaces[0]['id'] + ' place. Do you wish to move this person here?';
			// console.log(occupiedPlaces);
			//console.log(masPerson[i2]['name']);
		}
		//$('#modal').modal('show');
		window.FloorPlan.openModal({
			title:"Attention",
			content: modalContent,
			onYesBtnClick: function(){
				setPlace(document.querySelector('path.leaflet-interactive[data-id_emp]'))
			},
			onNoBtnClick: function(){
				var circle = document.querySelector('path.leaflet-interactive[data-id_emp]')
				setPreviousColor(circle);
				circle.removeAttribute('data-id_emp');
			}
		});
	} else if (occupiedPlaces.length) {
		// console.log('this person is already sitting')
		var modalContent = null;
		var idChair 	  = doc.querySelector('.idP' + idMovePerson),
			currentPerson = objFromMas(masPerson, 'employee', idMovePerson);

		if(idChair) {
			idChair = idChair.className.baseVal.split(' ')[0].substr(6);
			//setModalText(currentPerson['name'] + ' is occupying ' + idChair + ' place. Do you wish to move this person here?');
			modalContent = currentPerson['name'] + ' is occupying ' + idChair + ' place. Do you wish to move this person here?';
		} else {
			setModalText(currentPerson['name'] + ' is occupying place on another level. Do you wish to move this person here?');
			modalContent = currentPerson['name'] + ' is occupying place on another level. Do you wish to move this person here?';
		}
		//$('#modal').modal('show');
		window.FloorPlan.openModal({
			title:"Attention",
			content: modalContent,
			onYesBtnClick: function(){
				setPlace(document.querySelector('path.leaflet-interactive[data-id_emp]'))
			},
			onNoBtnClick: function(){
				var circle = document.querySelector('path.leaflet-interactive[data-id_emp]')
				setPreviousColor(circle);
				circle.removeAttribute('data-id_emp');
			}
		});
	} else {
		setPlace(chair);
	}
}
function setPlace(chair) {
	//console.log(chair);
	var id_emp = chair.dataset.id_emp;
	var id_chair = chair.className.baseVal.split(' ').find(str => str.includes('place')).split('-')[1];
	var floor = id_chair[0];
	$.post('models/setPlace.php', {id_emp: id_emp, id: id_chair}, function(data) {
		// chair.style.stroke = colorGreen;
		//console.log(data)
		$('#modal').modal('hide');
		$.get('models/places.php', function(data) {
			places = data;
			resetMap(selectedFloorImage, listPlacesForCurrentFloor(selectedFloor, places));
			updateListPeople();
			// resetPage();
			stopAddPoint(); // Doron Lavkovsky 22/01/2018
		});
	}).fail(function (response) {
		console.log(response);
	});
}

function findEmplByPlace(id_emp) {
	return places.filter(place => place.numberOfPerson == id_emp)
}

function setModalText(msg) {
    // document.getElementsByClassName("modal-body")[0].textContent = msg;
    $('.modal-body').text(msg)
}

