// Filename: localModel.js
(function(){
	// is support localStorage or not?
	if(typeof window.localStorage != "undefined"){
		LS = window.localStorage;
		var LocalModel = {};
		LocalModel.set = function(key, value){
			if(!key || key.length<1){ console.log('local storage error: (set) key is null'); return; }
			LS.setItem(key, value);
		};
		LocalModel.get = function(key){
			return LS.getItem(key);
		};
		LocalModel.remove = function(key){
			LS.removeItem(key);
		};
		LocalModel.clear = function(){
			LS.clear();
		};
		LocalModel.getLength = function(){
			return LS.length;
		};
		LocalModel.key = function(index){
			return (index >= 0 && index < this.getLength()) ? LS.key(index) : null;
		};
		LocalModel.clearWithPrefix = function(prefix){
			var removeList = [];
			for(var i=0,length=this.getLength(); i<length; i++){
				var key = this.key(i);
				if(key.indexOf(prefix)==0) removeList.push(key);
			}
			for(var i=0,length=removeList.length; i<length; i++){
				this.remove(removeList[i]);
			}
		};
		
		
	// init app
		var appId = LocalModel.get("appID");
		if(!appId) LocalModel.set("appID", "@APPID@" + (new Date()).getTime() + "." + Math.random());

	// app data
		LocalModel.getMenuLastUpdateTime = function(isEditMode){ var d = this.get("MenuLastUpdateTime"+(isEditMode?"_EditMode":"")); return d; };
		LocalModel.setMenuLastUpdateTime = function(date, isEditMode){ this.set("MenuLastUpdateTime"+(isEditMode?"_EditMode":""), date.getTime()); };
		LocalModel.getLocationServiceStatus = function(){ return this.get("LocationServiceStatus"); };
		LocalModel.setLocationServiceStatus = function(status){ this.set("LocationServiceStatus", status); };

	// error log
//		LocalModel.getAppErrorLog = function()

	// phone data
		LocalModel.getAppId = function(){ return this.get("appID"); };
		LocalModel.setPhoneUUID = function(uuid){ this.set("phoneUUID", uuid); };
		LocalModel.getPhoneUUID = function(){ return this.get("phoneUUID"); };
		LocalModel.getUUID = function(){
			var result = this.get("phoneUUID");
			if(result)
				return result;
			return this.getAppId();
		};
	// user data
		LocalModel.setUserName = function(name){ this.set("userName", name); };	
		LocalModel.getUserName = function(){ return this.get("userName"); };
		LocalModel.setUserPhoneNumber = function(phoneNumber){ this.set("userPhoneNumber", phoneNumber); };	
		LocalModel.getUserPhoneNumber = function(){ return this.get("userPhoneNumber"); };
		LocalModel.setUserAddress = function(address){ this.set("userAddress", address); };
		LocalModel.getUserAddress = function(){ return this.get("userAddress"); };	
		LocalModel.setUserDistrict = function(district){ this.set("userDistrict", district); };
		LocalModel.getUserDistrict = function(){ return this.get("userDistrict"); };	
		
		window.myapp = window.myapp || {};
		window.myapp.LocalModel = LocalModel;
	}
})();
