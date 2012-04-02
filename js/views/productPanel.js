//Filename: js/views/productPanel.js
(function(Scroller){
	var pageTemplate = [
		'<div class="HeaderPanel">',
			'<div id="cancelBtn"><div class="HeaderButton"><div class="ButtonText">取消</div></div></div>',
			'<div id="title"></div>',
			'<div id="buyBtn"><div class="HeaderButton"><div class="ButtonText">購買</div></div></div>',
		'</div>',
		'<div class="ProductDialog" id="productContent" style="background-color:rgba(255, 255, 255, 0.75) ; -webkit-box-flex: 10;display: -webkit-box; -webkit-box-orient: horizontal;">',
		'</div>'
	].join('');
	
	var productWidgetTemplate = [
		'<img class="Img" src="<%= img %>" style="<% if(!img || img.length<3) print(\"display:none;\"); %>" />',
		'<div><%= name %></div>',
		'<div><%= info %></div>',
		'<div style="display: -webkit-box;">',
			'<div class="AmountPanel" style="-webkit-box-flex:1; ">',
				'<div class="AmountOption Horizontal"><div class="Btns">',
					'<div class="Button" id="plusBtn"><div class="ButtonText">＋</div></div>',
					'<div class="Button" id="minusBtn"><div class="ButtonText">－</div></div>',
				'</div></div>',
			'</div>',
			'<div class="Price" style="-webkit-box-flex: 999;"></div>',
		'</div>',
		'<div class="OptionBox"></div>'
	].join('');
	
	var priceTemplate = '<%=price%> X <%=amount%> = <%=price*amount%>元';
	
	var optionTemplate = [
		'<% for(var i=0; i<data.length; i++){ %>',
			'<% var o = data[i]; var title = o.get("title"); var v = o.get("values"); %>',
			'<div class="OptionPanel WebOptionPanel">',
				'<div class="OptionTitle"><%= title %>：</div>',
				'<select name="<%= title %>">',
				'<% for(var j=0; j<v.length; j++){ %>',
					'<% var r = v[j].substring(0, v[j].indexOf(":")); %>',
					'<option value="<%= r %>"><%= r %></option>',
				'<% } %>',
				'</select>',
			'</div>',
		'<% } %>'
	].join('');
	
	var ProductPanel = Backbone.View.extend({
		initialize: function(){
			this.tabs = {};
			this.$el.html(_.template(pageTemplate));
			this.$el.addClass('Base');
			this.$el.attr("id","productPageView");
			this.$el.attr("style","height:100%; width:100%;");
			this.$el.css('background-image', 'url(pic/back-w.jpg)');
			this.$el.css('z-index', '999');
			this.$el.hide();
			
			// scroller
			this.scroller = new Scroller();
			$("#productContent", this.el).append(this.scroller.render().el);
		},
		events:{
			"click #cancelBtn":"_cancel",
			"click #buyBtn":"_buy",
			"click #plusBtn":"_addAmount",
			"click #minusBtn":"_minusAmount",
			"selectionChange .ProductOption":"_updateSelection"
		},
		setModel: function(model){
			if(model) this.model = model;
			var m = this.model;
			var name = m.get('_displayedName');
			var price = m.get('_price');
			var img = m.get('_imgUrl');
			var intro = m.get('_intro');
			this.amount = 1;
			this.scroller.html(_.template(productWidgetTemplate,{
				name:name,
				img:img,
				info:intro,
			}));
			$('.Price', this.el).html(_.template(priceTemplate,{price:price, amount:this.amount}));
			// options
/*			if(!m.get('optionList')){
				var ol = new window.myapp.Model.ProductOptionList();
				ol.parse(m.get('_optionString'));
				m.set('optionList', ol);
			}
			$('.OptionBox', this.el).html(_.template(optionTemplate,{data:m.get('optionList').models}));
*/
			$('.OptionBox', this.el).empty();
			this.optionWidget = [];
			this.selectedOption = {};
			this.selectedPrice = price;
			var _options = m.get('_options');
			for(var i=0; i<_options.length; i++){
				var option = _options[i];
				var ov = new window.myapp.View.ProductOptionView({model:option});
				$('.OptionBox', this.el).append(ov.render().el);
				this.optionWidget.push(ov);
				this.selectedOption = $.extend(this.selectedOption, ov.getSelected());
				this.selectedPrice += ov.getSelectedPrice()
			}
					
			// refresh size
			this.scroller.render();
		},
		_cancel: function(){
			var that = this;
			this.hide('top', function(){
				if(that.callback){
					that.callback();
					that.callback = null;
				}else{
					window.history.go(-1);
				}
			});
		},
		_buy: function(){
			var that = this;
			this.hide('bottom', function(){
				if(that.callback){
					that.callback();
					that.callback = null;
				}else{
					window.history.go(-1);
				}
			});
		},
		_updateSelection: function(){
			var m = this.model;
			this.selectedPrice = m.get('_price');
			this.selectedOption = {};
			for(var i=0,length=this.optionWidget.length; i<length; i++){
				var ov = this.optionWidget[i];
				this.selectedOption = $.extend(this.selectedOption, ov.getSelected());
				this.selectedPrice += ov.getSelectedPrice()
			}
			this._updateMoney();
		},
		_updateMoney: function(){
			$('.Price', this.el).html(_.template(priceTemplate,{price:this.selectedPrice, amount:this.amount}));
		},
		_addAmount: function(){
			this.amount++;
			var price = this.model.get('_price');
			$('.Price', this.el).html(_.template(priceTemplate,{price:this.selectedPrice, amount:this.amount}));
		},
		_minusAmount: function(){
			this.amount--;
			if(this.amount<1) this.amount=1;
			var price = this.model.get('_price');
			$('.Price', this.el).html(_.template(priceTemplate,{price:this.selectedPrice, amount:this.amount}));
		},
		render: function(){
			this.delegateEvents();
			return this;
	  	},
	  	show: function(effectDir){
	  		if(this.$el.css('display')!='none') return; //already shown
	  		if(effectDir=='top'){
	  			this.$el.css('-webkit-transform','translate3d(0, -100%, 0)');
	  			this.$el.show();
	  			this.$el.animate({
			    	'-webkit-transform': 'translate3d(0, 0, 0)',
			  	}, 300, 'ease-in-out', function(){
			  	});
	  		}else{
	  			this.$el.css('-webkit-transform','translate3d(0, 100%, 0)');
	  			this.$el.show();
	  			this.$el.animate({
			    	'-webkit-transform': 'translate3d(0, 0, 0)',
			  	}, 300, 'ease-in-out', function(){
			  	});
	  		}
	  	},
	  	hide: function(effectDir, callback){
	  		if(this.$el.css('display')=='none') return; //already hidden
	  		var that = this;
	  		if(effectDir=='top'){
	  			this.$el.css('-webkit-transform','translate3d(0, 0, 0)');
	  			this.$el.animate({
			    	'-webkit-transform': 'translate3d(0, -100%, 0)',
			  	}, 300, 'ease-in-out', function(){
			  		that.$el.hide();
			  		if(callback) callback();
			  	});
	  		}else{
	  			this.$el.css('-webkit-transform','translate3d(0, 0, 0)');
	  			this.$el.animate({
			    	'-webkit-transform': 'translate3d(0, 100%, 0)',
			  	}, 300, 'ease-in-out', function(){
			  		that.$el.hide();
			  		if(callback) callback();
			  	});
	  		}
	  	}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.View = window.myapp.View || {};
	window.myapp.View.ProductPanel = ProductPanel;
})( window.myapp.Widget.Scroller);
