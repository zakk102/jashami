// Filename: views/pages/historyTab.js
(function(){
	var historyTabTemplate = [
		'<div id="content" data-scrollable="y" style="width:100%;">',
			"hhhh",
		'</div>'
	].join('');
	
	var HistoryTabView = Backbone.View.extend({
		initialize: function(){
			this.render();
		},
		events: {
  		},
		render: function(){
			$(this.el).attr('id', 'container');
			$(this.el).css('background-color', 'rgba(255, 255, 255, 0.75)');
			$(this.el).css('overflow', 'hidden');
			$(this.el).html(_.template(historyTabTemplate));
	   }
	});
	
	window.myapp = window.myapp || {};
	window.myapp.HistoryTabView = HistoryTabView;
})();
