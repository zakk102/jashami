//Filename: js/models/menuData.js
(function(){
	var Product = Backbone.RelationalModel.extend({
	    idAttribute: '_productNameId'
	});
	
	var Menu = Backbone.RelationalModel.extend({
	    idAttribute: '_menuId',
	    relations: [{
	            type: Backbone.HasMany,
	            key: 'products',
	            relatedModel: Product,
	            reverseRelation: {
	                key: 'menu',
	                includeInJSON: '_menuId'
	            }
	        }]
	});
	
	var Store = Backbone.RelationalModel.extend({
		defaults: {
            deliveryLimit: 99999,
            deliveryFee: 99999,
            lat: 99999,
            lng: 99999,
        },
		idAttribute: '_storeNameId',
	    relations: [{
	            type: Backbone.HasOne,
	            key: '_menuId',
	            relatedModel: Menu,
	            reverseRelation: {
	                key: 'store',
	                includeInJSON: '_storeNameId'
	            }
	        }]
	});
	
	var MenuData = Backbone.RelationalModel.extend({
		setLocation: function(loc){
			this.set('location', loc);
			this.url = '/jashami/testData/menuData';
		},
		url: '/jashami/testData/menuData',
	    relations: [{
	            type: Backbone.HasMany,
	            key: 'stores',
	            relatedModel: Store,
	        },{
	        	type: Backbone.HasMany,
	            key: 'menus',
	            relatedModel: Menu,
	        }]
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Model = window.myapp.Model || {};
	window.myapp.Model.Product = Product;
	window.myapp.Model.Menu = Menu;
	window.myapp.Model.Store = Store;
	window.myapp.Model.MenuData = MenuData;
})();