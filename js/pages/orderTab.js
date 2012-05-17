// Filename: js/pages/orderTab.js
(function(Images, LocalModel, Settings, Geolocation, Utils, MenuData, Scroller, StoreBrief, AddressSelector, NativeAddressSelector){
	var tabTemplate = [
			'<div class="district-panel"><div class="district-panel-inner">',
				'<div id="district-sticker1"></div>',
				'<div id="district-sticker2"></div>',
				'<div id="district-sticker1-shadow"></div>',
				'<div id="district-sticker2-shadow"></div>',
				'<div class="AddressSelector"></div>',
				'<div class="CircleButton"><span class="locating-txt">自動定位</span><span id="locating-icon" style="-webkit-mask-box-image:url('+Images["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_239_riflescope"]+');"></span></div>',
			'</div></div>',
			'<div id="stores-panel"></div>'
	].join('');
	
	var OrderTabView = Backbone.View.extend({
		initialize: function(){
			var that = this;
			this.scroller = new Scroller();
			 
			// $(this.el).append('<div class="district-panel"><div class="district-panel-inner"><div id="district-sticker1"></div><div id="district-sticker2"></div><div class="AddressSelector"></div><div class="CircleButton"><div class="locating-txt">自動定位</div><div id="locating-icon">⊙</div></div></div></div><div id="stores-panel">');s.scroller = scroller;
			
			$(this.el).html(_.template(tabTemplate));
			$('#stores-panel', this.el).css('-webkit-box-flex', '1');
			$('#stores-panel', this.el).append(this.scroller.render().el);
			// $(this.scroller.el).css('height', '100%');
			$(this.el).addClass('orderTab');
			
			this.itemWidth = Settings.getStoreBriefWidth($(window).width())-20;
			var ele = document.createElement('div');
			$(ele).addClass('StoreList clearfix masonry centered');
			$(this.scroller.content).append(ele);
			this.masonry = new Masonry( ele, {
				columnWidth: this.itemWidth,
				gutterWidth: Settings.StoreBriefHmargin,
		    	isFitWidth: true,
		    	isResizable: true
			});
			
			this.useNative(window.phonegapEnabled);
			//this.useNative(true);
			$(window).bind('useNative', function(e){
				that.useNative(e.data);
				that.loadDefaultMenu();
			});
			this.loadDefaultMenu();
		},
		loadDefaultMenu: function(){
			var that = this;
			var locaStatus = LocalModel.getLocationServiceStatus();
			var osType = Utils.DeviceType.getDeviceType();
			var last = LocalModel.getUserDistrict();
			//TODO load default menu
			if(window.phonegapEnabled){ // load from autoLocate
				// if(osType==Utils.DeviceType.Android){ // android, run autoLocate
					// this.autoLocate();
				// }else if(!locaStatus || locaStatus==null){ // not auth auto locate yet
					// if(last && last!=null && last.length>2){ // show last location
						// this.addressSelector.setSelection(last);
						// //TODO fix cannot catch location change event
						// window.myapp.location = last;
						// this.loadStore(window.addressAndZipcode.address2zipcode(last));
					// }else if(this.addressSelector.showSelector){ //show selecter
						// this.addressSelector.showSelector();
					// }
				// }else{ // auto locate auth OK or failed last time, run autoLocate
					// this.autoLocate(undefined, undefined, undefined, function(){
						// if(that.addressSelector.showSelector) that.addressSelector.showSelector();
					// });
				// }
				this.loadStore("260");
			}else if(osType==Utils.DeviceType.Other){ // load from last selection
				if(last && last!=null && last.length>2){
					this.addressSelector.setSelection(last);
					//TODO fix cannot catch location change event
					window.myapp.location = last;
					this.loadStore(window.addressAndZipcode.address2zipcode(last));
				}
			}
		},
		events: {
			"click .CircleButton":"autoLocate",
			"locationChange .AddressSelector":"locationChange"
  		},
  		autoLocate: function(event, data, successCallBack, errorCallBack){
  			var that = this;
  			if(window.loadingPanel) window.loadingPanel.connectionOut();
  			Geolocation.getCurrentPosition(function(location){
  				// save 
  				window.autoLocalization = window.autoLocalization || {};
  				window.autoLocalization.lat = location.latitude;
  				window.autoLocalization.lng = location.longitude;
  				LocalModel.setLocationServiceStatus('OK');
  				// get address
    			Geolocation.getAddressFromGeo(location.latitude, location.longitude, function(address){
    				if(window.loadingPanel) window.loadingPanel.connectionIn();
    				var addr = address.results[0].formatted_address;
    				window.autoLocalization.address = addr; // save
    				that.addressSelector.setSelection_zipcode(addr.substring(0,3));
    				if(successCallBack) successCallBack();
    			},function(error){
    				if(window.loadingPanel) window.loadingPanel.connectionIn();
    				console.log(error);
    				if(errorCallBack) errorCallBack();
    			});
    		},function(error){
    			if(window.loadingPanel) window.loadingPanel.connectionIn();
    			console.log(error);
    			LocalModel.setLocationServiceStatus('authFailed');
    			if(errorCallBack) errorCallBack();
    		});
  		},
  		locationChange: function(e){
  			var location = window.addressAndZipcode.zipcode2address(e.data);
  			window.myapp.location = location;
  			LocalModel.setUserDistrict(location);
  			this.loadStore(e.data);
  		},
  		loadStore: function(zipcode) {
  			if(!window.menuData){ window.menuData = new MenuData(); }
			var that = this;
			var menudata = window.menuData;
			menudata.getMenuByZipCode(zipcode, function(index){
				var stores = index.get('stores');
				stores.comparator = function(arg0, arg1){
					if(!window.autoLocalization){ //沒有定位，無法算距離
						if(arg0.get('chainStore')!=arg1.get('chainStore')){ // 不同連鎖
							return arg0.get('index')<arg1.get('index') ? -1 : 1;
						}else{ // 比外送額度
							var dl0 = arg0.get('deliveryLimit'), dl1 = arg1.get('deliveryLimit');
							return dl0==dl1 ? 0 : dl0<dl1? -1 : 1;
						}
					}else{
						if(arg0.get('chainStore')!=arg1.get('chainStore')){ // 不同連鎖
							return arg0.get('index')<arg1.get('index') ? -1 : 1;
						}else{
							//2.5公里以內比外送額度，2.5公里以外比距離
							//兩家店相差很近(1km以內)比外送額度
							var d1 = Utils.getDistanceFromLatLng(window.autoLocalization.lat, window.autoLocalization.lng, arg0.get('lat'), arg0.get('lng'));
							var d2 = Utils.getDistanceFromLatLng(window.autoLocalization.lat, window.autoLocalization.lng, arg1.get('lat'), arg1.get('lng'));
							if( (d1<2.5 && d2<2.5) || Math.abs(d1-d2)<1 ){
								var dl0 = arg0.get('deliveryLimit'), dl1 = arg1.get('deliveryLimit');
								if(dl0==dl1){ //外送額度一樣，比距離
									return d1==d2 ? 0 : d1<d2? -1 : 1;
								}else{
									return dl0==dl1 ? 0 : dl0<dl1? -1 : 1;
								}
							}else{
								return d1==d2 ? 0 : d1<d2? -1 : 1;
							}
						}
					}
				};
				stores.sort();
				$('.StoreList', that.el).empty();
				var itemCount = 0;
				var loadedImg = 0;
				var currentChain = '';
				_.each(stores.models, function(m, index){
					if(m.get('chainStore')==currentChain) return; // skip the stores in the same chain store
					var storeBrief = new StoreBrief({model:m}).render();
					storeBrief.$el.css('width', that.itemWidth+'px');
					$('.StoreList', that.el).append(storeBrief.el);
					currentChain = m.get('chainStore');
					itemCount ++;
				});
				
				//re-fresh the scroller to know the new size of the scroller
				//re-fresh masonry
				$('img', this.el).bind('load', function(){
					loadedImg ++;
					//if(loadedImg==itemCount){
						that.masonry.reload();
						that.scroller.render();
					//}
				});
				that.masonry.reload();
				that.scroller.render();
			},function(xhr, type){
				console.log(type);
			});
			
  		},
		render: function(){
			this.scroller.render();
			this.delegateEvents();
			return this;
		},
		useNative: function(isNative){
			var addressSelector;
			if(isNative){
				// address selector
				addressSelector = new NativeAddressSelector();
				// localization button
				$(".CircleButton", this.el).css("display", "");
			}else{
				// address selector
				addressSelector = new AddressSelector();
				// localization button
				$(".CircleButton", this.el).css("display", "none");
			}
			this.addressSelector = addressSelector;
			$('.AddressSelector', this.el).html(this.addressSelector.render().el);
		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.OrderTabView = OrderTabView;
	
})(	window.myapp.Images,
	window.myapp.LocalModel,
	window.myapp.Settings,
	window.myapp.PG.Geolocation,
	window.myapp.Utils,
	window.myapp.Model.MenuData,
	window.myapp.Widget.Scroller,
	window.myapp.View.StoreBrief,
	window.myapp.Widget.AddressSelector,
	window.myapp.Widget.NativeAddressSelector);