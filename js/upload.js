// $(document).ready(function() {
// 	$('#personInf').click(function() {
// 		var emp_img = $('#emp_img').val();
// 		if(emp_img !== '') {
// 			emp_img = $('#emp_img').val().split('.').pop().tolowerCase();
// 			if($.inArray(emp_img, ['gif', 'png', 'jpg', 'jpeg']) == -1){
// 			alert('Invalid Image File');
// 		}

// 		}
// 	});

// });

$('INPUT[type="file"]').change(function () {
    var ext = this.value.match(/\.(.+)$/)[1];
    switch (ext) {
        case 'jpg':
        case 'jpeg':
        case 'png':
            $('#personInf').attr('disabled', false);
            break;
        default:
        $('#label').show().fadeOut( 2000 );
        this.value = '';
        break;
    }
});