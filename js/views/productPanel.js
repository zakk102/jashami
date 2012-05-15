//Filename: js/views/productPanel.js
(function(ImageResource, Scroller, NativeProductOptionView, ProductOptionView, BuyItem, ShoppingCartData, ShoppingCartCollection, TouchWidget){
	var pageTemplate = [
		'<div class="header-wrap">',
			'<div class="header-shadow"></div>',
			'<div class="header-outer">',
				'<div class="header">',
					'<div class="center">',
						'<div class="BackButton" id="cancelBtn">',
							'<div class="link-wrap" id="back-link-wrap"><div id="back-link" class="icon" style="-webkit-mask-box-image:url('+ImageResource["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_216_circle_arrow_left"]+');"></div><div class="function-txt">返回</div></div>',					
						'</div>',
						'<div id="title" class="function-panel">',
						'</div>',
						'<div class="NextButton" id="buyBtn">',
							'<div class="link-wrap" id="buy-link-wrap"><div id="buy" class="icon" style="-webkit-mask-box-image:url('+ImageResource["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_227_usd"]+');"></div><div class="function-txt">購買</div></div>',					
						'</div>',
					'</div>',
				'</div>',
			'</div>',
		'</div>',
		'<div class="ProductDialog" id="productContent" style="display:-webkit-box">',
		'</div>'
	].join('');
	
	var productWidgetTemplate = [
		'<div class="product-box<% if(!img||img.length<3) print(\" noImg\"); %>">',
			'<div class="amount-wrap">',
				'<div class="image-wrap">',
					'<img class="Img" src="<%= img %>" style="<% if(!img || img.length<3) print(\"display:none;\"); %>" />',
					'<div class="name"><%= name %></div>',
					'<div id="amount-panel">',
						'<div id="plusBtn" class="tag"><div id="add-tag-inner" class="tag-inner">',
							'<div id="add-icon" class="icon" style="-webkit-mask-box-image:url('+ImageResource["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_190_circle_plus"]+');"></div>',
						'</div></div>',
						'<div class="tag"><div id="amount-tag-inner" class="tag-inner">',
							'<div id="amount-tag-content" class="tag-content">',
								'<div id="product-box-amount"><%= amount%></div>',
								'<div>份</div>',
							'</div>',
						'</div></div>',
						'<div class="tag"><div id="total-tag-inner" class="tag-inner">',
							'<div id="total-tag-content" class="tag-content">',
								'<div style="font-size:0.9em">小計</div>',
								'<div id="product-box-total"><%= price*amount%></div>',
							'</div>',
						'</div></div>',
						'<div id="minusBtn" class="tag"><div id="sub-tag-inner" class="tag-inner">',
							'<div id="sub-icon" class="icon" style="-webkit-mask-box-image:url('+ImageResource["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_191_circle_minus"]+');"></div>',
						'</div></div>',
					'</div>',
				'</div>',
				'<div class="intro"><%= info %></div>',
			'</div>',
			// '<div style="display: -webkit-box;">',
				// '<div class="AmountPanel" style="-webkit-box-flex:1; ">',
					// '<div class="AmountOption Horizontal"><div class="Btns">',
						// '<div class="Button" id="plusBtn"><div class="ButtonText">＋</div></div>',
						// '<div class="Button" id="minusBtn"><div class="ButtonText">－</div></div>',
					// '</div></div>',
				// '</div>',
				// '<div class="Price" style="-webkit-box-flex: 999;"></div>',
			// '</div>',
			'<div class="OptionBox"></div>',
			'<div class="NoteBox">',
				'<div class="OptionPanel WebOptionPanel">',
					'<div class="OptionTitle">附註：</div>',
					'<div><input type="Text" placeholder="任何您想補充說明的" class="INPUT remarks" style="width=100%;"></div>',
				'</div>',
				'<div class="OptionPanel WebOptionPanel">',
					'<div class="OptionTitle">訂購者：</div>',
					'<div><input type="Text" placeholder="幫助紀錄誰點了什麼" class="INPUT orderName" style="width=100%;"></div>',
				'</div>',
			'</div>',
		'</div>'
	].join('');
	
	//var priceTemplate = '<%=price%> X <%=amount%> = <%=price*amount%>元';
	
	var optionTemplate = [
		'<% for(var i=0, length=data.length; i<length; i++){ %>',
			'<% var o = data[i]; var title = o.get("title"); var v = o.get("values"); %>',
			'<div class="OptionPanel WebOptionPanel">',
				'<div class="OptionTitle"><%= title %>：</div>',
				'<select name="<%= title %>">',
				'<% for(var j=0, length2=v.length; j<length2; j++){ %>',
					'<% var r = v[j].substring(0, v[j].indexOf(":")); %>',
					'<option value="<%= r %>"><%= r %></option>',
				'<% } %>',
				'</select>',
			'</div>',
		'<% } %>'
	].join('');
	
	var noteTemplate = [
		'<div class="OptionPanel WebOptionPanel">',
			'<div class="OptionTitle"><%= title %>：</div>',
			'<div><%= content  %></div>',
		'</div>'
	].join('');
	
	var ProductPanel = Backbone.View.extend({
		initialize: function(){
			this.tabs = {};
			this.$el.html(_.template(pageTemplate));
			this.$el.addClass('Base');
			this.$el.attr("id","productPageView");
			// this.$el.attr("style","height:100%; width:100%;");
			// //this.$el.css('background-image', 'url(pic/back-w.jpg)');
			// this.$el.css('z-index', '999');
			// this.$el.css('position', 'absolute');
			this.$el.hide();
			
			// scroller
			this.scroller = new Scroller();
			$(this.scroller.el).css('position','relative');
			$(this.scroller.el).css('height','100%');
			$("#productContent", this.el).append(this.scroller.render().el);

			new TouchWidget({el:$('#back-link-wrap', this.el)});
			new TouchWidget({el:$('#buy-link-wrap', this.el)});

		},
		events:{
			"click #cancelBtn":"_cancel",
			"click #buyBtn":"_buy",
			"click #plusBtn":"_addAmount",
			"click #minusBtn":"_minusAmount",
			"selectionChange .ProductOption":"_updateSelection"
		},
		setModel: function(model, storeNameId, currentItem){
			if(model) this.model = model;
			if(storeNameId) this.storeNameId = storeNameId;
  			//  title
			var storeName = window.menuData.get('stores').get(storeNameId).get('displayedName');
			$("#title", this.el).html(storeName);
			var m = this.model;
			var name = m.get('displayedName');
			var price = m.get('price');
			var img = m.get('imgUrl');
			var intro = m.get('intro');
			this.amount = 1;
			this.scroller.html(_.template(productWidgetTemplate,{
				name:name,
				img:img,
				amount:this.amount,
				price:price,
				info:intro,
			}));
			// $('.Price', this.el).html(_.template(priceTemplate,{price:price, amount:this.amount}));
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
			var _options = m.get('options');
			if(_options){
				for(var i=0; i<_options.length; i++){
					var option = _options[i];
					var keys = Object.keys(option.values);
					if(keys.length>0 && keys.length<2){ // not a option, just a note
						$('.OptionBox', this.el).append(_.template(noteTemplate, {title:option.title, content:keys[0]}));
						continue;
					}
					var ov;
					if(window.phonegapEnabled) ov = new NativeProductOptionView({model:option});
					else ov = new ProductOptionView({model:option});
					$('.OptionBox', this.el).append(ov.render().el);
					this.optionWidget.push(ov);
					this.selectedOption = $.extend(this.selectedOption, ov.getSelected());
					this.selectedPrice += ov.getSelectedPrice();
				}
				this._updateMoney();
			}
			if(currentItem){ // set selected value
				var amount = currentItem.get('amount');
				var price = currentItem.get('singlePrice');
				var options = currentItem.get('selectedOptions');
				var orderName = currentItem.get('orderName');
				var remarks = currentItem.get('remarks');
			
				// $('.Price', this.el).html(_.template(priceTemplate,{ 'price':price, 'amount':amount }));
				this.amount = amount;
				$('#product-box-amount', this.el).html(this.amount);
				this.selectedPrice = price;
				$('#product-box-total', this.el).html(this.selectedPrice*this.amount);
				this.selectedOption = options;
				for(var index in this.optionWidget){
					this.optionWidget[index].setSelected(options, {silent:true});
				}
				$('.orderName', this.el).val(orderName);
				$('.remarks', this.el).val(remarks);
			}
					
			// refresh size
			this.scroller.render();
		},
		_cancel: function(){
			if(this.cancelAction){
				this.cancelAction();
				this.cancelAction = null;
			}else{//default action
				var that = this;
				this.hide('bottom', function(){
					if(that.callback){
						that.callback();
						that.callback = null;
					}else{
						window.history.go(-1);
					}
				});
			}
		},
		_buy: function(){
			if(this.buyAction){
				this.buyAction();
				this.buyAction = null;
			}else{//default action
				var that = this;
				this.hide('top', function(){
					//get shoppingCart
					if(!window.shoppingCartCollection) window.shoppingCartCollection = new ShoppingCartCollection();
					var shoppingCarts = window.shoppingCartCollection;
					var shoppingCart = shoppingCarts.get(that.storeNameId);
					if(!shoppingCart){
						var deliveryLimit = that.model.get('deliveryLimit');
						shoppingCart = new ShoppingCartData({storeNameId:that.storeNameId, deliveryLimit:deliveryLimit});
						shoppingCarts.add(shoppingCart);
					}
					//add products to shoppingCart
					shoppingCart.addBuyItem(new BuyItem({	productNameId: that.model.get('productNameId'), 
															selectedOptions: $.extend({},that.selectedOption),
															singlePrice: that.selectedPrice,
															amount:that.amount,
															orderName: that.getOrderName(),
															remarks: that.getRemarks()
														}));
					window.history.go(-1);
				});	
			}
		},
		_updateSelection: function(){
			var m = this.model;
			this.selectedPrice = m.get('price');
			this.selectedOption = {};
			for(var i=0,length=this.optionWidget.length; i<length; i++){
				var ov = this.optionWidget[i];
				this.selectedOption = $.extend(this.selectedOption, ov.getSelected());
				this.selectedPrice += ov.getSelectedPrice()
			}
			this._updateMoney();
		},
		_updateMoney: function(){
			// $('.Price', this.el).html(_.template(priceTemplate,{price:this.selectedPrice, amount:this.amount}));
			$('#product-box-total', this.el).html(this.selectedPrice*this.amount);
		},
		_addAmount: function(){
			this.amount++;
			var price = this.model.get('price');
			// $('.Price', this.el).html(_.template(priceTemplate,{price:this.selectedPrice, amount:this.amount}));
			$('#product-box-amount', this.el).html(this.amount);
			$('#product-box-total', this.el).html(this.selectedPrice*this.amount);
		},
		_minusAmount: function(){
			this.amount--;
			if(this.amount<1) this.amount=1;
			var price = this.model.get('price');
			// $('.Price', this.el).html(_.template(priceTemplate,{price:this.selectedPrice, amount:this.amount}));
			$('#product-box-amount', this.el).html(this.amount);
			$('#product-box-total', this.el).html(this.selectedPrice*this.amount);
		},
		getOrderName: function(){
			return $.trim($('.orderName', this.el).val());
		},
		getRemarks: function(){
			return $.trim($('.remarks', this.el).val());
		},
		render: function(){
			this.delegateEvents();
			return this;
	  	},
	  	show: function(effectDir, buyBtn, cancelBtn){
	  		if(buyBtn && buyBtn.action) this.buyAction = buyBtn.action;
	  		if(cancelBtn && cancelBtn.action) this.cancelAction = cancelBtn.action;
	  		var buyBtnText = '購買', cancelBtnText = '取消';
	  		if(buyBtn && buyBtn.text) buyBtnText = buyBtn.text;
	  		if(cancelBtn && cancelBtn.text) cancelBtnText = cancelBtn.text;
	  		$('#buyBtn .function-txt', this.el).html(buyBtnText);
	  		$('#cancelBtn .function-txt', this.el).html(cancelBtnText);
	  		
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
})( window.myapp.Images,
	window.myapp.Widget.Scroller, 
	window.myapp.View.NativeProductOptionView,
	window.myapp.View.ProductOptionView,
	window.myapp.Model.BuyItem,
	window.myapp.Model.ShoppingCart,
	window.myapp.Model.ShoppingCartCollection,
	window.myapp.Widget.TouchWidget);
