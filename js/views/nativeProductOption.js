//Filename: js/views/nativeProductOption.js
(function(NativeSelector){
	var template = [
		'<div class="OptionPanel WebOptionPanel">',
			'<div class="OptionTitle"><%= title %>：</div>',
			'<div class="SelectInput"></div>',
		'</div>'
	].join('');
	
	var NativeProductOptionView = Backbone.View.extend({
		initialize: function(){
			this.$el.addClass('Native ProductOption');
			this.$el.html(_.template(template, {title:this.model.title}));
			var selector = new NativeSelector({el:$(".SelectInput",this.el)});
			this.selector = selector;
		},
		events:{
			'selectionChange *': 'selectionChanged'
		},
		selectionChanged: function(){
			this.$el.trigger('selectionChange');
		},
		getSelected: function(){
			return this.selector.getSelectedValues();
		},
		setSelected: function(data, options){
			this.selector.setSelectedValues(data, options);
		},
		getSelectedPrice: function(){
			console.log('getSelectedPrice');
			var result = 0;
			var data = this.getSelected();
			var ptitle = this.model.title;
			var pselected = data[ptitle];
			result += this.model.values[pselected];
			if(this.model.subOption){
				var stitle = this.model.subOption.title;
				var sselected = data[stitle];
				result += this.model.subOption.values[pselected][sselected];
			}
			return result;
		},
		isValid: function(){//TODO
			return true;
		},
		render: function(){
			// prepare slection input format
			var options = {};
			var title = this.model.title;
			options[title] = {};
			for(var key in this.model.values){
				var price = this.model.values[key];
				price>0 ? options[title][key+" +"+price+"元"]=key : options[title][key]=key;
			}
			if(this.model.subOption){
				var subtitle = this.model.subOption.title;
				for(var pvalue in this.model.subOption.values){
					var pprice = this.model.values[pvalue];
					var subopt = this.model.subOption.values[pvalue];
					var sstitle = pprice>0 ? title+":"+subtitle+":"+pvalue+" +"+pprice+"元" : title+":"+subtitle+":"+pvalue;
					options[sstitle] = {};
					for(var key in subopt){
						var price = subopt[key];
						price>0 ? options[sstitle][key+" +"+price+"元"]=key : options[sstitle][key]=key;
					}
				}
			}
			this.selector.setModel(options, Object.keys(options).length>1, ",");
			return this;
		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.View = window.myapp.View || {};
	window.myapp.View.NativeProductOptionView = NativeProductOptionView;
})(	window.myapp.Widget.NativeSelector);
