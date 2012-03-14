// Filename: views/pages/orderTab.js
(function(Scroller){
	var tabTemplate = [
			"wewefwefwsdsdf"
	].join('');
	
	var OrderTabView = Backbone.View.extend({
		initialize: function(){
			var scroller = new Scroller();
			scroller.html(_.template(tabTemplate));
			$(this.el).html(scroller.el);
			$(this.el).css('background-color', 'rgba(255, 255, 255, 0.75)');
			$(this.el).css('display', '-webkit-box');	
			$(scroller.el).css('width', '100%');
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
})(window.myapp.Widget.Scroller);
