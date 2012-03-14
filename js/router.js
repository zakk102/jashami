// Filename: router.js
(function(StartPageView){
	var AppRouter = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'startPage/:tab': 'startPage',
			// Default
			'*actions': 'defaultAction'
		},
		initialize:function () {
			this.views = {};	
	    },
		defaultAction: function(actions){
			this.startPage('orderTab');
		},
		startPage: function(tab){
			if(!this.views.startPage) this.views.startPage = new StartPageView();
			$('.ActivePage').html(this.views.startPage.render().el);
			this.views.startPage.toTab(tab);
		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Router = AppRouter;
})(window.myapp.StartPageView);
