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
			this.useTransitionEffect = false;
			this.firstPage = true;
			this.isGoBack = false;
			$('.BackButton').live("clickByTouch", function(){
				if(that.inTransition) return;
				that.isGoBack = true;
				window.history.back();
			});
	    },
		defaultAction: function(actions){
			this.startPage('orderTab');
		},
		startPage: function(tab){
			if(!this.views.startPage) this.views.startPage = new Views.StartPageView();
			if($('#startPageView').length) this.firstPage = true;
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
//					that.views.storePage.setModel(window.menuData.get('stores').get(store));
					that.changePage(that.views.storePage.render().el);
					that.views.storePage.refreshGridSize();
				}});
			}else{
				this.views.storePage.model = window.menuData.get('stores').get(store);
//				this.views.storePage.setModel(window.menuData.get('stores').get(store));
				this.changePage(this.views.storePage.render().el);
				this.views.storePage.refreshGridSize();
			}
		},
		changePage: function(el){
			// Collapse the keyboard
            $(':focus').blur();
            
			this.inTransition = true;
			if(!this.useTransitionEffect || this.firstPage){ // first rendered page, no change page animation
				$('.ActivePage').html(el);
				this.firstPage = false;
				this.inTransition = false;
			}else{
				var that = this;
				// prepare transition
				var from = $('.ActivePage').children();
				var to = $(el);
				from.css('position', 'absolute');
				to.css('position', 'absolute');
				$('.ActivePage').append(to);
				if(!this.isGoBack){
					to.css('left','100%');
					from.animate({
				    	left: '-100%',
				  	}, 300, 'ease-in-out', function(){
				  		from.remove();
				  	});
					to.animate({
				    	left: '0',
				  	}, 300, 'ease-in-out', function(){
				  		from.css('position', 'relative');
						to.css('position', 'relative');
				  		that.inTransition = false;
				  	});
				}else{
					to.css('left','-100%');
					from.animate({
				    	left: '100%',
				  	}, 300, 'ease-in-out', function(){
				  		from.remove();
				  	});
					to.animate({
				    	left: '0',
				  	}, 300, 'ease-in-out', function(){
				  		from.css('position', 'relative');
						to.css('position', 'relative');
				  		that.inTransition = false;
				  	});
				}
/*				
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
				var that = this;
				if(this.isGoBack){
					from.bind('webkitTransitionEnd', function(){
						from.unbind();
						// finish transition
						from.removeClass('transitionSlide transitionIn transitionOut reverse transitionStart');
						to.removeClass('transitionSlide transitionIn transitionOut reverse transitionStart');
						from.remove();
						setTimeout(function(){
							that.inTransition = false;
						},100);
					});
				}else{
					to.bind('webkitTransitionEnd', function(){
						to.unbind();
						// finish transition
						from.removeClass('transitionSlide transitionIn transitionOut reverse transitionStart');
						to.removeClass('transitionSlide transitionIn transitionOut reverse transitionStart');
						from.remove();
						that.inTransition = false;
						setTimeout(function(){
							that.inTransition = false;
						},100);
					});
				}
				
				// start transition
				setTimeout(function(){
					from.addClass('transitionStart'); 
					to.addClass('transitionStart');
				},10);				
*/				
				this.isGoBack = false;
			}
		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Router = AppRouter;
	
})(	window.myapp.Model.MenuData,
{	StartPageView:window.myapp.StartPageView,
	StorePageView:window.myapp.StorePageView
});