// i18n
	var supportedLang = 'zh-tw';
	var defaultLang = 'zh-tw';
	var language = window.navigator.userLanguage || window.navigator.language || defaultLang;
	language = language.toLowerCase();
	if(supportedLang.indexOf(language)<0) language = defaultLang;
	i18n.set(window.languages[language]);

	//window.phonegapEnabled = true;

// phonegap
	myapp.PG.Event.onDeviceReady(function(){
		console.log("phonegap load");
		window.phonegapEnabled = true;
		window.enableBackButton = true;
		if(myapp.LocalModel) myapp.LocalModel.setPhoneUUID(myapp.PG.Device.getUUID());
		// android back key
		myapp.PG.Device.overrideBackButton();
		myapp.PG.Event.onBackKeyDown(function(){
			if(!window.enableBackButton) return;
			//TODO go back page, need to detect have to exit app or not
		});
		// pause and resume
		myapp.PG.Event.onPause(function(){
			window.myapp.AppEvent.onPause();
		});
		myapp.PG.Event.onResume(function(){
			window.myapp.AppEvent.onResume();
		});
		// native or web ui
		$(window).trigger('useNative', true);
	});
// start
	$(document).ready(function () {
		$('#backgroundLogo').remove();
		window.app_router = new myapp.Router;
		Backbone.history.start();
		window.myapp.AppEvent.onStart();
	});
	



/*
			// check menu update
			var editMode = true;
			var menuLastUpdateTime = window.myapp.LocalModel.getMenuLastUpdateTime(editMode);
			window.inUpdatingMenu = true;
			// get menu from server if need
			var url = window.myapp.Api.MenuServiceUrl+"?action=updateDateIfNeed&lastUpdate="+menuLastUpdateTime+"&isEditMode="+editMode;
			var url2 = window.myapp.Api.MenuServiceUrl+"?action=getWholeMenu&isEditMode="+editMode;
			console.log(url);
			var saveMenu = function(data){
				console.log('saving menu data from server');
				window.menuData = new window.myapp.Model.MenuData();
				window.menuData.get('zipCodeIndexs').add(data.zipCodeIndexs);
				window.menuData.get('stores').add(data.stores);
				window.menuData.get('menus').add(data.menus);
				window.inUpdatingMenu = false;
				// save the menu to local file
				window.myapp.PG.File.write(window.myapp.Settings.LocalMenuDataFileName, JSON.stringify(data), function(){
					console.log("write success");
					// set last update time to local storage
					window.myapp.LocalModel.setMenuLastUpdateTime(new Date(), editMode);
				},function(error){
					console.log(error.code);
				});
			};
			$.ajax({
				type: 'GET',
				url: url, 
				dataType: 'json',
				success: function(data){
					saveMenu(data);
				},
				error: function(xhr, type){
				    console.log('updateDateIfNeed: Ajax error!');
				    console.log(type);
				    // already up to date? if yes, read from local file
				    // read success
				    // read fail
				    window.myapp.PG.File.read(window.myapp.Settings.LocalMenuDataFileName, function(text){
				    	console.log('read local menu file success');
						console.log(text.substring(0,20));
						var data = JSON.parse(text);
						window.menuData = new window.myapp.Model.MenuData();
						window.menuData.get('zipCodeIndexs').add(data.zipCodeIndexs);
						window.menuData.get('stores').add(data.stores);
						window.menuData.get('menus').add(data.menus);
						window.inUpdatingMenu = false;
					},function(error){
						console.log('read local menu file failed');
						console.log(error.code);
						$.ajax({
							type: 'GET',
							url: url2, 
							dataType: 'json',
							success: function(data){
								saveMenu(data);
							},
							error: function(xhr, type){
								console.log('get server menu file: Ajax error!');
							}
						});
					});
				}
			});
 
 */