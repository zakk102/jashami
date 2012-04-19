// Filename: js/widget/nativeAddressSelector.js
(function(NativeSelector, addressAndZipcode, countries, areas){
	var template = [
		'<div class="SelectInput"></div>'
	].join('');
	
	var NativeAddressSelector = Backbone.View.extend({
		initialize: function(){
			var that = this;
			this.$el.addClass("AddressSelectionBox");
			this.$el.html(_.template(template));
			var selector = new NativeSelector({el:$(".SelectInput",this.el)});
			this.selector = selector;
			var options = {};
			options['city'] = {};
			for(var i in countries){
				var city = countries[i];
				options['city'][city] = city;
				options['city:town:'+city] = {};
				for(var j in areas[city]){
					var town = areas[city][j].split(",")[0];
					options['city:town:'+city][town] = town;
				}
			}
			selector.setModel(options, true, "");
			selector.setDisplayText("請選擇縣市");
		},
		events: {
			'selectionChange *': 'changeArea'
  		},
  		changeArea: function(e){
  			var values = e.data;
  			var nv = "";
  			for(var key in values){
  				nv += values[key];
  			}
  			var zipcode = addressAndZipcode.address2zipcode(nv);
  			this.$el.trigger("locationChange", zipcode);
  		},
		setSelection: function(value, options){
			var values = {};
			values['city'] = value.substring(0, 3);
			values['town'] = value.substring(3);
			this.selector.setSelectedValues(values, options);
		},
		setSelection_zipcode: function(zipcode, options){
			console.log(zipcode);
  			var value = addressAndZipcode.zipcode2address(zipcode);
  			console.log(value);
  			if(value != null) this.setSelection(value, options);
  		},
		render: function(){
			return this;
		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Widget = window.myapp.Widget || {};
	window.myapp.Widget.NativeAddressSelector = NativeAddressSelector;
})(	window.myapp.Widget.NativeSelector,
	window.addressAndZipcode,
	window.addressAndZipcode.Countries,
	window.addressAndZipcode.Areas);
