//Filename: js/models/menuData.js
(function(Api){

	var ProductOption = Backbone.Model.extend({
		Single: 'singleOption',
		Multiple: 'multipleOption',
		parse: function(optionString){
			this.clear(); // clear data
			this.set('title', optionString.substring(0, optionString.indexOf('?')) );
			var otherString = optionString.substring(optionString.indexOf('?')+1);
			this.set('values', otherString.split('&') );
			this.set('type', ProductOption.Single );
		}
	});
	
	var ProductOptionList = Backbone.Collection.extend({
		parse: function(optionString){
			this.models = []; // clear data
			var that = this;
			var os = optionString.split('|');
			_.each(os, function(string){
				var po = new ProductOption();
				po.parse(string);
				that.add(po);
			});
		}
	});
/*
	var ProductOption = Backbone.RelationalModel.extend({
		relations: [{
	            type: Backbone.HasOne,
	            key: 'subOption',
	            relatedModel: ProductOption,
	        }]
	});
*/	
	var Product = Backbone.RelationalModel.extend({
	    idAttribute: 'productNameId',
	});
	
	var Menu = Backbone.RelationalModel.extend({
	    idAttribute: 'menuId',
	    relations: [{
	            type: Backbone.HasMany,
	            key: 'products',
	            relatedModel: Product,
	            reverseRelation: {
	                key: 'menu',
	                includeInJSON: 'menuId'
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
		idAttribute: 'storeNameId',
	    relations: [{
	            type: Backbone.HasOne,
	            key: 'menuId',
	            relatedModel: Menu,
	            reverseRelation: {
	                key: 'store',
	                includeInJSON: 'storeNameId'
	            }
	        }]
	});
	
	var MenuData = Backbone.RelationalModel.extend({
		url: 'http://api.majashami.appspot.com/api/MenuService?action=getMenuByZipcode&zipCode=110',
		setAPI: function(action, args){
			this.url = Api.MenuServiceUrl+"?action="+action+"&";
			if(args && Object.keys(args).length>0){
				for(key in args){
					this.url += key+"="+args[key]+"&";	
				}
			}
			this.url = this.url.substring(0, this.url.length-1);
		},
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
	window.myapp.Model.ProductOptionList = ProductOptionList;
	window.myapp.Model.Product = Product;
	window.myapp.Model.Menu = Menu;
	window.myapp.Model.Store = Store;
	window.myapp.Model.MenuData = MenuData;
})(window.myapp.Api);