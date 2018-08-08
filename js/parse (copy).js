$(document).ready(function(){
	$('body').ready(function(){
		$.get('models/persons.php?company_id='+selectedCompany, function(data) {
				persons = data;
				showListPeople(persons);			
		});
		$.ajax({
			url: "../mapV001/places.csv",
			dataType: "text",
			success: function(data) {
				// console.log(data);
				places = parseCsv(data, ',');
				var placesCurrent = listPersonsForCurrentFloor('02', places);
				resetMap('02', placesCurrent);
			}
		});
	});
});

function showListPeople(persons) {
	var tbody = personInfoTable.querySelector('tbody');
	for (var i = 0; i < persons.length; i++) {
		tbody.appendChild(
				createPeopleStr(
					persons[i]['name'],
					persons[i]['phone'],
					persons[i]['employee'],
					persons[i]['equipment'],
					persons[i]['parking_place']
					)
			);
	}
}

function createPeopleStr(name, phone, employee, equipment, parking_place) {
	var wrap = doc.createElement('tr'),
		td0  = doc.createElement('td'),
		td1  = doc.createElement('td'),
		td2  = doc.createElement('td'),
		td3  = doc.createElement('td'),
		td4  = doc.createElement('td'),
		td5  = doc.createElement('td'),
		td6  = doc.createElement('td'),
		td7  = doc.createElement('td'),
		div	 = doc.createElement('div'),
		a	 = doc.createElement('a'),
		span = doc.createElement('span');

	// wrap.id = 'hover';
	wrap.className = 'rd';
	td0.className = 'redips-rowhandler';
	div.className = 'redips-drag redips-row';


	// td1.className = 'id';
	// td2.className = 'phone';
	// td3.className = 'name';
	// td4.className = 'phone';
	// td5.className = 'email';
	// td6.className = 'parking_place';


	// td7.className = 'editdelete';
	// a.setAttribute('href', '#');
	// span.className = 'glyphicon glyphicon-pencil';

	// td1.innerHTML = id;
	// td2.innerHTML = fName;
	// td3.innerHTML = lName;
	// td4.innerHTML = employee;
	// td5.innerHTML = equipment;
	// td6.innerHTML = parking_place;

	td0.appendChild(div);
	a.appendChild(span);
	td7.appendChild(a);


	wrap.appendChild(td0);
	wrap.appendChild(td1);
	wrap.appendChild(td2);
	wrap.appendChild(td3);
	wrap.appendChild(td4);
	wrap.appendChild(td5);
	wrap.appendChild(td6);
	wrap.appendChild(td7);
	return wrap;
}

function listPersonsForCurrentFloor(idFloor, persons) {
	var personsC  = [],
		personsCI = 0;
	for (var i = persons.length - 1; i > -1; i--) {
		if(persons[i].id.slice(0, 2) === idFloor) {
			personsC[personsCI] = persons[i];
			personsCI++;
		}
	}
	return personsC;
}

function addMarkers(masPlace, masPeople) {
	if(masPlace.length < 1 || masPeople.length < 1) return 0;

	for(var i = 0; i < masPlace.length; i++) {
		// console.log(masPlace[i]);

		if(masPlace[i].busy === 'true') {
			var person = getPerson(masPeople, masPlace[i].numberOfPerson);			
			// console.log(person);
			
			L.circle([masPlace[i].x, masPlace[i].y], {radius: 2.5, fillColor: '#ff0', color: "#5E8C29"})
			.bindTooltip('<h3>' + person.name + '</h3><br>' + 
				'<h4>Phone: '  + person.phone +'</h4><br>' + 
				'<h4>Employee №: ' + person.employee + '</h4><br>' + 
				(person.equipment ? '<h4>PCmodel: ' + person.equipment + '</h4><br>' : '') + 
				'<h4>Parking space: ' + person.park_space + '</h4>')
			.addTo(group);
		} else {
			L.circle([masPlace[i].x, masPlace[i].y], {radius: 2.5, fillColor: '#9a0', color: "#0af"})
				.bindTooltip('<h2>This place is free.</h2>')
				.addTo(group);
		}
	}
	group.addTo(map);
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
	// console.log(masProp);
	// console.log(data1);
	for(var i = 1; i < data1.length; i++) {
		data1[i] = data1[i].split(splitSymbol);
		var tempObj = {};
		for(var j = 0; j < masProp.length; j++) {
			tempObj[masProp[j]] = data1[i][j];
		}
		massObj.push(tempObj);
	}
	// console.log(massObj);
	return massObj;
}

function changeName(str) {
	var temp = str.split(' '); 
	if(temp.length > 1) {
		for(var i = 1; i < temp.length; i++) {
			temp[i] = temp[i].replace(temp[i][0], temp[i][0].toUpperCase());
		}
		return temp.join('');
	}
	return str;
}

// console.log( changeName('name of person') );
