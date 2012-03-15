// Filename: js/collections/storeList.js
(function(Store){
	var StoreList = Backbone.Collection.extend({
		model: Store,
//		url: '/jashami/testData/storeList',
		getByRegion: function(success){
			this.url = '/jashami/testData/storeList';
			this.fetch({'success':success});
		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Collection = window.myapp.Collection || {};
	window.myapp.Collection.StoreList = StoreList;
})(window.myapp.Model.Store);


/* example
	var storeList = new window.myapp.Collection.StoreList();
	storeList.getByRegion({success:function(){
		console.log(storeList.toJSON());
	}});
*/