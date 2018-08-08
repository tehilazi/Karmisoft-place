

$(document).ready(function() {
	/*
	$('#departments').on('change', function() {
		var depID = $(this).val();
		if(depID) {
			// alert (depID);
			$.ajax({
				type: 'POST',
				url: 'models/ajaxData.php',
				data: 'depID=' + depID,
				success: function(html){
					$('#team').html(html);
					// alert(html);
				}
			});
		}else {
			$('#team').html('<option value="">Select department first</option>');
		}
	});*/


	$('#id_company').on('change', function() {
		var companyID = $(this).val();
		updateCompanyAndDepartments(companyID,[]),false;
	});
	

});