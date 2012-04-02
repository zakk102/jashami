//Filename: js/views/productOption.js
(function(){
	
	var template = [
		'<div class="OptionPanel WebOptionPanel">',
			'<div class="OptionTitle"><%= title %>：</div>',
			'<select class="<%= type %>">',
			'<% for(var key in options){ %>',
				'<% var text = options[key]>0?key+" + "+options[key]+"元":key; %>',
				'<option value="<%= key %>"><%= text %></option>',
			'<% } %>',
			'</select>',
		'</div>'
	].join('');
	
	var selectionTemplate = [
		'<% for(var key in options){ %>',
			'<% var text = options[key]>0?key+" + "+options[key]+"元":key; %>',
			'<option value="<%= key %>"><%= text %></option>',
		'<% } %>'
	].join('');
	
	var ProductOptionView = Backbone.View.extend({
		initialize: function(){
			this.$el.addClass('ProductOption');
		},
		events:{
			"change .master":"selectionChange_m",
			"change .salve":"selectionChange_s"
		},
		selectionChange_m: function(e){
			var selected = e.currentTarget.value;
			var m = this.model;
			if(m._subOption){
				var sSelected = $('.salve', this.el).val();
				var s = m._subOption;
				var options = s._values[selected] || {};
				$("select.salve", this.el).html(_.template(selectionTemplate, {options:options}));
				if(options[sSelected]){
					$('.salve', this.el).val(sSelected);
				} 
			}
			this.$el.trigger('selectionChange');
		},
		selectionChange_s: function(e){
			this.$el.trigger('selectionChange');
		},
		getSelected: function(){
			var m = this.model;
			var data = {};
			data[m._title] = $('.master', this.el).val();
			if(m._subOption){
				var s = m._subOption;
				data[s._title] = $('.salve', this.el).val();
			}
			return data;
		},
		getSelectedPrice: function(){
			var m = this.model;
			var result = 0;
			var mSelected = $('.master', this.el).val();
			result += m._values[mSelected];
			if(m._subOption){
				var s = m._subOption;
				var options = s._values[mSelected]
				result += options[$('.salve', this.el).val()];
			}
			return result;
		},
		isValid: function(){//TODO
			return true;
		},
		render: function(){
			var m = this.model;
			this.$el.html(_.template(template, {title:m._title, type:"master", options:m._values}));
			var val = Object.keys(m._values)[0];
			$("select.master", this.el).val(val);
			if(m._subOption){
				var s = m._subOption;
				var options = s._values[val] || {};
				this.$el.append(_.template(template, {title:s._title, type:"salve", options:options}));
			}
			return this;
		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.View = window.myapp.View || {};
	window.myapp.View.ProductOptionView = ProductOptionView;
})();
