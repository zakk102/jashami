(function(addressAndZipcode, isOpenNow, appVersion){
	
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
	
	var orderProcessStage = {
		"1":"讀取菜單",
		"2":"進入商家",
		"3":"放入購物車",
		"4":"進入購物車",
		"5":"填資料",
		"6":"訂購完成"
	};
	
	var GoogleAnalytics = {
		sendTrackEvent: function(category, action, label){
			if(!window._develop){
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
			if(!window._develop){
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
			var url = window.location.pathname + decodeURIComponent(window.location.hash) + "?open=" + isOpenNow() +"&v="+appVersion;
			this.sendTrackUrl(url);
		},
		trackAppVersion: function(){
			this.sendTrackEvent("網頁版本", appVersion);
		},
		trackAutoLocalzation_zipCode: function(zipCode){
			var addr = addressAndZipcode.zipcode2address(zipCode);
			if(!addr) this.sendTrackEvent("自動定位", "其他", zipCode);
			else this.trackAutoLocalzation(addr.substring(0,3), addr.substring(3));
		},
		trackAutoLocalzation: function(country, area){
			this.sendTrackEvent("自動定位", country, area);
		},
		trackGetMenuArea_zipcode: function(zipCode){
			var addr = addressAndZipcode.zipcode2address(zipCode);
			if(!addr) this.sendTrackEvent("讀取菜單區域", "其他", zipCode);
			else this.trackGetMenuArea(addr.substring(0,3), addr.substring(3));
		},
		trackGetMenuArea: function(country, area){
			this.sendTrackEvent("讀取菜單區域", country, area);
		},
		trackOpenTime: function(){
			var d = new Date();
			this.sendTrackEvent("開啓app時間", isOpenNow()?"營業中":"休息中", d.getHours()+"");
		},
		trackIntoUserInfoPageTime: function(chainStore){
			var d = new Date();
			this.sendTrackEvent("進入填資料頁時間", chainStore, d.getHours()+"");
		},
		trackSendOrderTime: function(chainStore){
			var d = new Date();
			this.sendTrackEvent("送出訂單時間", chainStore, d.getHours()+"");
		},
		trackIntoStorePageTime: function(chainStore){
			var d = new Date();
			this.sendTrackEvent("瀏覽菜單時間", chainStore, d.getHours()+"");
		},
		trackOrderProcess: function(stage, para){
			var open = isOpenNow()?"營業中":"休息中";
			if(para) this.sendTrackEvent("購物流程 "+open, orderProcessStage[stage+""], para);
			else this.sendTrackEvent("購物流程 "+open, orderProcessStage[stage+""]);
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
})(	window.addressAndZipcode,
	window.myapp.Settings.isOpenNow,
	window.myapp.Settings.appVersion);
