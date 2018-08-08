    $(document).ready(function() {
       var loader='<img src="img/load.gif" />';
       
     
     //if submit button is clicked
     
    $('#addPerson').submit(function () {       
      
      //show the loader
      
      var id = $('#id]').val();
      var f_name = $('#f_name]').val();
      var l_name = $('#l_name]').val();
      var email = $('#email]').val();
      var phone = $('#phone]').val();
      var id_company = $('#id_company]').val();
      var park_space = $('#park_space]').val();
       
   
      
      //organize the data properly
      var form_data =  
        'id='+$id+
        '&f_name='+$f_name+
        '&l_name='+$l_name+
        '&email='+$email+
        '&phone='+$phone+
        '&id_company='+$id_company+
        '&park_space='+$park_space;
       
      //disabled all the text fields
      // $('.text').attr('disabled','true');

       
       
      //start the ajax
      $.ajax({
        //this is the php file that processes the data and send mail
        url: "models/addNewPerson.php",
         
        //POST method is used
        type: "POST",
   
        //pass the data        
        data: form_data,    
         
        
        //success
        success: function (data) {             
          //if process.php returned 1/true (send mail success)
          $('.loading').html(loader).fadeIn();  
          if (html==1) {                 
            //hide the form
            $('#addNewPerson').fadeOut('slow');                
             
             
             //hide the loader
             $('.loading').fadeOut();   
             
            //show the success message
            $('.message').html('Successfully Registered ! ').fadeIn('slow');
             
             
             
          //if process.php returned 0/false
          } else alert('Sorry, unexpected error. Please try again later.');              
        }      
      });
       
      //cancel the submit button default behaviours
      return false;
    });
}); 