(function(isOpenNow, appVersion){
	
/*	var orderProcessString = {
		Loc:"Location",
		Entr:"進入",
		EntrS:"進入商店",
		LevA:"離開程式",
		OpP:"OpenProduct",
		AdP:"AddProduct",
		RmP:"RemoveProduct",
		Bk:"返回",
		PtP:"加入購物車",
		CO:"進入結帳頁",
		Fin:"完成訂單"
	};*/
	
	var GoogleAnalytics = {
		_develop: true,
		sendTrackEvent: function(category, action, label){
			if(!this._develop){
				if (window._gaq) {
		    		if(label) window._gaq.push(['_trackEvent', category, action, label]);
		    		else if(action) window._gaq.push(['_trackEvent', category, action]);
		    		else if(category) window._gaq.push(['_trackEvent', category]);
				}else{
					console.log('GA not load');
				}
			}else{
				var msg = 'develop mode, skip event sending GA event tracking: ';
				if(label) console.log(msg+category+', '+action+', '+label);
				else if(action) console.log(msg+category+', '+action);
				else if(category) console.log(msg+category);
			}
		},
		sendTrackUrl: function(url){
			if(!this._develop){
				if (window._gaq) {
		    		window._gaq.push(['_trackPageview', url]);
				}else{
					console.log('GA not load');
				}
			}else{
				console.log('develop mode, skip event sending GA url tracking: '+url);
			}
		},
		goPage: function(){
			var url = window.location.pathname + window.location.hash + "?open=" + isOpenNow();
			this.sendTrackUrl(url);
		}
/*		trackOrderProcess: function(page, action, data){
			var isOpen = isOpenNow()?"營業中":"休息中";
			if(page==="orderTab"){ // stage1
				var loc = data.loc;
				if(action==="enter"){
					this.sendTrackEvent(appVersion+" "+isOpen+" "+orderProcessString.Loc+" "+loc, orderProcessString.Entr);
					this.sendTrackEvent(appVersion+" "+isOpen+" "+orderProcessString.Loc+" "+loc.substring(0,3)+" 總計", orderProcessString.Entr);
					this.sendTrackEvent(appVersion+" "+isOpen+" "+orderProcessString.Loc+" "+" 總計", orderProcessString.Entr);
				}else if(action==="leave"){
					this.sendTrackEvent(appVersion+" "+isOpen+" "+orderProcessString.Loc+" "+loc, orderProcessString.LevA);
					this.sendTrackEvent(appVersion+" "+isOpen+" "+orderProcessString.Loc+" "+loc.substring(0,3)+" 總計", orderProcessString.LevA);
					this.sendTrackEvent(appVersion+" "+isOpen+" "+orderProcessString.Loc+" "+" 總計", orderProcessString.LevA);
				}
			}else if(page==="storePage"){
				var loc = data.loc;
				var chain = data.chain;
				if(action==="back"){
					
				}else if(action==="leave"){
					
				}else if(action==="clickProduct"){
					
				}else if(action==="addProduct"){
					
				}
			}else if(page==="orderInfoPage"){
			}else if(page==="userInfoPage"){
			}
		}*/
	};
	
	window.myapp = window.myapp || {};
	window.myapp.GoogleAnalytics = GoogleAnalytics;
})(	window.myapp.Settings.isOpenNow,
	window.myapp.Settings.appVersion);
