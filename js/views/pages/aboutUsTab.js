// Filename: views/pages/aboutUsTab.js
(function(){
	var aboutUsTabTemplate = [
		'<div id="content" data-scrollable="y" style="width:100%;">',
			"qqq",
		'</div>'
	].join('');
	
	var AboutUsTabView = Backbone.View.extend({
		initialize: function(){
			this.render();
		},
		events: {
  		},
		render: function(tab){
			$(this.el).attr('id', 'container');
			$(this.el).css('background-color', 'rgba(255, 255, 255, 0.75)');
			$(this.el).css('overflow', 'hidden');
			$(this.el).html(_.template(aboutUsTabTemplate));
	   }
	});
	
	window.myapp = window.myapp || {};
	window.myapp.AboutUsTabView = AboutUsTabView;
})();
