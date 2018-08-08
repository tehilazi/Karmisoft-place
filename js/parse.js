var colorGreen = '#5E8C29',
	colorRed = '#f00',
	colorBlue = '#0af';

$(document).ready(function(){
	var defaultFloor = 2;

	initCompanyVariables();

	var personsPromise = $.get('models/persons.php?company_id='+selectedCompany);
	var placesPromise = $.get('models/places.php');

	Promise.all([personsPromise, placesPromise])
	.then(function (data) {
		// [persons, places] = data;
		persons = data[0];
		masPerson = persons;
		places = data[1];
		// console.log('places');
		// console.log(places);
		showListPeople('#redips-drag', persons, true);
		//resetMap(selectedFloorImage, listPlacesForCurrentFloor(defaultFloor, places));
	})
});

var masPerson, masChairs, masCompanies, masPcModels, masParkSpaces, masIdFreeParkSpaces, masDepartments, masTeams;
function updateGlobalMas(isDT) {
	if(isDT) {
		/*
		objToServer['controller'] = 'read departments';
		$.post('models/edit.php', objToServer, function(resp){
			masDepartments = resp;
			// console.log(masDepartments);
		});*/
		objToServer['controller'] = 'read teams';
		$.post('models/edit.php', objToServer, function(resp){
			masTeams = resp;
			// console.log(masTeams);
		});
	}
	objToServer['controller'] = 'read company';
	$.post('models/edit.php', objToServer, function(resp){
		masCompanies = resp;
		// console.log(masCompanies);
	});
	objToServer['controller'] = 'read pc_model';
	$.post('models/edit.php', objToServer, function(resp){
		masPcModels = resp;
		// console.log(masPcModels);
	});
	objToServer['controller'] = 'read park_spaces';
	$.post('models/edit.php', objToServer, function(resp){
		masParkSpaces = resp;
		// console.log(masParkSpaces);
	});
	objToServer['controller'] = 'read free park_spaces';
	$.post('models/edit.php', objToServer, function(resp){
		masIdFreeParkSpaces = resp;
		// console.log(masIdFreeParkSpaces);
	});
	/*
	$.get('models/persons.php?company_id='+selectedCompany, function(data) {
		masPerson = data;
	});
	*/
}
function objFromMas(masObj, property, value) {
	if(!masObj) { return false; }
	for (var i = masObj.length - 1; i >= 0; i--) {
		if(masObj[i][property] === value) {
			return masObj[i];
		}
	}
	return false;
}
updateGlobalMas(true);
function addMarkers(masPlace, masPeople) {
	if(masPlace.length < 1 || masPeople.length < 1) return 0;
	masChairs = masPlace;
	masPerson = masPeople;
	// console.log(masPlace);
	// console.log(masPeople);

	for(var i = 0; i < masPlace.length; i++) {
		// console.log(masPlace[i]);

		var options = {
			radius: 2.5,
			className: "place-" + masPlace[i].id,
		}

		var curCircle = L.circle([masPlace[i].x, masPlace[i].y], Object.assign(options, {fillColor: defaultCircle.fillColor, color: defaultCircle.color}));
		// console.log(curCircle);
		if(masPlace[i].numberOfPerson) {
			var person = getPerson(masPeople, masPlace[i].numberOfPerson);
			/* Способы решения задачи передачи информации о человеке
			1. Предеача id и поиск по id человека. Нужно хранить глобальную переменную (массив людей).
			2. Предеача i и выборка по i человека. Нужно хранить глобальную переменную (массив людей).
			3. Склейка информации о человеке и записывание на место, где нужно записывать id
			   (не нужен глобальный массив, но нужно будет распарсить).
			*/
			// console.log(person);
			// грязный хак, нужно исправить, сейчас информация (id человека) записывается в имя класса
			// посмотреть как добавить атрибут в документации к leaflet
			// или же мы можем перебрать все кругляшки по очереди (только те, которые заняты) и записать в них атрибут id
			curCircle = L.circle([masPlace[i].x, masPlace[i].y], Object.assign(options, {className: options.className + ' occupied idP' + masPlace[i].numberOfPerson, fillColor: decorCircle.fillColor, color: decorCircle.color}));
			// console.log(person);
			// curCircle.setAttribute('id_person', masPlace[i].numberOfPerson);
			// console.log(curCircle);
			curCircle.bindTooltip('<h3>' + person.name + '</h3><br>' +
								// '<img class="prev-image" src="img/persons/'+ person.emp_img + '" alt="test image" />'
								'<img class="prev-image" src="img/persons/profile.jpeg" alt="profile_img" />'
								+
								'<h4>Phone: '  + person.phone +'</h4><br>' +
								'<h4>Employee №: ' + person.employee + '</h4><br>' +

								(person.models ? '<h4>PCmodel: ' + person.models + '</h4><br>' : '') +
								(person.park_space ? '<h4>Parking space: ' + person.park_space + '</h4><br>' : ''))
					.addTo(group);
			if(masPlace[i].x < -150) {
				curCircle._tooltip.options['offset'] = L.point(0, -140);
			} else {
				curCircle._tooltip.options['offset'] = L.point(0, 100);
			}
			// console.log(curCircle);
			curCircle.on('click', function(e) {
				onCircleClick(e);
			});
			curCircle.on('mouseover', function(e) {
				e.target.setRadius(e.target.getRadius() + 5);
			});
			curCircle.on('mouseout', function(e) {
				e.target.setRadius(e.target.getRadius() - 5);
			});
		} else {
			curCircle
				.bindTooltip('<h2>This place is free.</h2>')
				.addTo(group);
		}
	}
	group.addTo(map);
}
doc.onclick = function(e) {
	var t = e.target;
	if(t.tagName === 'SPAN' && t.className === 'glyphicon glyphicon-pencil'
		|| t.tagName === 'path' && typeof(t.className) === 'object') {
		return false;
	}
	resetStylePrewCircle(decorCircle);
	return true;
}

