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
			this.views = {};	
	    },
		defaultAction: function(actions){
			this.startPage('orderTab');
		},
		startPage: function(tab){
			if(!this.views.startPage) this.views.startPage = new Views.StartPageView();
			$('.ActivePage').html(this.views.startPage.render().el);
			this.views.startPage.toTab(tab);
		},
		storePage: function(store){
			if(!this.views.storePage) this.views.storePage = new Views.StorePageView();
			if(!window.menuData){
				var that = this;
				window.menuData = new MenuData();
				window.menuData.fetch({success:function(){
					that.views.storePage.model = window.menuData.get('stores').get(store);
					$('.ActivePage').html(that.views.storePage.render().el);
				}});
			}else{
				this.views.storePage.model = window.menuData.get('stores').get(store);
				$('.ActivePage').html(this.views.storePage.render().el);
			}
		},
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Router = AppRouter;
	
})(	window.myapp.Model.MenuData,
{	StartPageView:window.myapp.StartPageView,
	StorePageView:window.myapp.StorePageView
});
