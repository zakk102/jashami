// Filename: js/widget/addressSelector.js
(function(addressAndZipcode, countries, areas){
	var selectorTemplate = [
		'<div class="AddressSelectionBox">',
			'<select class="country-selector">',
				'<option>請選擇縣市</option>',
				'<% for(var i=0,length=countries.length; i<length; i++) { %>',
					'<option value="<%= countries[i] %>"><%= countries[i] %></option>',
				'<% } %>',
			'</select>',
			'<select class="area-selector">',
			'</select>',
		'</div>'
	].join('');
	
	var areaTemplate = [
		'<option>請選擇鄉鎮區</option>',
		'<% for(var i=0,length=areas[index].length; i<length; i++) { %>',
			'<% var area = areas[index][i].split(",")[0]; %>',
			'<% var zip = areas[index][i].split(",")[1]; %>',
			'<option value="<%= zip %>"><%= area %></option>',
		'<% } %>'
	].join('');
	
	var AddressSelector = Backbone.View.extend({
		initialize: function(){
			$(this.el).html(_.template(selectorTemplate, {'countries': countries}));
		},
		events: {
			'change .country-selector': 'changeCountry',
			'change .area-selector': 'changeArea'
  		},
  		changeCountry: function(e) {
  			var index = e.currentTarget.value;
  			$('.area-selector', this.el).html(_.template(areaTemplate, {'index': index, 'areas': areas}));
  		},
  		changeArea: function(e){
  			this.$el.trigger("locationChange", e.currentTarget.value);
  		},
  		setSelection: function(value, option){
  			var currentVal = $('.area-selector', this.el).val();
  			var country = value.substring(0, 3);
			var area = value.substring(3);
			for(var i=0,length=areas[country].length; i<length; i++) {
				if(areas[country][i].indexOf(area)>=0){
					area = areas[country][i].split(",")[1];
					break;
				}
			}
			$(".country-selector", this.el).val(country);
			$('.area-selector', this.el).html(_.template(areaTemplate, {'index': country, 'areas': areas}));
			$('.area-selector', this.el).val(area);
			
			if( (!option || !option.silent) && currentVal!=area){ 
				this.$el.trigger("locationChange",area); 
			}
  		},
  		setSelection_zipcode: function(zipcode, option){
  			var value = addressAndZipcode.zipcode2address(zipcode);
  			if(value != null) this.setSelection(value, option);
  		},
		render: function(){
			return this;
		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Widget = window.myapp.Widget || {};
	window.myapp.Widget.AddressSelector = AddressSelector;
})(	window.addressAndZipcode,
	window.addressAndZipcode.Countries,
	window.addressAndZipcode.Areas);
