// Filename: router.js
(function(OrderServiceUrl, MenuData, LoadingPanel, Views){
	var TransitionEffectTypes = 'hSlide';
	var AppRouter = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'startPage/:tab': 'startPage',
			'storePage/:store': 'storePage',
			'storePage/:store/:product': 'productPage',
			'oderInfoPage/:store': 'orderInfoPage',
			'userInfoPage/:store': 'userInfoPage',
			// Default
			'*actions': 'defaultAction'
		},
		initialize:function () {
			// loading panel
			window.loadingPanel = new LoadingPanel();
			$('body').append(window.loadingPanel.el);
			// settings
			var that = this;
			this.views = {};
			window.useTransitionEffect = true;
			window.lastUrl = window.location.href;
			// pre-load pages
			this.views.startPage = new Views.StartPageView();
			this.loadToDOM(this.views.startPage.el);
			this.views.storePage = new Views.StorePageView();
			this.loadToDOM(this.views.storePage.el);
			// determine transition type & direction
			$(window).bind('hashchange', function(e){
				var newUrl, oldUrl;
				if(e.newURL){
					newUrl = e.newURL;
					oldUrl = e.oldURL;
				}else{ // if not support e.newUrl
					newUrl = window.location.href;
					oldUrl = window.lastUrl;
					window.lastUrl = newUrl;
				}
//				console.log('hashchange from '+oldUrl+" to "+newUrl);
				if(newUrl.indexOf('#startPage')>=0 || newUrl.indexOf('#')<0){ // to start page
					that.transitionEffectType = 'hSlide';
					if(oldUrl.indexOf('#storePage')>=0){ //from store page, slide from left
						that.transitionDir = 'left';
					}
				}else if(newUrl.indexOf('#storePage')>=0){ // to store page
					that.transitionEffectType = 'hSlide';
					if(oldUrl.indexOf('#startPage')>=0  || oldUrl.indexOf('#')<0){ // from start page, slide from right
						that.transitionDir = 'right';
					}
				}else if(newUrl.indexOf('#oderInfoPage')>=0){ // to order info page
					that.transitionEffectType = 'hSlide';
					if(oldUrl.indexOf('#storePage')>=0){ // from store page, slide from right
						that.transitionDir = 'right';
					}
				}else if(newUrl.indexOf('#userInfoPage')>=0){ // to order info page
					that.transitionEffectType = 'hSlide';
					if(oldUrl.indexOf('#oderInfoPage')>=0){ // from order info page, slide from right
						that.transitionDir = 'right';
					}
				}
			});
	    },
		defaultAction: function(){
			this.startPage('orderTab');
		},
		startPage: function(tab){
			if(!this.views.startPage){ // load the page into DOM
				this.views.startPage = new Views.StartPageView();
				this.loadToDOM(this.views.startPage.el);
			}
			if(window.productPanel){ // product panel
				window.productPanel.$el.hide();
			}
			this.changePage(this.views.startPage.render().el, this.transitionEffectType, this.transitionDir);
			this.transitionEffectType = null;
			this.transitionDir = null;
			this.views.startPage.toTab(tab);
		},
		storePage: function(store){
			if(!this.views.storePage){ // load the store page into DOM
				this.views.storePage = new Views.StorePageView();
				this.loadToDOM(this.views.storePage.el);
			}
			if(window.productPanel){ // product panel
				window.productPanel.$el.hide();
			}
			var that = this;
			if(that.views.storePage.$el.attr('url')==window.location.href){ // the same store page, no need to refresh data
				that.changePage(that.views.storePage.el, that.transitionEffectType, that.transitionDir);
				that.transitionEffectType = null;
				that.transitionDir = null;
				that.views.storePage.render();
				return;
			}
			that.changePage(that.views.storePage.el, that.transitionEffectType, that.transitionDir);
			that.transitionEffectType = null;
			that.transitionDir = null;
			if(!window.menuData){
				//only occur in the direct access to store page
				window.menuData = new MenuData();
				window.menuData.getMenuByZipCode('110', function(index){
					that.views.storePage.resetDisplayedData();
					that.views.storePage.refreshGridSize();
					that.views.storePage.resetScroller();
					that.views.storePage.setModel(window.menuData.get('stores').get(store));
					if(!that.views.orderInfoPage){ // pre-load the order info page into DOM
						that.views.orderInfoPage = new Views.OrderInfoPageView();
						that.loadToDOM(that.views.orderInfoPage.el);
					}
				},function(xhr, type){
					console.log(type);
				});
			}else{
				that.views.storePage.resetDisplayedData();
				that.views.storePage.refreshGridSize();
				that.views.storePage.resetScroller();
				that.views.storePage.setModel(window.menuData.get('stores').get(store));
				if(!that.views.orderInfoPage){ // pre-load the order info page into DOM
					that.views.orderInfoPage = new Views.OrderInfoPageView();
					that.loadToDOM(that.views.orderInfoPage.el);
				}
			}
		},
		productPage: function(store, product){
			// product panel
			if(!window.productPanel){
				window.productPanel = new ProductPanel();
				$('body').append(window.productPanel.$el);
			}
			// set product panel hidden callback
			var that = this;
			//TODO: if jump to this url directly, need to define some button callback actions to render views
/*			window.productPanel.callback = function(){
				//TODO: show store page content
				// url modify
				Backbone.history.navigate("#storePage/"+store, {trigger: false, replace: true});
			};
*/
			// show product panel
			window.productPanel.$el.show();
			// load store page in background
			this.changePage(this.views.storePage.el);
		},
		orderInfoPage: function(store){
			if(!this.views.orderInfoPage){ // load the orderInfo page into DOM
				this.views.orderInfoPage = new Views.OrderInfoPageView();
				this.loadToDOM(this.views.orderInfoPage.el);
			}
			
			if(this.views.orderInfoPage){
				if(!window.orderInfoPage){
					window.orderInfoPage = this.views.orderInfoPage;
				}
			}
			
			this.changePage(this.views.orderInfoPage.render().el, this.transitionEffectType, this.transitionDir);
			this.transitionEffectType = null;
			this.transitionDir = null;
			// set store menu data
			var that = this;
			if(!window.menuData){
				window.menuData = new MenuData();
				window.menuData.fetch({success:function(){
					that.views.orderInfoPage.setModel(window.menuData.get('stores').get(store));
					if(!that.views.userInfoPage){ // pre-load the user info page into DOM
						that.views.userInfoPage = new Views.UserInfoPageView();
						that.loadToDOM(that.views.userInfoPage.el);
					}
				}});
			}else{
				that.views.orderInfoPage.setModel(window.menuData.get('stores').get(store));
				if(!that.views.userInfoPage){ // pre-load the user info page into DOM
					that.views.userInfoPage = new Views.UserInfoPageView();
					that.loadToDOM(that.views.userInfoPage.el);
				}
			}
		},
		userInfoPage: function(store){
			var that = this;
			if(!this.views.userInfoPage){ // load the userInfo page into DOM
				this.views.userInfoPage = new Views.UserInfoPageView();
				this.loadToDOM(this.views.userInfoPage.el);
			}
			this.views.userInfoPage.setAvailableTime([]);
			if(window.loadingPanel) window.loadingPanel.connectionOut();
			$.ajax({
				type: 'GET',
				url: OrderServiceUrl+'?action=getAvailableDeliveryTime&storeID='+store,
				dataType: 'json',
				success: function(data){
					if(window.loadingPanel) window.loadingPanel.connectionIn();
					that.views.userInfoPage.setAvailableTime(data.time);
				},
				error: function(xhr, type){
					if(window.loadingPanel) window.loadingPanel.connectionIn();
				}
			});
			this.changePage(this.views.userInfoPage.render().el, this.transitionEffectType, this.transitionDir);
			this.transitionEffectType = null;
			this.transitionDir = null;
			this.views.userInfoPage.render();
		},
		loadToDOM: function(el){
			var id = $(el).attr('id');
			if($('#'+id).length>0){
				console.log('page '+id+' has already loaded');
				return;
			}
			$(el).hide();
			$('#mainRoot').append(el);
		},
		changePage: function(el, effectType, effectDir){
			// Collapse the keyboard
            $(':focus').blur();
            
			var from = $(this.currentActivePage);
			var to = $(el);
			to.attr('url',window.location.href); // set url
			if(from==to || from.attr('url')==to.attr('url')) return;
			
			window.inTransition = true;
			if(!window.useTransitionEffect || !effectType || TransitionEffectTypes.indexOf(effectType)<0){ // no change page animation
				from.hide();
				to.show();
            	this.currentActivePage = to;
				window.inTransition = false;
			}else if(effectType=='hSlide'){
				var that = this;
				// prepare transition
				from.css('position', 'absolute');
				to.css('position', 'absolute');
				to.show();
				if(effectDir=='right'){
					to.css('-webkit-transform','translate3d(100%, 0, 0)');
					from.css('-webkit-transform','translate3d(0, 0, 0)');
					from.animate({
				    	'-webkit-transform': 'translate3d(-100%, 0, 0)',
				  	}, 300, 'ease-in-out', function(){
				  		from.hide();
				  	});
					to.animate({
				    	'-webkit-transform': 'translate3d(0, 0, 0)',
				  	}, 300, 'ease-in-out', function(){
						that.currentActivePage = to;
				  		window.inTransition = false;
				  	});
				}else{
					to.css('-webkit-transform','translate3d(-100%, 0, 0)');
					from.css('-webkit-transform','translate3d(0, 0, 0)');
					from.animate({
				    	'-webkit-transform': 'translate3d(100%, 0, 0)',
				  	}, 300, 'ease-in-out', function(){
				  		from.hide();
				  	});
					to.animate({
				    	'-webkit-transform': 'translate3d(0, 0, 0)',
				  	}, 300, 'ease-in-out', function(){
						that.currentActivePage = to;
				  		window.inTransition = false;
				  	});
				  	window.isGoBack = false;
				}				
			}
		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Router = AppRouter;
	
})(	window.myapp.Api.OrderServiceUrl,
	window.myapp.Model.MenuData,
	window.myapp.Widget.LoadingPanel,
{	StartPageView:window.myapp.StartPageView,
	StorePageView:window.myapp.StorePageView,
	OrderInfoPageView:window.myapp.OrderInfoPageView,
	UserInfoPageView:window.myapp.UserInfoPageView
});


/*
					to.css('-webkit-transform','translate3d(100%, 0, 0)');
					to.css('-webkit-transition-property','-webkit-transform');
					to.css('-webkit-transition-duration','300ms');
					to.css('-webkit-transition-timing-function','ease-in-out');
					to.bind('webkitTransitionEnd', function(){
						to.css('-webkit-transition-property','initial');
						to.css('-webkit-transition-duration','initial');
						that.currentActivePage = to;
				  		window.inTransition = false;
				  		to.unbind();
					});
					from.css('-webkit-transform','translate3d(0, 0, 0)');
					from.css('-webkit-transition-property','-webkit-transform');
					from.css('-webkit-transition-duration','300ms');
					from.css('-webkit-transition-timing-function','ease-in-out');
					from.bind('webkitTransitionEnd', function(){
						from.css('-webkit-transition-property','initial');
						from.css('-webkit-transition-duration','initial');
						from.hide();
						from.unbind();
					});
					// start transition
					to.css('-webkit-transform','translate3d(0, 0, 0)');
					from.css('-webkit-transform','translate3d(-100%, 0, 0)');

 */