// Filename: js/models/store.js
(function(){
	var Store = Backbone.Model.extend({
		defaults: {
            deliveryLimit: 99999,
            deliveryFee: 99999,
            lat: 99999,
            lng: 99999,
        },
        idAttribute: 'storeNameId'
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Model = window.myapp.Model || {};
	window.myapp.Model.Store = Store;
})();


/* attributes:

 	chainStore: null,
	index: null,
	storeNameId: null,
	displayedName: null,
	msg: null,
	deliveryLimit: 99999,
	deliveryFee: 99999,
	phoneNumber: null,
	faxNumber: null,
	email: null,
	address: null,
	zipCode: null,
	lat: 99999,
	lng: 99999,
	imgUrl: null,
	menuId: null,
	openTime: null
 */