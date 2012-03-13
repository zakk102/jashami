// Filename: views/pages/orderTab.js
(function(){
	var orderTabTemplate = [
		'<div id="content" data-scrollable="y" style="width:100%;">',
			"wewefwefwsdsdf",
		'</div>'
	].join('');
	
	var OrderTabView = Backbone.View.extend({
		initialize: function(){
			this.render();
		},
		events: {
  		},
		render: function(tab){
			$(this.el).attr('id', 'container');
			$(this.el).css('background-color', 'rgba(255, 255, 255, 0.75)');
			$(this.el).css('overflow', 'hidden');
			$(this.el).html(_.template(orderTabTemplate));
	   }
	});
	
	window.myapp = window.myapp || {};
	window.myapp.OrderTabView = OrderTabView;
})();
