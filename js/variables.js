var doc = document, input,
	southWest, northEast, bounds, popup, map, url, layerImage,
	group = L.layerGroup();

var idCurPersonEdit;

var objToServer = Object.create(null),
	xhr = new XMLHttpRequest();

	// persons = []
	// places = []

var masLiMap = doc.querySelectorAll('#menu-of-floors li');

input = doc.querySelector('#search-text'),
card  = doc.querySelector('#pers-info-card');

var w, h;

var loader			= doc.querySelector('#loader'),
	personInfoTable = doc.querySelector('#listOfPersons');

var fields = ['id', 'f_name', 'l_name', 'email', 'phone', 'id_company', 'park_space', 'checkbox_models--content', 'location', 'departments', 'team', 'emp_img'];

var resetImg = doc.getElementById('reset_emp_img');

// buildings floors
var floorsMenu = doc.querySelector('#js-floors-change-text'),
	companies = doc.querySelectorAll('#menu-of-companies li'),
	companiesMenu = doc.querySelector('#js-companies-change-text'),
	buildings = doc.querySelectorAll('#menu-of-buildings li'),
	buildingsMenu = doc.querySelector('#js-buildings-change-text');


var selectedBuilding = null;

var selectedFloor = null;
var selectedFloorImage = null;
var selectedCompany = null;
var selectedCompanyName = null;


var rooms = [];

function initCompanyVariables(){
	if ($("#js-companies-change-text") && $("#js-companies-change-text").data("companyId")){
		selectedCompany = $("#js-companies-change-text").data("companyId");
		selectedCompanyName = $("#js-companies-change-text").text();
	}
}
