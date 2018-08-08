for (var i = 0; i < masLiMap.length; i++) {
	masLiMap[i].onclick = function() {
		var liChecked = doc.querySelector('.checked_map');
		if(liChecked){
			liChecked.className = '';
		}
		this.className = 'checked_map';
		var floor = this.getAttribute('data-floor-id');

		$.get('models/places.php', function(data) {
			places = data;
			// console.log('places reset:');
			// console.log(places);
			resetMap(selectedFloorImage, listPlacesForCurrentFloor(selectedFloor, places));
		});
	}
}

function searchLi(clickLi, selector) {
	var childLi = clickLi.parentNode.querySelectorAll(selector);
	for (var i = 0; i < childLi.length; i++) {
		if(childLi[i] === clickLi) {
			return i;
		}
	}
}
