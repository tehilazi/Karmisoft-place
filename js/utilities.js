function listPlacesForCurrentFloor(idFloor, places) {
	// функция возвращает список людей с этого этажа
	var tmp = places.filter(function (place) {
		return place.floor_id === idFloor.toString()
	});
	// console.log(tmp);
	return tmp;
}



function naturalCompare(a, b) {
    var ax = [], bx = [];

    a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
    b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
    
    while(ax.length && bx.length) {
        var an = ax.shift();
        var bn = bx.shift();
        var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
        if(nn) return nn;
    }

    return ax.length - bx.length;
}


function showRightSideTab(tabName){
    if ((tabName!=="company") && (tabName!=="persons") && (tabName!=="personInfo") ){
        return;
    }
    $('.navbar-nav a[href=".'+tabName+'"]').tab('show');
}