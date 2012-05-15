// phonegap interface
(function(){
	var PGP = PhoneGap.plugins;
	var PG = {};
	
	// ChildBrowser
	var ChildBrowser = {};
	PG.ChildBrowser = ChildBrowser;
	ChildBrowser.go = function(url){
		PGP.childBrowser.showWebPage(url);
	}
	
	// Device
	var Device = {};
	PG.Device = Device;
	Device.getUUID = function(){ return device.uuid; };
	Device.getPhoneGapVersion = function(){ return device.phonegap; };
	Device.overrideBackButton = function(){ 
		if (device && typeof device.overrideBackButton == "function") {
			device.overrideBackButton();
		}else if (App && typeof App.overrideBackButton == "function") {
			App.overrideBackButton(true);
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
	
	// Event
	var Event = {};
	PG.Event = Event;
	//Event.onDeviceReady = function(f){ document.addEventListener("deviceready", f, false); };
	Event.onPause = function(f){ document.addEventListener("pause", f); };
	Event.onResume = function(f){ document.addEventListener("resume", f); };
	Event.onBackKeyDown = function(f){ document.addEventListener("backbutton", f); };
	
	// File
	var File = {};
	PG.File = File;
	File.write = function(fileName, text, successCallback, failCallback){
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
			fileSystem.root.getFile(fileName, {create: true}, function(fileEntry){
				fileEntry.createWriter(function(writer){
					writer.onwrite = function(evt) { console.log("onwrite file"); successCallback(); };
					writer.write(text);
				}, failCallback);
			}, failCallback);
		}, failCallback);
	};
	File.read = function(fileName, successCallback, failCallback){
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
			fileSystem.root.getFile(fileName, {create: false}, function(fileEntry){
				fileEntry.file(function(file){
					var reader = new FileReader();
			        reader.onloadend = function(evt) { 
			        	console.log("Read as text"); 
			        	successCallback(evt.target.result); 
			        };
        			reader.readAsText(file);
				}, failCallback);
			}, failCallback);
		}, failCallback);
	};
	
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
			var o = JSON.parse(responseData);
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
		option.components = values || [];
		option.setValues = setValues || [];
		option.maximunWordsInLine = 24;
		option.rect = rect || [];
		
		PGP.picker.show( option, function(selectedValue){
			callback(selectedValue);
		});
	};
	
	window.myapp = window.myapp || {};
	window.myapp.PG = PG;
})();
