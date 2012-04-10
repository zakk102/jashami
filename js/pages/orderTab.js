// Filename: js/pages/orderTab.js
(function(MenuData, Scroller, StoreBrief, AddressSelector){
	var tabTemplate = [
			'<div class="AddressSelector"></div>',
			'<div class="StoreList"></div>'
	].join('');
	
	var OrderTabView = Backbone.View.extend({
		initialize: function(){
			var location = "";
			var addressSelector = new AddressSelector({ model: {changeArea: this.loadStore} });
			var scroller = new Scroller();
			
			this.scroller = scroller;
			scroller.html(_.template(tabTemplate));
			$(this.el).html(scroller.render().el);
			$(this.el).css('background-color', 'rgba(255, 255, 255, 0.75)');
			$(this.el).css('display', '-webkit-box');	
			$(this.el).css('-webkit-box-flex', '10');
			$(scroller.el).css('width', '100%');
			
			$('.AddressSelector', this.el).html(addressSelector.render().el);
			
			this.loadStore({'currentTarget':{'value': location}});
		},
		events: {
  		},
  		loadStore: function(e) {
  			var location = e.currentTarget.value;
  			var that = this;
  			
			if(!window.menuData) window.menudata = new MenuData();
			window.menudata.setLocation(location);
			window.menudata.fetch({success:function(){
				_.each(window.menudata.get('stores').models, function(m, index){
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
		render: function(){
			this.scroller.render();
			this.delegateEvents();
			return this;
		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.OrderTabView = OrderTabView;
})(	window.myapp.Model.MenuData,
	window.myapp.Widget.Scroller,
	window.myapp.View.StoreBrief,
	window.myapp.Widget.AddressSelector);
