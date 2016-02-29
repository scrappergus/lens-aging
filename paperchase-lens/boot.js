window.Lens = require("./src/my-lens");

// Little helper used to parse query strings from urls
// --------
//

var qs = function () {
	var query_string = {};
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
			// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = pair[1];
			// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
			var arr = [ query_string[pair[0]], pair[1] ];
			query_string[pair[0]] = arr;
			// If third or later entry with this name
		} else {
			query_string[pair[0]].push(pair[1]);
		}
	}
	return query_string;
} ();

$(function() {

	// Create a new Lens app instance
	// --------
	//
	// Injects itself into body

	var pii = qs.pii || 0;

	var document_json_url = "http://52.20.223.77:4932/xmlfigures/aging/pii/" + pii;

	var document_request = new XMLHttpRequest();
	document_request.onload = function(e) {
		var document_url = "";
		var document_json = JSON.parse(document_request.responseText);
		document_json[0].figures = document_json[0].figures.filter(function(o){
			return (o.figureText != "" || o.imgURLs.length > 0);
		});

		console.log(document_json[0]);

		if (document_json.length > 0) {
			document_url = (document_json[0].full_xml_url !== void(0)) ? document_json[0].full_xml_url : document_json[0].abstract_xml_url;
		}

		console.log(document_url);

		var app = new window.Lens({
			document_url: document_url
		});

		var realrender = app.render.bind(app);
		app.render = function() {
			console.log(document_json[0]);
			window.setTimeout(function() {
				Array.prototype.slice.call(document.querySelectorAll(".content-node.figure"))
									 .map(function(o){ return Array.prototype.slice.call(o.querySelectorAll("img")); })
									 .forEach(function(o, figure_n){ o.forEach(function(p, img_n){
										 var imgURL = document_json[0].figures[figure_n].imgURLs[img_n];
										 p.src = imgURL;
										 p.parentNode.href = imgURL;
									 });});
			}, 2000);

			return realrender();
		}

		app.start();

		window.app = app;


	};

	document_request.open("GET", document_json_url);
	document_request.send();

});
