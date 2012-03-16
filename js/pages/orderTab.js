// Filename: js/pages/orderTab.js
(function(MenuData, Scroller, StoreBrief){
	var tabTemplate = [
			'<div class="StoreList"></div>'
	].join('');
	
	var OrderTabView = Backbone.View.extend({
		initialize: function(){
			var scroller = new Scroller();
			scroller.html(_.template(tabTemplate));
			$(this.el).html(scroller.render().el);
			$(this.el).css('background-color', 'rgba(255, 255, 255, 0.75)');
			$(this.el).css('display', '-webkit-box');	
			$(scroller.el).css('width', '100%');
			
			//test
			var that = this;
			var menudata = new MenuData();
			menudata.fetch({success:function(){
				window.menuData = menudata;
				_.each(menudata.get('stores').models, function(m, index){
					var storeBrief = new StoreBrief({model:m});
					$('.StoreList', that.el).append(storeBrief.render().el);
				});
				//re-fresh the scroller to know the new size of the scroller
				$('img', this.el).bind('load', function(){
					scroller.render();
				});
				scroller.render();
			}});
		},
		events: {
  		},
		render: function(){
			this.delegateEvents();
			return this;
		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.OrderTabView = OrderTabView;
})(	window.myapp.Model.MenuData,
	window.myapp.Widget.Scroller,
	window.myapp.View.StoreBrief);
