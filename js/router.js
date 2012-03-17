// Filename: router.js
(function(MenuData, Views){
	var AppRouter = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'startPage/:tab': 'startPage',
			'storePage/:store': 'storePage',
			// Default
			'*actions': 'defaultAction'
		},
		initialize:function () {
			var that = this;
			this.views = {};
			this.useTransitionEffect = true;
			this.firstPage = true;
			this.isGoBack = false;
	    },
		defaultAction: function(actions){
			this.startPage('orderTab');
		},
		startPage: function(tab){
			if(!this.views.startPage) this.views.startPage = new Views.StartPageView();
			this.views.startPage.toTab(tab);
			this.changePage(this.views.startPage.render().el);
		},
		storePage: function(store){
			if(!this.views.storePage) this.views.storePage = new Views.StorePageView();
			if(!window.menuData){
				var that = this;
				window.menuData = new MenuData();
				window.menuData.fetch({success:function(){
					that.views.storePage.model = window.menuData.get('stores').get(store);
					that.changePage(that.views.storePage.render().el);
				}});
			}else{
				this.views.storePage.model = window.menuData.get('stores').get(store);
				this.changePage(this.views.storePage.render().el);
			}
		},
		changePage: function(el){
			if(!this.useTransitionEffect || this.firstPage){ // first rendered page, no change page animation
				$('.ActivePage').html(el);
				this.firstPage = false;
			}else{
				// prepare transition
				var from = $('.ActivePage').children();
				var to = $(el);
				from.addClass('transitionSlide transitionOut');
				to.addClass('transitionSlide transitionIn');
				if(this.isGoBack){ // reverse
					from.addClass('reverse');
					to.addClass('reverse');
				}
				$('.ActivePage').append(el);
				// register transition end event
				if(this.isGoBack){
					from.bind('webkitTransitionEnd', function(){
						from.unbind();
						// finish transition
						from.removeClass('transitionSlide transitionOut reverse transitionStart');
						to.removeClass('transitionSlide transitionIn reverse transitionStart');
						from.remove();
					});
				}else{
					to.bind('webkitTransitionEnd', function(){
						to.unbind();
						// finish transition
						from.removeClass('transitionSlide transitionOut reverse transitionStart');
						to.removeClass('transitionSlide transitionIn reverse transitionStart');
						from.remove();
					});
				}
				
				// start transition
				setTimeout(function(){
					from.addClass('transitionStart'); 
					to.addClass('transitionStart');
				},10);
				
				this.isGoBack = false;
			}
			// bind events: zepto's $.live is broken in webkit browser
			var that = this;
			$('.BackButton').bind("click", function(){
				that.isGoBack = true;
				window.history.back();
			});
			$('.TabHeader a').bind('click', function(){
				that.firstPage = true;
			});
		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Router = AppRouter;
	
})(	window.myapp.Model.MenuData,
{	StartPageView:window.myapp.StartPageView,
	StorePageView:window.myapp.StorePageView
});