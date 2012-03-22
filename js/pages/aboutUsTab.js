// Filename: views/pages/aboutUsTab.js
(function(Scroller){
	var tabTemplate = [
		'<div id="content" data-scrollable="y" style="width:100%;">',
			"qqq",
		'</div>'
	].join('');
	
	var AboutUsTabView = Backbone.View.extend({
		initialize: function(){
			var scroller = new Scroller();
			scroller.html(_.template(tabTemplate));
			$(this.el).html(scroller.el);
			$(this.el).css('background-color', 'rgba(255, 255, 255, 0.75)');
			$(this.el).css('display', '-webkit-box');	
			$(this.el).css('-webkit-box-flex', '10');
			$(scroller.el).css('width', '100%');
		},
		events: {
  		},
		render: function(tab){
			return this;
	   }
	});
	
	window.myapp = window.myapp || {};
	window.myapp.AboutUsTabView = AboutUsTabView;
})(window.myapp.Widget.Scroller);
