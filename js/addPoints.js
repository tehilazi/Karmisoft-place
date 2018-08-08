popup = L.popup();

function onMapClick(e) {
	popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}


// ================================================================
// Enable to display points on the screen:
// ================================================================
// map.on('click', onMapClick);



// =================================================================
// To get a list of coordinates, enter in console: "point"
// =================================================================


$('#mapid1').click(function(e) {
	// console.log(e);
});


var points = '';
map.on('click', function(e) {
	// console.log(e.latlng.toString().slice(7, -1));
	points += e.latlng.toString().slice(7, -1) + ';'
} );



// Doron Lavkovsky 21/01/2018

var enumAddPointState = {
	"Unactive": "Unactive",
	"Active" : "Active"
}

var addPointState = enumAddPointState.Unactive;

map.on('click', function(e) {
	if ((addPointState == enumAddPointState.Active) &&  e.latlng && selectedFloor) {
		var lat = e.latlng.lat;
		var lng = e.latlng.lng;

		objToServer =  {
			"controller" : "add point",
			"id_floor" : selectedFloor,
			"point_x" : lat,
			"point_y" : lng
		}

		// prepare popup settings
		var container = $("<div></div>").attr("class", "form-group");
		var selectContainer = $("<div></div>").attr("class", "form-group");
		var label = $("<label>Select point location (Open Space/Room number):</label>").attr("for", "cboRoomID");
		var combo = $("<select></select>").attr("id", "cboRoomID").attr("class", "form-control");
		var roomNumber = "-1"; // ID for Open Space
		combo.append("<option value="+roomNumber+"> Open Space </option>");
		for (var i = 0; i < rooms.length; i++) {
			if (rooms[i].id && rooms[i].room_name){
				combo.append("<option value="+rooms[i].id.toString()+">" +rooms[i].room_name.toString()+ "</option>");
			}
			
		}

		var instructions = "<div>Are you sure you want to add the point?</div>";

		selectContainer.append(label);
		selectContainer.append(combo);

		container.append(selectContainer);
		container.append("<br/>");
		container.append(instructions);

		// open popup
		window.FloorPlan.openModal({
			title:"Add new point",
			content: container,
			onYesBtnClick: function(){
				// save point
				objToServer["id_room"] = $("#cboRoomID").val();
			  	$.ajax({
					url: 'models/edit.php',
					method: "POST",
					data: objToServer,
					dataType: 'json',
					success: function(resp){
						alert("New point added successfully.")
						window.FloorPlan.closeModal();
						stopAddPoint();
						// Refresh the map
						$.get('models/places.php', function(data) {
							places = data;
							resetMap(selectedFloorImage, listPlacesForCurrentFloor(selectedFloor, places));
						});
					}
				});
			}
		});
	}

});


function startAddPoint(){
	addPointState = enumAddPointState.Active;
	$("#blockMap #mapid1").addClass("add-point");
}

function stopAddPoint(){
	addPointState = enumAddPointState.Unactive;
	$("#blockMap #mapid1").removeClass("add-point");
}

$("#btnAddPoint").click(function(e) {
	e.preventDefault();
	startAddPoint();
});