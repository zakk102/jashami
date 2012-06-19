//Filename: js/models/menuData.js
(function(Api, Utils){

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
		initialize: function(){
			this.get('products').comparator = function(arg0, arg1){
				if(arg0.get('category')===arg1.get('category')){
					return arg0.get('displayedIndex')<arg1.get('displayedIndex')?-1:1;
				}
				return arg0.get('category')<arg1.get('category')?-1:1;
			};
		},
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
	
	var zipCodeIndex = Backbone.RelationalModel.extend({
		idAttribute: 'zipCode',
	    relations: [{
	            type: Backbone.HasMany,
	            key: 'stores',
	            relatedModel: Store,
	        }]
	});
	
	var MenuData = Backbone.RelationalModel.extend({
/*		url: 'http://api.majashami.appspot.com/api/MenuService?action=getMenuByZipcode&zipCode=110',
		_setAPI: function(action, args){
			this.url = Api.MenuServiceUrl+"?action="+action+"&";
			if(args && Object.keys(args).length>0){
				for(key in args){
					this.url += key+"="+args[key]+"&";	
				}
			}
			this.url = this.url.substring(0, this.url.length-1);
			//this.url = "/~zakk/develop/jashami/testData/menuData";
		},
*/
		initialize: function(){
			this.setEditMode(Utils.getLocationParameter('isTestMode'));
		},
		_getMenuFromServer: function(zipCode, successCallback, failCallback){
			var that = this;
			var url = Api.MenuServiceUrl+"?action=getMenuByZipcode&zipCode="+zipCode+"&isEditMode="+this.isEditMode;
//			var url = 'http://api2.majashami.appspot.com/api/MenuService?action=updateDateIfNeed&lastUpdate=null&isEditMode=true';
//			var url = 'http://api2.majashami.appspot.com/api/MenuService?action=getWholeMenu&readFromCache=false&isEditMode=true';
//			var url = "/~zakk/develop/jashami/testData/menuData";
			if(window.loadingPanel) window.loadingPanel.connectionOut();
			$.ajax({
				type: 'GET',
				url: url, 
				dataType: 'json',
				cache : false,
				success: function(data){
					try{
						if(window.loadingPanel) window.loadingPanel.connectionIn();
						if(!data.zipCodeIndexs){
							alert("讀取菜單失敗，請再試一次");
							return;
						}
						that.get('zipCodeIndexs').add(data.zipCodeIndexs);
						that.get('stores').add(data.stores);
						that.get('menus').add(data.menus);
						if(successCallback){
							var index = that.get('zipCodeIndexs').get(zipCode);
							successCallback(index);
						} 
					}catch(err){
						$(window).trigger('tryCatchError', {errorMsg:err.message+" at ajax for "+url, errorLocation:err.stack});
					}
				},
				error: function(xhr, type){
					if(window.loadingPanel) window.loadingPanel.connectionIn();
				    console.log('_getMenuFromServer: Ajax error!');
				    $(window).trigger('ajaxError2', {errorMsg:url, errorLocation:printStackTrace()});
				    alert("讀取菜單失敗，請再試一次");
				    if(failCallback) failCallback(xhr, type);
				}
			});
		},
		_getStoreListFromServer: function(zipCode, successCallback, failCallback){
			var that = this;
			var url = Api.MenuServiceUrl+"?action=getStoreListByZipcode&zipCode="+zipCode+"&isEditMode="+this.isEditMode;
			if(window.loadingPanel) window.loadingPanel.connectionOut();
			$.ajax({
				type: 'GET',
				url: url, 
				dataType: 'json',
				cache : false,
				success: function(data){
					try{
						if(window.loadingPanel) window.loadingPanel.connectionIn();
						if(!data.zipCodeIndexs){
							alert("讀取菜單失敗，請再試一次");
							return;
						}
						that.get('zipCodeIndexs').add(data.zipCodeIndexs);
						that.get('stores').add(data.stores);
						if(successCallback){
							var index = that.get('zipCodeIndexs').get(zipCode);
							successCallback(index);
						} 
					}catch(err){
						$(window).trigger('tryCatchError', {errorMsg:err.message+" at ajax for "+url, errorLocation:err.stack});
					}
				},
				error: function(xhr, type){
					if(window.loadingPanel) window.loadingPanel.connectionIn();
				    console.log('_getStoreListFromServer: Ajax error!');
				    $(window).trigger('ajaxError2', {errorMsg:url, errorLocation:printStackTrace()});
				    alert("讀取菜單失敗，請再試一次");
				    if(failCallback) failCallback(xhr, type);
				}
			});
		},
		_getMenuOfStoreFromServer: function(storeID, successCallback, failCallback){
			var that = this;
			var url = Api.MenuServiceUrl+"?action=getMenuOfStore&storeID="+storeID+"&isEditMode="+this.isEditMode;
			if(window.loadingPanel) window.loadingPanel.connectionOut();
			$.ajax({
				type: 'GET',
				url: url, 
				dataType: 'json',
				cache : false,
				success: function(data){
					try{
						if(window.loadingPanel) window.loadingPanel.connectionIn();
						that.get('stores').add(data.stores);
						that.get('menus').add(data.menus);
						if(successCallback){
							var store = that.get('stores').get(storeID);
							successCallback(store);
						}
					}catch(err){
						$(window).trigger('tryCatchError', {errorMsg:err.message+" at ajax for "+url, errorLocation:err.stack});
					} 
				},
				error: function(xhr, type){
					if(window.loadingPanel) window.loadingPanel.connectionIn();
				    console.log('_getMenuOfStoreFromServer: Ajax error!');
				    $(window).trigger('ajaxError2', {errorMsg:url, errorLocation:printStackTrace()});
				    alert("讀取菜單失敗，請再試一次");
				    if(failCallback) failCallback(xhr, type);
				}
			});
		},
		_getMenuByMenuIDFromServer: function(menuID, successCallback, failCallback){
			var that = this;
			var url = Api.MenuServiceUrl+"?action=getMenuByMenuID&menuID="+menuID+"&isEditMode="+this.isEditMode;
			if(window.loadingPanel) window.loadingPanel.connectionOut();
			$.ajax({
				type: 'GET',
				url: url, 
				dataType: 'json',
				cache : false,
				success: function(data){
					try{
						if(window.loadingPanel) window.loadingPanel.connectionIn();
						that.get('menus').add(data.menu);
						if(successCallback){
							var menu = that.get('menus').get(menuID);
							successCallback(menu);
						}
					}catch(err){
						$(window).trigger('tryCatchError', {errorMsg:err.message+" at ajax for "+url, errorLocation:err.stack});
					} 
				},
				error: function(xhr, type){
					if(window.loadingPanel) window.loadingPanel.connectionIn();
				    console.log('_getMenuByMenuIDFromServer: Ajax error!');
				    $(window).trigger('ajaxError2', {errorMsg:url, errorLocation:printStackTrace()});
				    alert("讀取菜單失敗，請再試一次");
				    if(failCallback) failCallback(xhr, type);
				}
			});
		},
		getMenuByZipCode: function(zipCode, successCallback, failCallback){
			var index = this.get('zipCodeIndexs').get(zipCode);
			if(index){
				if(successCallback) successCallback(index);
			}else{
				this._getMenuFromServer(zipCode, successCallback, failCallback);
			}
		},
		getStoreListByZipCode: function(zipCode, successCallback, failCallback){
			var index = this.get('zipCodeIndexs').get(zipCode);
			if(index){
				if(successCallback) successCallback(index);
			}else{
				this._getStoreListFromServer(zipCode, successCallback, failCallback);
			}
		},
		getMenuOfStore: function(storeID, successCallback, failCallback){
			var store = this.get('stores').get(storeID);
			if(store){
				var menuID = store.get('menuIdString');
				var menu = this.get('menus').get(menuID);
				if(menu){
					if(successCallback) successCallback(store);
				}else{
					this._getMenuByMenuIDFromServer(menuID, function(menu){
						if(successCallback) successCallback(store);
					}, failCallback);
				}
			}else{
				this._getMenuOfStoreFromServer(storeID, successCallback, failCallback);
			}
		},
		setEditMode: function(isEditMode){
			this.isEditMode = isEditMode;
		},
	    relations: [{
	            type: Backbone.HasMany,
	            key: 'stores',
	            relatedModel: Store,
	        },{
	        	type: Backbone.HasMany,
	            key: 'menus',
	            relatedModel: Menu,
	        },{
	        	type: Backbone.HasMany,
	            key: 'zipCodeIndexs',
	            relatedModel: zipCodeIndex,
	        }]
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Model = window.myapp.Model || {};
	window.myapp.Model.ProductOptionList = ProductOptionList;
	window.myapp.Model.Product = Product;
	window.myapp.Model.Menu = Menu;
	window.myapp.Model.Store = Store;
	window.myapp.Model.MenuData = MenuData;
})(	window.myapp.Api,
	window.myapp.Utils);
