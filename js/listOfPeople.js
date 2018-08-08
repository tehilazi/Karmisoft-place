function addClicksForMove(selector) {
	var listOfPeople = doc.querySelectorAll(selector);
	for (var i = 0; i < listOfPeople.length; i++) {
		listOfPeople[i].addEventListener('mousedown', function(e) {
			moveElement(true, e, this);
			// console.log(this);
			if(prew) {
				prew.className = '';
			}
			var prew = doc.querySelector('.move-person-card');
			this.className = 'move-person-card';
		});
	}
}

function moveElement(isClick, context, persCard) {
	var target = doc.querySelector('.move-circle'),
	w = 50, h = 50, x = 0, y = 0;
	x = context.offsetX == undefined ? context.layerX : context.offsetX;
	y = context.offsetY == undefined ? context.layerY : context.offsetY;

	target.style.left = context.pageX - w / 2 + 'px';
	target.style.top = context.pageY - h / 2 + 'px';
	target.style.display = 'block';
	
	target.addEventListener('mouseup', function(e) {
		isClick = false;
		target.style.display = 'none';
		var curX = e.pageX,
			curY = e.pageY;
		// console.log(curX + ' : ' + curY);
		if(isInPlace(curX, curY, 707, 138, 20)) {
			// посадка на место персоны из списка
			killObject(context);
		} else {
			//console.log(2);
			persCard.className = '';
		}
	});
	target.addEventListener('mousemove', function(e) {
		if(isClick) {
			target.style.left = e.pageX - w / 2 + 'px';
			target.style.top = e.pageY - h / 2 + 'px';
		}
	});
}

function isInPlace(curX, curY, pX, pY, k) {
	if(curX >= pX - k && curX <= pX + k
		&& curY >= pY - k && curY <= pY + k) {
		return true;
	}
	return false;
}

function killObject(object) {
	object.innerText = null;
	object.innerHTML = null;
	object.outerHTML = null;
	object = null;
}

$(document).ready(function(){
	$('#departments').multipleSelect({width: '100%'});
});