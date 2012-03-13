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
/*	        $('.back').live('click', function(event) {
	            window.history.back();
	            return false;
	        });
	        this.firstPage = true;
*/
			this.views = {};	
	    },
		defaultAction: function(actions){
			this.startPage('orderTab');
		},
		startPage: function(tab){
			if(!this.views.startPage) this.views.startPage = new StartPageView();
			$('.ActivePage').html(this.views.startPage.el);
			this.views.startPage.toTab(tab);
//			var iscrolljj = new iScroll('container', { vScroll: true, hScroll: true, hScrollbar: true, vScrollbar: true });
			EasyScroller.init();
		}/*,
		changePage:function (page) {
	        $(page.el).attr('data-role', 'page');
	        page.render();
	        $('body').append($(page.el));
	        var transition = $.mobile.defaultPageTransition;
	        // We don't want to slide the first page
	        if (this.firstPage) {
	            transition = 'none';
	            this.firstPage = false;
	        }
	        $.mobile.changePage($(page.el), {changeHash:false, transition: transition});
	    }*/
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Router = AppRouter;
})(window.myapp.StartPageView);
