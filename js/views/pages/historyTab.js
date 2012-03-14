// Filename: views/pages/historyTab.js
(function(Scroller){
	var tabTemplate = [
		'<div id="content" data-scrollable="y" style="width:100%;">',
			"hhhh",
		'</div>'
	].join('');
	
	var HistoryTabView = Backbone.View.extend({
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
			return this;
	    }
	});
	
	window.myapp = window.myapp || {};
	window.myapp.HistoryTabView = HistoryTabView;
})(window.myapp.Widget.Scroller);
