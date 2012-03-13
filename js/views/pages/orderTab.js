// Filename: views/pages/orderTab.js
(function(){
	var orderTabTemplate = [
			"wewefwefwsdsdf"
	].join('');
	
	var OrderTabView = Backbone.View.extend({
		initialize: function(){
			this.render();
		},
		events: {
  		},
		render: function(){
			var scroller = new window.myapp.Widget.Scroller();
			scroller.html(_.template(orderTabTemplate));
			this.el = scroller.el;
			$(this.el).css('background-color', 'rgba(255, 255, 255, 0.75)');
	   }
	});
	
	window.myapp = window.myapp || {};
	window.myapp.OrderTabView = OrderTabView;
})();
