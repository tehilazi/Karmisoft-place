$(document).ready(function(){
	$.get('models/empl.php', function(data) {
			persons = data;
			showListPeople(persons);
		});
});



























// $(document).ready(function(e){
// 	e.preventDefault();
// 	$.get('models/persons.php' function(data) {
// 		console.log(data)
// 		var table = renderClients(data);
// 		$('.tab-pane.fade.persons').html(table)
// 		$('.persons-tab').click();
// 	});
// }


// function renderClients(clients) {
// 	var html = `<table class="table table-hover"><tbody><tr>
// 				<th></th>
// 				<th>Name</th>
// 				<th>Company</th>
// 				<th>Phone</th>
// 				<th>Park</th>
// 				<th>Pc</th>
// 				<th>Edit</th>
// 			</tr>`
// 	for (var i = 0; i < clients.length; i++) {
// 		html += `
// 			<tr class='rd hover' draggable='true'>
// 				<td class='redips-rowhandler'><div class='redips-drag redips-row'></div></td>
// 				<td class='lastname'>${clients[i]['name']}</td>
// 				<td class='firstname'>${clients[i]['comp_name']}</td>
// 				<td class='phone'>${clients[i]['phone']}</td>
// 				<td class='park_space'>${clients[i]['park_space']}</td>
// 				<td class='pc_model'>${clients[i]['equipment']}</td>
// 				<td class='editdelete'><a href='#'><span class='glyphicon glyphicon-pencil'></span></a></td>
// 			</tr>
// 		`;
// 	}
// 	return html + '</tbody></table';
// }
