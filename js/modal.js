window.FloorPlan = window.FloorPlan || {};


(function(FloorPlan) {

    /****************************** Floor Plan Modal  ****************************/

    // Modal default settings
    var modalDefault = {
        title: null,
        content: null,
		yesBtnText: "Yes",
		noBtnText: "No",
        onOpenCallback: null,
        onYesBtnClick: null,
        onNoBtnClick: null
    }

    FloorPlan.openModal = function(settings){

        
        var settings = $.extend({}, modalDefault,settings );

        $("#modal .modal-title").html(settings.title);
        $("#modal .modal-body").html(settings.content);
			
        $("#modal #modalBtnYes").html(settings.yesBtnText); 
        $("#modal #modalBtnNo").html(settings.noBtnText); 

        $('#modal').unbind('show.bs.modal');
        $("#modal #modalBtnYes").unbind('click');
        $("#modal #modalBtnNo").unbind('click');
        if (settings.onYesBtnClick){
            $("#modal #modalBtnYes").click(settings.onYesBtnClick)
        }
        if (settings.onNoBtnClick){
            $("#modal #modalBtnNo").click(settings.onNoBtnClick)
        }


        $('#modal').unbind('show.bs.modal');
        if (settings.onOpenCallback){
            $('#modal').on('show.bs.modal', function (e) {
                $('#modal').unbind('show.bs.modal');
                settings.onOpenCallback();
            })
        }

        $('#modal').modal();


    }

    FloorPlan.closeModal = function(settings){
        $('#modal').modal('hide');
    }




})(window.FloorPlan)
