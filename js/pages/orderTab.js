// Filename: js/pages/orderTab.js
(function(Settings, Geolocation, Utils, MenuData, Scroller, StoreBrief, AddressSelector, NativeAddressSelector){
	var tabTemplate = [
			'<div class="district-panel"><div class="district-panel-inner">',
				'<div id="district-sticker1"></div>',
				'<div id="district-sticker2"></div>',
				'<div class="AddressSelector"></div>',
				'<div class="CircleButton"><div class="locating-txt">自動定位</div><div id="locating-icon">⊙</div></div>',
			'</div></div>',
			'<div id="stores-panel"></div>'
	].join('');
	
	var OrderTabView = Backbone.View.extend({
		initialize: function(){
			this.loadStore("110");

			var that = this;
			this.scroller = new Scroller();
			 
			// $(this.el).append('<div class="district-panel"><div class="district-panel-inner"><div id="district-sticker1"></div><div id="district-sticker2"></div><div class="AddressSelector"></div><div class="CircleButton"><div class="locating-txt">自動定位</div><div id="locating-icon">⊙</div></div></div></div><div id="stores-panel">');s.scroller = scroller;
			
			$(this.el).html(_.template(tabTemplate));
			$('#stores-panel', this.el).css('-webkit-box-flex', '1');
			$('#stores-panel', this.el).append(this.scroller.render().el);
			// $(this.scroller.el).css('height', '100%');
			$(this.el).addClass('orderTab');
			
			this.itemWidth = Settings.getStoreBriefWidth($(window).width());
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
			});
		},
		events: {
			"click .CircleButton":"autoLocate",
			"locationChange .AddressSelector":"locationChange"
  		},
  		autoLocate: function(){
  			var that = this;
  			if(window.loadingPanel) window.loadingPanel.connectionOut();
  			Geolocation.getCurrentPosition(function(location){
  				// save 
  				window.autoLocalization = window.autoLocalization || {};
  				window.autoLocalization.lat = location.latitude;
  				window.autoLocalization.lng = location.longitude;
  				// get address
    			Geolocation.getAddressFromGeo(location.latitude, location.longitude, function(address){
    				var addr = address.results[0].formatted_address;
    				window.autoLocalization.address = addr; // save
    				that.addressSelector.setSelection_zipcode(addr.substring(0,3));
    				if(window.loadingPanel) window.loadingPanel.connectionIn();
    			},function(error){
    				console.log(error);
    				if(window.loadingPanel) window.loadingPanel.connectionIn();
    			});
    		},function(error){
    			console.log(error);
    			if(window.loadingPanel) window.loadingPanel.connectionIn();
    		});
  		},
  		locationChange: function(e){
  			var location = window.addressAndZipcode.zipcode2address(e.data);
  			window.myapp.location = location;
  			this.loadStore(e.data);
  		},
  		loadStore: function(zipcode) {
  			if(!window.menuData){ window.menuData = new MenuData(); }
			var that = this;
			var menudata = window.menuData;
			menudata.getMenuByZipCode(zipcode, function(index){
				var stores = index.get('stores');
				stores.comparator = function(arg0, arg1){
					if(!menudata._lat || !menudata._lng){ //沒有定位，無法算距離
						if(arg0.get('chainStore')!=arg1.get('chainStore')){ // 不同連鎖
							//return arg0.get('index').localeCompare(arg1.get('index'));
							return arg0.get('index')<arg1.get('index') ? -1 : 1;
						}else{ // 比外送額度
							var dl0 = arg0.get('deliveryLimit'), dl1 = arg1.get('deliveryLimit');
							return dl0==dl1 ? 0 : dl0<dl1? -1 : 1;
						}
					}else{
						if(!arg0.get('chainStore')==arg1.get('chainStore')){ // 不同連鎖
							//return arg0.get('index').localeCompare(arg1.get('index'));
							return arg0.get('index')<arg1.get('index') ? -1 : 1;
						}else{
							//2.5公里以內比外送額度，2.5公里以外比距離
							//兩家店相差很近(1km以內)比外送額度
							var d1 = Utils.getDistanceFromLatLng(menudata._lat, menudata._lng, arg0.get('lat'), arg0.get('lng'));
							var d2 = Utils.getDistanceFromLatLng(menudata._lat, menudata._lng, arg1.get('lat'), arg1.get('lng'));
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
				that._itemCount = stores.models.length;
				that._loadedImg = 0;
				_.each(stores.models, function(m, index){
					var storeBrief = new StoreBrief({model:m}).render();
					storeBrief.$el.css('width', that.itemWidth+'px');
					$('.StoreList', that.el).append(storeBrief.el);
				});
				
				//re-fresh the scroller to know the new size of the scroller
				//re-fresh masonry
				$('img', this.el).bind('load', function(){
					that._loadedImg ++;
					if(that._loadedImg==that._itemCount){
						that.masonry.reload();
						that.scroller.render();
					}
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
})(	window.myapp.Settings,
	window.myapp.PG.Geolocation,
	window.myapp.Utils,
	window.myapp.Model.MenuData,
	window.myapp.Widget.Scroller,
	window.myapp.View.StoreBrief,
	window.myapp.Widget.AddressSelector,
	window.myapp.Widget.NativeAddressSelector);


/*
			var that = this;
			var menudata = new MenuData();
			//menudata.setAPI("getMenuByZipcode", {zipCode:zipcode, isEditMode:false});
			menudata.setAPI("getWholeMenu", {isEditMode:true});
			if(window.loadingPanel) window.loadingPanel.connectionOut();
			menudata.fetch({success:function(model, resp){
				//test
				if(window.phonegapEnabled){
					window.myapp.PG.File.read(zipcode+".txt", function(text){
						console.log(text.substring(0,20));
					},function(error){
						console.log(error.code);
					});
				}
				return;
				// write to file
				if(window.phonegapEnabled){
					window.myapp.PG.File.write(zipcode+".txt", JSON.stringify(resp), function(){
						console.log("write success");
					},function(error){
						console.log(error.code);
					});
				}
				if(window.loadingPanel) window.loadingPanel.connectionIn();
				window.menuData = model;
				// sort store by index, deliveryLimit and Distance
				var stores = menudata.get('stores');
				stores.comparator = function(arg0, arg1){
					if(!menudata._lat || !menudata._lng){ //沒有定位，無法算距離
						if(arg0.get('chainStore')!=arg1.get('chainStore')){ // 不同連鎖
							return arg0.get('index').localeCompare(arg1.get('index'));
						}else{ // 比外送額度
							var dl0 = arg0.get('deliveryLimit'), dl1 = arg1.get('deliveryLimit');
							return dl0==dl1 ? 0 : dl0<dl1? -1 : 1;
						}
					}else{
						if(!arg0.get('chainStore')==arg1.get('chainStore')){ // 不同連鎖
							return arg0.get('index').localeCompare(arg1.get('index'));
						}else{
							//2.5公里以內比外送額度，2.5公里以外比距離
							//兩家店相差很近(1km以內)比外送額度
							var d1 = Utils.getDistanceFromLatLng(menudata._lat, menudata._lng, arg0.get('lat'), arg0.get('lng'));
							var d2 = Utils.getDistanceFromLatLng(menudata._lat, menudata._lng, arg1.get('lat'), arg1.get('lng'));
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
				_.each(stores.models, function(m, index){
					var storeBrief = new StoreBrief({model:m});
					$('.StoreList', that.el).append(storeBrief.render().el);
				});
				//re-fresh the scroller to know the new size of the scroller
				$('img', this.el).bind('load', function(){
					that.scroller.render();
				});
				that.scroller.render();
			},error:function(originalModel, resp, options){
				if(window.loadingPanel) window.loadingPanel.connectionIn();
				console.log(resp.status);
				// try to read from file
				
			}});
*/
