// var btn = doc.getElementById('search');
// console.log($('.filter-tab'))
$('form#search_form').submit(function (e) {
	e.preventDefault();
	$.get('models/search.php?name=' + e.target.querySelector('input[type=search]').value, function(data) {
		//console.log(data)
		// var table = renderClients(data);
		var tableContainer = $('.tab-pane.fade.filter');
		tableContainer
			.empty()
			.append(createPersonsList(data))
		startDrag(tableContainer[0])
		$('.filter-tab').click();
	});
})


// doc.querySelector('#pers-info-card').onclick = function() {
// 	card.style.top = '-500px';
// }

// function searchObject(name, prop, masObj, text) {
// 	for (var i = 0; i < masObj.length; i++) {
// 		if (masObj[i][prop] === name) return masObj[i];
// 	}
// 	return 'Error: ' + text + ' ' + name + ' not found.';
// }
// function createCard(masData) {
// 	// console.log(masData);
// 	var card = doc.createElement('tr');
// 	for (var i = 0; i < masData.length; i++) {
// 		var td = doc.createElement('td');
// 		td.innerHTML = masData[i];
// 		card.appendChild(td);
// 	}
// 	return card;
// }

	// console.log($('.filter-tab'))
	// var searchPerson = searchObject(input.value, 'firstName', persons, 'Person');
	// card.innerHTML = '<div class="pers-info-card__exit"></div>';
	// if(typeof searchPerson === 'string') {
	// 	card.innerHTML += '<h4>' + searchPerson + '</h4>';
	// } else {
	// 	for(var key in searchPerson) {
	// 		card.innerHTML += '<h4>' + key + ': ' + searchPerson[key] + '</h4>';
	// 	}
	// }
	// card.style.top = '50px';
	// input.value = '';
