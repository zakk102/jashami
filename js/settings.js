// Filename: settings.js
(function(){
	window.myapp = window.myapp || {};
	window.myapp.Settings = {
		'OnMoveEventThreshold': 10
	};
	
	window.myapp.Api = window.myapp.Api || {};
	window.myapp.Api.BasicUrl = "http://t1.majashami.appspot.com/ifood_api";
	window.myapp.Api.MenuServiceUrl = window.myapp.Api.BasicUrl + "/MenuService";
})();
