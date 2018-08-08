var btnUploadFloor = doc.querySelector('#modal2 input[type=submit]');

eventForNewFloor();

// Doron set in comment
/*
btnUploadFloor.onclick = function() {
	objToServer['controller'] = 'JS';
	objToServer['floor'] = this.parentNode.parentNode.querySelector('.form-group input[type=text]').value;
	objToServer['building'] = buildingsMenu.getAttribute('data-build-id');
	$.post('models/upload.php', objToServer, function(resp){
		// console.log(resp);
		var wrapFloors = doc.getElementById('menu-of-floors');
		tmpFl = floor({name: objToServer['floor'], image: resp, id: resp});
		wrapFloors.insertBefore(tmpFl, wrapFloors.querySelector('li[add]'));
		eventToFloor(tmpFl);
		$('#modal2').modal('hide');
	});
};
*/

$("#addFloorForm").ajaxForm({ 
	url: 'models/upload.php', 
	dataType: "json",
	clearForm: true,
	success: function(data,textStatus,jqXHR) { 
		updateBuildingFloors(selectedBuilding);
		$('#modal2').modal('hide');
		
	}
});