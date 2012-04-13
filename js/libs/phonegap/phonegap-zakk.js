// phonegap plugins
(function(){
	PhoneGap.plugins = PhoneGap.plugins || {};
	window.plugins = window.plugins || {}; // bug fix
	
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
	
	//picker
	function Picker() {
    	this._callback;
	}
	Picker.prototype.show = function(options, cb) {
	    this._callback = cb;
	    PhoneGap.exec("Picker.show", options);
	}
	Picker.prototype._selected = function(selectedValue) {
	    if (this._callback)
	        this._callback(selectedValue);
	}
	PhoneGap.addConstructor(function() {
	    PhoneGap.plugins.picker = new Picker();
	    window.plugins.picker = PhoneGap.plugins.picker; // bug fix
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
	
	// Picker
	var Picker = {};
	PG.Picker = Picker;
	/*
	 * dependent: boolean, is dependent case or not
	 * values: string array
	 * setValues: string array
	 * callback: slected callback
	 * rect: (iPad only) int array, location of the popup
	 */
	Picker.showPicker = function(dependent, values, setValues, callback, rect){
		var option = {};
		option.dependent = dependent;
		option.components = values;
		option.setValues = setValues;
		option.maximunWordsInLine = 24;
		option.rect = rect;
		
		PGP.picker.show( option, function(selectedValue){
			callback(selectedValue);
		});
	};
	
	window.myapp = window.myapp || {};
	window.myapp.PG = PG;
})();
