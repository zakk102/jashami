// Filename: router.js
(function(GoogleAnalytics, OrderServiceUrl, MenuData, LoadingPanel, Views){
	var TransitionEffectTypes = 'hSlide';
	var AppRouter = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'startPage/:tab': 'startPage',
			'startPage/orderTab/:location': 'orderTab',
			'storePage/:store': 'storePage',
			'storePage/:store/:product': 'productPage',
			'orderInfoPage/:store': 'orderInfoPage',
			'orderInfoPage/:store/:index': 'orderEditPage',
			'userInfoPage/:store': 'userInfoPage',
			'orderResultPage/:store': 'orderResultPage',
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
			// App event tracking: first page
			window.myapp.AppEvent.goPage();
			window.myapp.GoogleAnalytics.goPage();
	    },
		defaultAction: function(){
			//console.log('do default action.');
			this.startPage('orderTab');
		},
		startPage: function(tab){
			try{
				if(!this.views.startPage){ // load the page into DOM
					this.views.startPage = new Views.StartPageView();
					this.loadToDOM(this.views.startPage.el);
				}
				if(window.productPanel){ // product panel
					window.productPanel.$el.hide();
				}
				this.changePage(this.views.startPage.render().el);
				this.transitionEffectType = null;
				this.transitionDir = null;
				this.views.startPage.toTab(tab);
			}catch(err){
				$(window).trigger('tryCatchError', {errorMsg:err.message+" at function startPage in router", errorLocation:err.stack});
				throw err;
			}
		},
		orderTab: function(location){
			try{
				this.startPage('orderTab');
				if(location.length==3){
					this.views.startPage.tabs.orderTab.assignLocation_zipcode(location);
				}else{
					this.views.startPage.tabs.orderTab.assignLocation(location);
				}
			}catch(err){
				$(window).trigger('tryCatchError', {errorMsg:err.message+" at function startPage in router", errorLocation:err.stack});
				throw err;
			}
		},
		storePage: function(store){
			try{
				if(!this.views.storePage){ // load the store page into DOM
					this.views.storePage = new Views.StorePageView();
					this.loadToDOM(this.views.storePage.el);
				}
				if(window.productPanel){ // product panel
					window.productPanel.$el.hide();
				}
				var that = this;
				if(that.views.storePage.$el.attr('url')==window.location.href){ // the same store page, no need to refresh data
					that.changePage(that.views.storePage.el);
					that.transitionEffectType = null;
					that.transitionDir = null;
					that.views.storePage.render();
					return;
				}
				that.changePage(that.views.storePage.el);
				that.transitionEffectType = null;
				that.transitionDir = null;
				that.views.storePage.render();
				if(!window.menuData){
					//only occur in the direct access to store page
					window.menuData = new MenuData();
				}
				window.menuData.getMenuOfStore(store, function(s){
					that.views.storePage.resetDisplayedData();
					that.views.storePage.refreshGridSize();
					that.views.storePage.setModel(s);
					that.views.storePage.resetScroller();
					if(!that.views.orderInfoPage){ // pre-load the order info page into DOM
						that.views.orderInfoPage = new Views.OrderInfoPageView();
						that.loadToDOM(that.views.orderInfoPage.el);
						window.orderInfoPage = that.views.orderInfoPage;
					}
					// send GA event
					try{
						GoogleAnalytics.trackIntoStorePageTime(s.get('chainStore'));
						GoogleAnalytics.trackOrderProcess(2, s.get('chainStore'));
						GoogleAnalytics.trackStoreRanking(window.myapp.location, s.get('chainStore'));
					}catch(err){}
				},function(xhr, type){
					console.log(type);
				});
			}catch(err){
				$(window).trigger('tryCatchError', {errorMsg:err.message+" at function storePage in router", errorLocation:err.stack});
				throw err;
			}
		},
		productPage: function(store, product){
			try{
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
				//TODO fix url: this will change storePage's url attribute, we don't want that
				//this.changePage(this.views.storePage.el);
			}catch(err){
				$(window).trigger('tryCatchError', {errorMsg:err.message+" at function productPage in router", errorLocation:err.stack});
				throw err;
			}
		},
		orderInfoPage: function(store){
			try{
				if(!this.views.orderInfoPage){ // load the orderInfo page into DOM
					this.views.orderInfoPage = new Views.OrderInfoPageView();
					this.loadToDOM(this.views.orderInfoPage.el);
					window.orderInfoPage = this.views.orderInfoPage;
				}
				
				this.changePage(this.views.orderInfoPage.render().el);
				this.transitionEffectType = null;
				this.transitionDir = null;
				// set store menu data
				var that = this;
				if(!window.menuData){
					window.menuData = new MenuData();
				}
				window.menuData.getMenuOfStore(store, function(s){
					that.views.orderInfoPage.setModel(s);
					// send GA event
					try{ GoogleAnalytics.trackOrderProcess(4, s.get('chainStore')); }catch(err){}
				},function(xhr, type){
					console.log(type);
				});
			}catch(err){
				$(window).trigger('tryCatchError', {errorMsg:err.message+" at function orderInfoPage in router", errorLocation:err.stack});
				throw err;
			}
		},
		orderEditPage : function(store, index){
			console.log('do orderEditPage function.');
		},
		userInfoPage: function(store){
			try{
				var storeName = window.menuData.get('stores').get(store).get('displayedName');
				var that = this;
		
				if(!this.views.userInfoPage){ // load the userInfo page into DOM
					this.views.userInfoPage = new Views.UserInfoPageView();
					this.loadToDOM(this.views.userInfoPage.el);
				}
				// set store menu data
				this.views.userInfoPage.setTitle(storeName);
				this.views.userInfoPage.setStore(store);
				if(window.loadingPanel) window.loadingPanel.connectionOut();
				var url = OrderServiceUrl+'?action=getAvailableDeliveryTime&storeID='+store;
				$.ajax({
					type: 'GET',
					url: url,
					dataType: 'json',
					cache : false,
					success: function(data){
						try{
							if(window.loadingPanel) window.loadingPanel.connectionIn();
							that.views.userInfoPage.setAvailableTime(data.time);
						}catch(err){
							$(window).trigger('tryCatchError', {errorMsg:err.message+" at ajax for "+url, errorLocation:err.stack});
						}
					},
					error: function(xhr, type){
						if(window.loadingPanel) window.loadingPanel.connectionIn();
						$(window).trigger('ajaxError2', {errorMsg:url, errorLocation:printStackTrace()});
					}
				});
				this.changePage(this.views.userInfoPage.render().el);
				this.transitionEffectType = null;
				this.transitionDir = null;
				this.views.userInfoPage.render();
				// send GA event
				var GA_CS = window.menuData.get('stores').get(store).get('chainStore');
				GoogleAnalytics.trackIntoUserInfoPageTime(GA_CS);
				GoogleAnalytics.trackOrderProcess(5, GA_CS);
			}catch(err){
				$(window).trigger('tryCatchError', {errorMsg:err.message+" at function userInfoPage in router", errorLocation:err.stack});
				throw err;
			}
		},
		orderResultPage: function(store){
			try{
				if(!this.views.orderResultPage){ // load the orderResult page into DOM
					this.views.orderResultPage = new Views.OrderResultPageView();
					this.loadToDOM(this.views.orderResultPage.el);
				}
				if(!window.myapp.orderNumber){
					window.myapp.orderNumber = 0;
				} 
				this.views.orderResultPage.setOrderNumber(window.myapp.orderNumber);
				this.views.orderResultPage.setStore(store);
				this.changePage(this.views.orderResultPage.render().el);
				this.transitionEffectType = null;
				this.transitionDir = null;
				this.views.orderResultPage.render();
				this.views.orderResultPage.cleanShoppingCart(store);
				// send GA event
				var GA_CS = window.menuData.get('stores').get(store).get('chainStore');
				GoogleAnalytics.trackSendOrderTime(GA_CS);
				GoogleAnalytics.trackOrderProcess(6, GA_CS);
			}catch(err){
				$(window).trigger('tryCatchError', {errorMsg:err.message+" at function orderResultPage in router", errorLocation:err.stack});
				throw err;
			}
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
		changePage: function(el){
			// Collapse the keyboard
            $(':focus').blur();
            
            var effectType, effectDir;
            
			var from = $(this.currentActivePage);
			var to = $(el);
			to.attr('url',window.location.href); // set url
			if(from==to || from.attr('url')==to.attr('url')) return;
			
			// change page effect
			try{
				var newUrl, oldUrl;
				newUrl = window.location.href;
				oldUrl = window.lastUrl;
				window.lastUrl = newUrl;
				
				if(newUrl.indexOf('#startPage')>=0 || newUrl.indexOf('#')<0){ // to start page
					effectType = 'hSlide';
				}else if(newUrl.indexOf('#storePage')>=0){ // to store page
					effectType = 'hSlide';
					if(oldUrl.indexOf('#startPage')>=0  || oldUrl.indexOf('#')<0){ // from start page, slide from right
						effectDir = 'right';
					}
				}else if(newUrl.indexOf('#orderInfoPage')>=0){ // to order info page
					effectType = 'hSlide';
					if(oldUrl.indexOf('#storePage')>=0){ // from store page, slide from right
						effectDir = 'right';
					}
				}else if(newUrl.indexOf('#userInfoPage')>=0){ // to user info page
					effectType = 'hSlide';
					if(oldUrl.indexOf('#orderInfoPage')>=0){ // from order info page, slide from right
						effectDir = 'right';
					}
				}else if(newUrl.indexOf('#orderResultPage')>=0){ // to order Result Page
					effectType = 'hSlide';
					if(oldUrl.indexOf('#userInfoPage')>=0){ // from user info page, slide from right
						effectDir = 'right';
					}
				}
				// App event tracking: page changed
				window.myapp.AppEvent.goPage();
				window.myapp.GoogleAnalytics.goPage();
			}catch(err){
				$(window).trigger('tryCatchError', {errorMsg:err.message+" at hashchange event handler in router.", errorLocation:err.stack});
				throw err;
			}
			
			
			window.inTransition = true;
			if(!window.useTransitionEffect || !effectType || TransitionEffectTypes.indexOf(effectType)<0){ // no change page animation
				from.hide();
				to.show();
				to.css('-webkit-transform','translate3d(0, 0, 0)');
            	this.currentActivePage = to;
				window.inTransition = false;
				effectType = false;
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
				effectType = false;			
			}
		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Router = AppRouter;
	
})(	window.myapp.GoogleAnalytics,
	window.myapp.Api.OrderServiceUrl,
	window.myapp.Model.MenuData,
	window.myapp.Widget.LoadingPanel,
{	StartPageView:window.myapp.StartPageView,
	StorePageView:window.myapp.StorePageView,
	OrderInfoPageView:window.myapp.OrderInfoPageView,
	UserInfoPageView:window.myapp.UserInfoPageView,
	OrderResultPageView:window.myapp.OrderResultPageView
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