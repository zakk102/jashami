// Filename: views/pages/aboutUsTab.js
(function(){
	var aboutUsTabTemplate = [
		"qqq"
	].join('');
	
	var AboutUsTabView = Backbone.View.extend({
		initialize: function(){
			this.render();
		},
		events: {
  		},
		render: function(tab){
			$(this.el).html(_.template(aboutUsTabTemplate));
			return this;
	   }
	});
	
	window.myapp = window.myapp || {};
	window.myapp.AboutUsTabView = AboutUsTabView;
})();
