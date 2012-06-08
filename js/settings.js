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
		},
		'isOpenNow': function(){
			var d = new Date();
			var h = d.getHours(), m = d.getMinutes();
			if( h<9 || (h==9&&m<=30) ) return false; //0:00~9:30
			if( h>19 || (h==19&&m>=30) ) return false; //19:30~24:00
			return true;
		},
		'appVersion': 'ver2.2.034'
	};
	
	window.myapp.Api = window.myapp.Api || {};
	window.myapp.Api.BasicUrl = "http://api2.majashami.appspot.com/api/";
	window.myapp.Api.MenuServiceUrl = window.myapp.Api.BasicUrl + "MenuService2";
	window.myapp.Api.OrderServiceUrl = window.myapp.Api.BasicUrl + "OrderService";
	window.myapp.Api.AppEventServiceUrl = window.myapp.Api.BasicUrl + "AppEventService";
	window.myapp.Api.FeedbackServiceUrl = window.myapp.Api.BasicUrl + "FeedbackService";
	window.myapp.Api.DeviceInfoServiceUrl = window.myapp.Api.BasicUrl + "PushNotificationService";
	window.myapp.Api.ErrorLogServiceUrl = window.myapp.Api.BasicUrl + "ErrorLogService";
})();
