// Filename: router.js
(function(mainHomeView){
	var AppRouter = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'startPage/:tab': 'startPage',
			// Default
			'*actions': 'defaultAction'
		},
		initialize:function () {
	        $('.back').live('click', function(event) {
	            window.history.back();
	            return false;
	        });
	        this.firstPage = true;
	
	    },
		defaultAction: function(actions){
			this.startPage('orderTab');
		},
		startPage: function(tab){
			var uuu = new mainHomeView();
			uuu.render(tab);
			$('#mainRoot').html(uuu.el);
//			var iscrolljj = new iScroll('container', { vScroll: true, hScroll: true, hScrollbar: true, vScrollbar: true });
			EasyScroller.init();
		},
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
	    }
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Router = AppRouter;
})(window.myapp.MainHomeView);
