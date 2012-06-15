//Filename: js/pages/userInfoPage.js
(function(ImageResource, OrderServiceUrl, Scroller, DateTimeSelector, NativeTimeSelector, LocalModel, TouchWidget){
	var pageTemplate = [
		'<div class="header-wrap">',
			'<div class="header-shadow"></div>',
			'<div class="header-outer">',
				'<div class="header">',
					'<div class="center" style="background:url('+ImageResource["pic/paper_light_yellow"]+') repeat scroll 0 0;">',
						'<div class="BackButton" id="cancelBtn">',
							'<div class="link-wrap" id="back-link-wrap"><div id="back-link" class="icon" style="-webkit-mask-box-image:url('+ImageResource["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_216_circle_arrow_left"]+');"></div><div class="function-txt">返回</div></div>',					
						'</div>',
						'<div id="title" class="function-panel">',
						'</div>',
						'<div class="NextButton" id="waiterBtn">',
							'<div class="link-wrap" id="waiter-link-wrap"><div id="waiter" class="icon" style="-webkit-mask-box-image:url('+ImageResource["css/icons/jashami-logo-toung"]+');"></div><div class="function-txt">送出</div></div>',					
						'</div>',
					'</div>',
				'</div>',
			'</div>',
		'</div>',
		// '<div class="HeaderPanel">',
			// '<div><div class="HeaderButton BackButton"><span class="Pointer"></span><span class="Button">返回</span></div></div>',
			// '<div id="title"></div>',
			// '<div><div class="HeaderButton NextButton"><span class="Button">送出</span><span class="Pointer"></span></div></div>',
		// '</div>',
		
		'<div id="userinfoList" style="color: #000; -webkit-box-flex: 10;display: -webkit-box; position:relative">',
		'</div>'
	].join('');
	
	var infoListTemplate = [
		'<div class="UserInfo">',
			'<p class="userinfo-paragraph" id="ErrorMsg">服務時間已過</p>',
			'<p class="userinfo-paragraph" id="userinfo-paragraph">',
				'<span class="userinfo-line"><span class="DateTimeSelectionBox"></span></span>',
				'<span id="addr-line" class="userinfo-line"><span class="info-title">送到</span><span class="location"><%= location %></span><br /><input type="Text" placeholder="必填，基隆路一段180號7樓" class="INPUT address"></span><br />',
				'<span class="userinfo-line"><span class="info-title">我是</span><input type="Text" placeholder="必填" class="INPUT name"></span><br />',
				'<span class="userinfo-line"><span class="info-title">手機</span><input type="Tel" placeholder="必填" class="INPUT tel"></span><br />',
				'<span class="userinfo-line"><span class="info-title">公司行號</span><input type="Text" placeholder="選填，方便外送人員找地點" class="INPUT company"></span><br />',
				'<span class="userinfo-line"><span class="info-title">統一編號</span><input type="Tel" placeholder="選填" class="INPUT invoice"></span><br />',
				'<span class="userinfo-line"><span class="info-title">特殊需求</span><input type="Text" placeholder="選填，越快越好、可樂要附紙杯" class="INPUT remarks"></span>',
			'</p>',
		'</div>'
	].join('');
	
	var UserInfoPageView = Backbone.View.extend({
		initialize: function(){
			$(this.el).addClass('Base');
			$(this.el).attr("id","UserInfoPageView");
			
			// scroller
			this.scroller = new Scroller();
			$(this.scroller.el).css('width', '100%');
			$(this.scroller.el).css('-webkit-box-flex', '1');
			
			// this page
			$(this.el).html(_.template(pageTemplate));
			$("#userinfoList", this.el).append(this.scroller.render().el);
			this.scroller.html(_.template(infoListTemplate, { location: window.myapp.location }));
			$("#ErrorMsg", this.el).hide();
			$("#userinfo-paragraph", this.el).show();
			
			this.useNative(window.phonegapEnabled);
			//this.useNative(true);
			$(window).bind('useNative', function(e){
				that.useNative(e.data);
			});
			
			new TouchWidget({el:$('#back-link-wrap', this.el)});
			new TouchWidget({el:$('#waiter-link-wrap', this.el)});
			
		},
		_saveUserInput: function(){
			var name = $.trim($('.name', this.el).val());
			var tel = $.trim($('.tel', this.el).val());
			var address = $.trim($('.address', this.el).val());
			LocalModel.setUserName(name);
			LocalModel.setUserPhoneNumber(tel);
			LocalModel.setUserAddress(address);
		},
		_restoreUserInput: function(){
			var name = LocalModel.getUserName();
			var tel = LocalModel.getUserPhoneNumber();
			var address = LocalModel.getUserAddress();
			$('.name', this.el).val(name);
			$('.tel', this.el).val(tel);
			$('.address', this.el).val(address);
		},
		events:{
			"click .BackButton":"goBack",
			"click .NextButton":"sendOrder"
		},
		goBack: function(e){
			if(window.inTransition) return;
			window.isGoBack = true;
			window.history.back();
			this._saveUserInput();
		},
		sendOrder: function(){
			try{
				var that = this;
				var send = false;
				var message = [
					'按下確定後，訂單就會成立，送至系統處理。\n',
					'\n',
					'如果要修改或取消訂單，請等待系統回覆門市資料，\n',
					'請您直接聯繫門市處理。\n',
					'\n',
					'請問您確定要訂購嗎？'
				].join('');
				
				if(this.isFromValided()){
					this._saveUserInput();
					send = confirm(message);
					if(send) {
						var name = $.trim($('.name', this.el).val());
						var tel = $.trim($('.tel', this.el).val());
						var address = (window.myapp.location?window.myapp.location:"") + $.trim($('.address', this.el).val());
						var company = $.trim($('.company', this.el).val());
						var invoice = $.trim($('.invoice', this.el).val());
						var remarks = $.trim($('.remarks', this.el).val());
						var deviceID = window.myapp.LocalModel.getUUID();
						var wantDate = this.timeSelector.getSelection().getTime();
						var buyList = window.shoppingCartCollection.get(this.store).get('buyList').toJSON();
						var sum = window.shoppingCartCollection.get(this.store).get('sum');
						
						var data = {
							"storeID":this.store,
							"type":"Delivery",
							"customerName":name,
							"customerPhone":tel,
							"customerDeviceID":deviceID,
							"customerAddress":address,
							"wantDate":wantDate,
							"buyList":buyList,
							"notes":{
								"公司行號":company,
								"統一編號":invoice,
								"備註":remarks
							},
							"sum":sum
						};
						
						if(window.autoLocalization){
							data.autoLocalization = window.autoLocalization;
						}
						// send order info to server
						if(window.loadingPanel) window.loadingPanel.connectionOut();
						var url = OrderServiceUrl+'?action=sendOrder';
						$.ajax({
			    			type: 'POST',
			  				url: url,
			  				dataType: 'json',
			  				cache : false,
			    			data:JSON.stringify(data), 
			    			success: function(response){ 
			    				try{
				    				if(window.loadingPanel) window.loadingPanel.connectionIn();
									console.log(response);
									window.myapp.orderNumber = response.orderID;
									var href = '#orderResultPage/' + encodeURIComponent(that.store);
									Backbone.history.navigate(href, {trigger: true, replace: false});
									window._widget = false;
								}catch(err){
									$(window).trigger('tryCatchError', {errorMsg:err.message+" at ajax for "+url, errorLocation:err.stack});
									throw err;
								}
							},
							error: function(xhr, type){
								if(window.loadingPanel) window.loadingPanel.connectionIn();
								$(window).trigger('ajaxError2', {errorMsg:url, errorLocation:printStackTrace()});
								alert(type);
							}
						});
					}
				}
			}catch(err){
				$(window).trigger('tryCatchError', {errorMsg:err.message, errorLocation:err.stack});
				throw err;
			}
		},
		isFromValided: function(){
			var wantDate = this.timeSelector.getSelection();
			var name = $.trim($('.name', this.el).val());
			var tel = $.trim($('.tel', this.el).val());
			var address = $.trim($('.address', this.el).val());
			
			if(wantDate === undefined){
				alert('請選擇送達時間！');
				return false;
			}
			
			while(name === ''){
				name = prompt('請輸入您的稱呼！');
				if(name === null) return false;
				name = $.trim(name);
			}
			$('.name', this.el).val(name);
			
			while(tel === ''){
				tel = prompt('請輸入手機號碼！');
				if(tel === null) return false;
				tel = $.trim(tel);
			}
			
			while(!this.isTel(tel)){
				tel = prompt('手機格式錯誤，請輸入正確的手機號碼！', tel);
				if(tel === null) return false;
				tel = $.trim(tel);
			}
			$('.tel', this.el).val(tel);
			
			while(address === ''){
				address = prompt('請輸入您的地址！');
				if(address === null) return false;
				address = $.trim(address);
			}
			$('.address', this.el).val(address); 
			
			return true;
		},
		isTel: function(tel){
			//var reg = /^([0-9]|[\-])+$/;
			var reg = /^[0]{1}[9]{1}\d{2}[- ]?\d{3}[- ]?\d{3}$/;
			if(tel.length < 10 || tel.length > 12){
				return false;
			}
			else{
				return reg.exec(tel);
			}
		},
		setTitle: function(title){
			$('#title', this.el).html(title);
		},
		setStore: function(store){
			this.store = store;
		},
		setAvailableTime: function(list){
			if(list && list.length>0){
				$("#ErrorMsg", this.el).hide();
				$("#userinfo-paragraph", this.el).show();
				this.timeSelector.setDataList(list);
			}else{
				$("#ErrorMsg", this.el).show();
				$("#userinfo-paragraph", this.el).hide();
			}
		},
		render: function(){
			try{			
				if(window.myapp.location) $('.location', this.el).html(window.myapp.location+"的");
				else $('.location', this.el).html('');
				this.scroller.render();
				this.delegateEvents();
				this._restoreUserInput();
				return this;
			}catch(err){
				$(window).trigger('tryCatchError', {errorMsg:err.message, errorLocation:err.stack});
			}
	  	},
	  	useNative: function(isNative){
			var timeSelector;
			if(isNative){
				timeSelector = new NativeTimeSelector();
			}else{
				timeSelector = new DateTimeSelector();
			}
			this.timeSelector = timeSelector;
			$('.DateTimeSelectionBox', this.el).html(this.timeSelector.render().el);
		}
	});
	window.myapp = window.myapp || {};
	window.myapp.UserInfoPageView = UserInfoPageView;
})(	window.myapp.Images,
	window.myapp.Api.OrderServiceUrl,
	window.myapp.Widget.Scroller,
	window.myapp.Widget.DateTimeSelector,
	window.myapp.Widget.NativeTimeSelector,
	window.myapp.LocalModel,
	window.myapp.Widget.TouchWidget);
