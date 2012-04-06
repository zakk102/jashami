// Filename: js/pages/orderTab.js
(function(Utils, MenuData, Scroller, StoreBrief){
	var tabTemplate = [
			'<div class="StoreList"></div>'
	].join('');
	
	var OrderTabView = Backbone.View.extend({
		initialize: function(){
			var scroller = new Scroller();
			this.scroller = scroller;
			scroller.html(_.template(tabTemplate));
			$(this.el).html(scroller.render().el);
			$(this.el).css('background-color', 'rgba(255, 255, 255, 0.75)');
			$(this.el).css('display', '-webkit-box');	
			$(this.el).css('-webkit-box-flex', '10');
			$(scroller.el).css('width', '100%');
			
			//test
			var that = this;
			var menudata = new MenuData();
			menudata.setAPI("getMenuByZipcode", {zipCode:100, isEditMode:false});
			menudata.fetch({success:function(){
				window.menuData = menudata;
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
				_.each(stores.models, function(m, index){
					var storeBrief = new StoreBrief({model:m});
					$('.StoreList', that.el).append(storeBrief.render().el);
				});
				//re-fresh the scroller to know the new size of the scroller
				$('img', this.el).bind('load', function(){
					scroller.render();
				});
				scroller.render();
			},error:function(originalModel, resp, options){
				console.log(resp.status);
			}});
		},
		events: {
  		},
		render: function(){
			this.scroller.render();
			this.delegateEvents();
			return this;
		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.OrderTabView = OrderTabView;
})(	window.myapp.Utils,
	window.myapp.Model.MenuData,
	window.myapp.Widget.Scroller,
	window.myapp.View.StoreBrief);
