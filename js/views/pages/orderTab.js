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
		render: function(tab){
			$(this.el).html(_.template(orderTabTemplate));
			return this;
	   }
	});
	
	window.myapp = window.myapp || {};
	window.myapp.OrderTabView = OrderTabView;
})();
