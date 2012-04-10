// Filename: settings.js
(function(){
	window.myapp = window.myapp || {};
	window.myapp.Settings = {
		'OnMoveEventThreshold': 10
	};
	
	window.myapp.Api = window.myapp.Api || {};
//	window.myapp.Api.BasicUrl = "http://localhost:8888/ifood_api";
	window.myapp.Api.BasicUrl = "http://api.majashami.appspot.com/api";
	window.myapp.Api.MenuServiceUrl = window.myapp.Api.BasicUrl + "/MenuService";
})();
