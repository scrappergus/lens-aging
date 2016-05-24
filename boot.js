var journalConfig = require('./config.js');
var fxns = require('./fxns.js');

window.Lens = require("./src/my-lens");

$(function() {

	// Create a new Lens app instance
	// --------

	var queryParams = fxns.qs();
	var mongoId = queryParams.id || 0;
	// console.log('id',mongoId);
	// var s3xml = journalConfig.url.xml + mongoId + '.xml';
	var s3xml = 'temp/7DApgLsM5Hoqt5iDk.xml';
	// console.log('s3xml',s3xml);

	// var document_request = new XMLHttpRequest();
	// document_request.onload = function(e) {
		var document_url = "";
		// var document_json = JSON.parse(document_request.responseText);
		// document_json[0].figures = document_json[0].figures.filter(function(o){
			// return (o.figureText != "" || o.imgURLs.length > 0);
		// });

		// console.log(document_json[0]);

		// if (document_json.length > 0) {
			// document_url = (document_json[0].full_xml_url !== void(0)) ? document_json[0].full_xml_url : document_json[0].abstract_xml_url;
		// }

		// console.log(document_url);

		var app = new window.Lens({
			document_url: s3xml
		});

		var realrender = app.render.bind(app);
		app.render = function() {
			window.setTimeout(function() {
				Array.prototype.slice.call(document.querySelectorAll(".content-node.figure"))
									 .map(function(o){ return Array.prototype.slice.call(o.querySelectorAll("img")); })
									 .forEach(function(o, figure_n){ o.forEach(function(p, img_n){
										 var imgURL = document_json[0].figures[figure_n].imgURLs[img_n];
										 p.src = imgURL;
										 p.parentNode.href = imgURL;
									 });});

				var pdflink = $('a').filter(function() { return $(this).attr('href').match(/\.(pdf)/i); });
				if(pdflink.length > 0) pdflink[0].href = document_json[0].pdf_url;
			}, 2000);

			return realrender();
		}

		app.start();

		window.app = app;


	// };

	// document_request.open("GET", document_json_url);
	// document_request.open("GET", s3xml);
	// document_request.send();

});

