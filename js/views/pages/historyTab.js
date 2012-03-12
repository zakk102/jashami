// Filename: views/pages/historyTab.js
(function(){
	var historyTabTemplate = [
		"hhhhhhh"
	].join('');
	
	var HistoryTabView = Backbone.View.extend({
		initialize: function(){
			this.render();
		},
		events: {
  		},
		render: function(tab){
			$(this.el).html(_.template(historyTabTemplate));
			return this;
	   }
	});
	
	window.myapp = window.myapp || {};
	window.myapp.HistoryTabView = HistoryTabView;
})();
