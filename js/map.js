// requestAnimationFrame

map = L.map('mapid1', {
	minZoom: 1,
	maxZoom: 3,
	center: [0, 0],
	zoom: 1,
	crs: L.CRS.Simple,
	attributionControl: false,
	scrollWheelZoom: true
});

L.control.attribution({
	prefix: false
}).addAttribution('').addTo(map);

// dimensions of the image

function loadImg(url, func) {
	var img = new Image();
	img.onload = function() {
		func(this);
	};
	img.src = url;
}

function showMap(){
	$("#floorPlanDefault").hide();
	$("#mapid1").show();
	$("#btnAddPoint").show();
}

function hideMap(){
	$("#mapid1").hide();
	$("#floorPlanDefault").show();
	$("#btnAddPoint").hide();
	
}


function resetListOfPersons() {
	$('#infoMap').load('index.php #infoMap');

	// ajax reset list
}

function resetPage() {
	location.reload();
}

function changeImgSize(img){
	if (img){
		img.width = 2800;
		img.height = 2300;
	}

}

function initMap(url,img){
	changeImgSize(img);
	w = img.width;
	// h = 2367;
	// alert(img.height);
	h = img.height;
	// calculate the edges of the image, in coordinate space
	southWest = map.unproject([0, h], map.getMaxZoom()-0);
	northEast = map.unproject([w, 0], map.getMaxZoom()-0);
	bounds = new L.LatLngBounds(southWest, northEast);
	// add the image overlay, so that it covers the entire map
	layerImage = L.imageOverlay(url, bounds).addTo(map);
	// tell leaflet that the map is exactly as big as the image
	map.setMaxBounds(bounds);
}

function resetMap(imagePath, placesC) {

	showMap();

	loader.style.zIndex = '999';
	loader.style.opacity = '1';

	url = imagePath;

	loadImg(url, function(img) {
		initMap(url,img);
		setTimeout(function () {
			// calculate the edges of the image, in coordinate space
			southWest = map.unproject([0, img.height], map.getMaxZoom()-0);
			northEast = map.unproject([img.width, 0], map.getMaxZoom()-0);

			bounds = new L.LatLngBounds(southWest, northEast);
			// add the image overlay, so that it covers the entire map

			map.eachLayer(function(layer){
				// console.log(layer);
			    if (layer._url && layer._url.substring(1, 4) === 'img') {
				    layer.remove();
			    }
			});

			// tell leaflet that the map is exactly as big as the image
			L.imageOverlay(url, bounds).addTo(map);


			group.clearLayers();
			addMarkers(placesC, persons);
			// console.log(placesC);
			// 123
			// добавить обновление списка людей:
			// 1 - выборка для пола этого
			// 2 - обновление циклом из parse.js

			var mapStart = new CustomEvent('map-start');
			document.dispatchEvent(mapStart);
			// console.log(1)
		}, 700);
	});
	setTimeout(function () {
		loader.style.opacity = '0';
		// loader.style.zIndex = '-1';
	}, 1000);
	setTimeout(function () {
		loader.style.zIndex = '-1';
	}, 1500);
}

/*
// Doron set in comment
loadImg(url, function(img) {
	w = img.width;
	// h = 2367;
	// alert(img.height);
	h = img.height;
	// calculate the edges of the image, in coordinate space
	southWest = map.unproject([0, h], map.getMaxZoom()-0);
	northEast = map.unproject([w, 0], map.getMaxZoom()-0);
	bounds = new L.LatLngBounds(southWest, northEast);
	// add the image overlay, so that it covers the entire map
	layerImage = L.imageOverlay(url, bounds).addTo(map);
	// tell leaflet that the map is exactly as big as the image
	map.setMaxBounds(bounds);
});
*/

//Test markers
// L.marker([-46.5, 168.5]).addTo(map)
// .bindPopup("Test popup<br />This is me!");
// L.marker([-146, 164]).addTo(map);
