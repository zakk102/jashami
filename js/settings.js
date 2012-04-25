// Filename: settings.js
(function(){
	window.myapp = window.myapp || {};
	window.myapp.Settings = {
		'OnMoveEventThreshold': 10,
		'LocalMenuDataFileName':'menuData.txt',
		'StoreBriefHmargin': 10,
		'getStoreBriefWidth': function(containerWidth){
			var wWidth = containerWidth - this.StoreBriefHmargin;
			var col = Math.floor(wWidth/400)+1;
			return (wWidth-this.StoreBriefHmargin*(col-1))/col;
		}
	};
	
	window.myapp.Api = window.myapp.Api || {};
//	window.myapp.Api.BasicUrl = "http://localhost:8888/ifood_api";
	window.myapp.Api.BasicUrl = "http://api2.majashami.appspot.com/api/";
	window.myapp.Api.MenuServiceUrl = window.myapp.Api.BasicUrl + "MenuService";
	window.myapp.Api.OrderServiceUrl = window.myapp.Api.BasicUrl + "OrderService";
	window.myapp.Api.AppEventServiceUrl = window.myapp.Api.BasicUrl + "AppEventService";
})();
