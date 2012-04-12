// phonegap plugins
(function(){
	PhoneGap.plugins = PhoneGap.plugins || {};
	
	// http request
	function HttpRequest() {};
	HttpRequest.prototype.request = function(urlString, successCallback, failCallback){
		return PhoneGap.exec(successCallback, failCallback, "HTTPRequest", "grabURL", [urlString]);
	};
	HttpRequest.prototype.requestInBackground = function(urlString, successCallback, failCallback){
		return PhoneGap.exec(successCallback, failCallback, "HTTPRequest", "grabURLInBackground", [urlString]);
	};
	PhoneGap.addConstructor(function() {
		PhoneGap.plugins.httpRequest = new HttpRequest();
	});	
})();

// phonegap interface
(function(){
	var PGP = PhoneGap.plugins;
	var PG = {};
	
	// device
	var Device = {};
	PG.Device = Device;
	Device.getUUID = function(){ return device.uuid; };
	Device.getPhoneGapVersion = function(){ return device.phonegap; };
	Device.overrideBackButton = function(){ 
		if (device && typeof device.overrideBackButton == "function") {
			device.overrideBackButton();
		}
	};
	Device.exitApp = function(){
		if (navigator.app && typeof navigator.app.exitApp == "function") {
			console.log("app.exit");
			navigator.app.exitApp();
		} else if (device && typeof device.exitApp == "function") {
			console.log("device.exit");
			device.exitApp();
		}
	};
	
	// event
	var Event = {};
	PG.Event = Event;
	Event.onDeviceReady = function(f){ $(document).bind("deviceready", f); };
	Event.onPause = function(f){ $(document).bind("pause", f); };
	Event.onResume = function(f){ $(document).bind("resume", f); };
	Event.onBackKeyDown = function(f){ $(document).bind("backbutton", f); };
	
	// Geolocation
	var Geolocation = {};
	PG.Geolocation = Geolocation;
	Geolocation.getCurrentPosition = function(successCallback, errorCallback){
		var myOptions = { timeout: 15000, enableHighAccuracy: true };
		navigator.geolocation.getCurrentPosition(function(position) {
	    	successCallback(position.coords);
	    }, function(error) {
	    	errorCallback(error);
	    }, myOptions);
	};
	Geolocation.getAddressFromGeo = function(lat, lng, successCallback, errorCallback){
		var url = "http://maps.google.com/maps/api/geocode/json?latlng="+lat+","+lng+"&language=zh-TW&sensor=true";
		PGP.httpRequest.requestInBackground(url, 
		function(responseData){
			console.log("getAddressFromGeo http success");
			var o = eval( '(' + responseData + ')' );
			successCallback(o);
		},
		function(errorMsg){
			console.log("getAddressFromGeo http failed");
			errorCallback(errorMsg);
		});
	};
	
	
	window.myapp = window.myapp || {};
	window.myapp.PG = PG;
})();