function onCircleClick(e) {
	var idPerson = e.target.options.className.split('idP')[1];
	showTabEditDataPerson(idPerson, false);
}

function getPerson(persons, id) {
	for (var i = 0; i < persons.length; i++) {
		if(persons[i].employee === id) return persons[i];
	}
	return persons[0];
}

function parseCsv(data, splitSymbol) {
	var data1 = data.split(/\r?\n|\r/),
		massObj = [], masProp;
	masProp = data1[0].split(splitSymbol);
	for(var i = 0; i < masProp.length; i++) {
		masProp[i] = changeName(masProp[i]);
	}
	for(var i = 1; i < data1.length; i++) {
		data1[i] = data1[i].split(splitSymbol);
		var tempObj = {};
		for(var j = 0; j < masProp.length; j++) {
			tempObj[masProp[j]] = data1[i][j];
		}
		massObj.push(tempObj);
	}
	return massObj;
}

function changeName(str) {
	return str.split(' ').map(name => name[0].toUpperCase() + name.slice(1));
}

function showListPeople(idWrap, persons, isClearWrap) {
	if(isClearWrap) {
		// console.log(persons) // array
		$(idWrap)
			.empty()
			.append(createPersonsList(persons))
		// createPersonsList(persons).appendTo('#redips-drag');

		// for (var i = 0; i < persons.length; i++) {
		// 	tbody.append(createPeopleStr(persons[i]));
		// }
	} else {
		$(idWrap)
		.append(createPersonsList(persons))
	}
	hoverForList();
}

function createPersonsList(persons) {
	var table = $('<table>', {
		class: "table table-hover",
		html: `
		<thead>
			<tr>
				<th></th>
				<th class='name'>Name</th>
				<th class='depart'>Department</th>
				<th class='location'>Location</th>
				<th class='editdelete'></th>
			</tr>
		</thead>
		`,
	});
	var tbody = $('<tbody>').appendTo(table);

	persons.forEach(function (person) {
		// console.log(person)
		tbody.append(createPeopleStr(person))
	})
	return table;
}

function createPeopleStr(person) {

	var rowClass = "rd hover";
	if (person['location']){
		rowClass+= " "+"person-placed"; // Class for person that placed in point
	}

	var row = $('<tr>', {
		class: rowClass,
		draggable: true,
		'data-id': person['employee'],
	});

	var circle = $('<td>', {
		class: "redips-rowhandler",
		html: $('<div>', {class: 'redips-drag redips-row'}),
	}).appendTo(row);

	var name = $('<td>', {
		class: "name",
		html: person['name'],
	}).appendTo(row);

	var name = $('<td>', {
			class: "depart",
			html: person['depart'],
	}).appendTo(row);
/*
	var name = $('<td>', {
			class: "team",
			html: person['team'],
	}).appendTo(row);
*/
	var name = $('<td>', {
				class: "location",
				html: person['location'],
	}).appendTo(row);
/*
	var name = $('<td>', {
				class: "location",
				html: person['models'],
	}).appendTo(row);

	var name = $('<td>', {
				class: "location",
				html: person['park_space'],
	}).appendTo(row);
	*/



	// мы не можем бежать for-ом по объекту ({key1: "value", key2: "value"})
	// Для этого мы создадим из объекта массив ключей:
	// {key1: "value", key2: "value"} => ['key1', 'key2']
	// Object.keys(person).forEach(function (key) {
	// 	console.log(key, person[key]);
	// 	$('<td>', {
	// 		class: key, // key
	// 		text: person[key], // value
	// 	}).appendTo(row);
	// })

	var edit = $('<td>', {
		class: "editdelete",
		html: $('<a>', {
			href: "#",
			html: $('<span>', {class: "glyphicon glyphicon-pencil"}),
		}),
	}).appendTo(row);

	return row;
}

function hoverForList() {
	var elementsOfList  = doc.querySelectorAll('.rd.hover');
	// console.log(elementsOfList);
	// console.log(masPerson);
	// masPerson = undefined - bug!
	if(elementsOfList.length > 1) {
		for (var i = elementsOfList.length - 1; i > -1; i--) {
			elementsOfList[i].onmousemove = function() {
				var idClickPerson = this.getAttribute('data-id');
				// console.log(this);
				if(masPerson) {
					for (var j = masPerson.length - 1; j > -1; j--) {
						if(masPerson[j]['employee'] == idClickPerson) {
							var curPerson = getPerson(masPerson, idClickPerson);
							var points = [];
							if (curPerson['points']){
								points = curPerson['points'].split(',');
							}
							setStyleChooseCircle(points);
							break;
						}
					}
				}
			}
		}
	}
}
