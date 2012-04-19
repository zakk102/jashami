// Filename: settings.js
(function(){
	window.myapp = window.myapp || {};
	window.myapp.Settings = {
		'OnMoveEventThreshold': 10,
		'LocalMenuDataFileName':'menuData.txt'
	};
	
	window.myapp.Api = window.myapp.Api || {};
//	window.myapp.Api.BasicUrl = "http://localhost:8888/ifood_api";
	window.myapp.Api.BasicUrl = "http://api2.majashami.appspot.com/api/";
	window.myapp.Api.MenuServiceUrl = window.myapp.Api.BasicUrl + "MenuService";
	window.myapp.Api.OrderServiceUrl = window.myapp.Api.BasicUrl + "OrderService";
})();
