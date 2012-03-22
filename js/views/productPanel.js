//Filename: js/views/ProductPanel.js
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
		'</div>'
	].join('');
	
	var priceTemplate = '<%=price%> X <%=amount%> = <%=price*amount%>元';
	
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
			"click #plusBtn":"addAmount",
			"click #minusBtn":"minusAmount"
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
		addAmount: function(){
			this.amount++;
			var price = this.model.get('_price');
			$('.Price', this.el).html(_.template(priceTemplate,{price:price, amount:this.amount}));
		},
		minusAmount: function(){
			this.amount--;
			if(this.amount<1) this.amount=1;
			var price = this.model.get('_price');
			$('.Price', this.el).html(_.template(priceTemplate,{price:price, amount:this.amount}));
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
