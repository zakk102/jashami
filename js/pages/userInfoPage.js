//Filename: js/pages/userInfoPage.js
(function(Scroller){
	var pageTemplate = [
		'<div class="HeaderPanel">',
			'<div><div class="HeaderButton BackButton"><span class="Pointer"></span><span class="Button">返回</span></div></div>',
			'<div id="title"></div>',
			'<div><div class="HeaderButton NextButton"><span class="Button">送出</span><span class="Pointer"></span></div></div>',
		'</div>',
		'<div id="userinfoList" style="color: #000; -webkit-box-flex: 10;display: -webkit-box; -webkit-box-orient: horizontal;">',
		'</div>'
	].join('');
	
	var infoListTemplate = [
		'<table class="UserInfo">',
			'<colgroup><col></colgroup>',
			'<tbody>',
				'<tr><td><div>送達時間</div></td><td><div class="DateTimeSelectionBox"></div></td></tr>',
				'<tr><td><div>稱呼</div></td><td><input type="Text" placeholder="必填" class="INPUT name"></td></tr>',
				'<tr><td><div>手機</div></td><td><input type="Tel" placeholder="必填" class="INPUT tel"></td></tr>',
				'<tr><td><div>地址</div></td><td>',
					'<table cellspacing="0" cellpadding="0" style="width: 100%; "><tbody><tr>',
						'<td align="left" style="vertical-align: middle; " width="200px"><div style="font-size: 12pt; ">台北市信義區</div></td>',
						'<td align="left" style="vertical-align: middle; "><input type="Text" placeholder="必填" class="INPUT address" style=""></td>',
					'</tr></tbody></table>',
				'</td></tr>',
				'<tr><td><div>公司行號</div></td><td><input type="Text" placeholder="選填，公司請註明，以便外送人員找尋" class="INPUT company"></td></tr>',
				'<tr><td><div>統一編號</div></td><td><input type="Tel" placeholder="選填" class="INPUT invoice"></td></tr>',
				'<tr><td><div>附註</div></td><td><input type="Text" placeholder="選填，任何您想補充說明的" class="INPUT remarks"></td></tr>',
			'</tbody>',
		'</table>'
	].join('');
	
	var UserInfoPageView = Backbone.View.extend({
		initialize: function(){
			$(this.el).addClass('Base');
			$(this.el).attr("id","UserInfoPageView");
			$(this.el).attr("style","height:100%; width:100%;");
			
			// scroller
			this.scroller = new Scroller();
			$(this.scroller.el).css('width', '100%');
			$(this.scroller.el).css('-webkit-box-flex', '1');
			
			// this page
			$(this.el).html(_.template(pageTemplate));
			$("#userinfoList", this.el).append(this.scroller.render().el);
			this.scroller.html(_.template(infoListTemplate));
		},
		events:{
			"click .BackButton":"goBack",
			"click .NextButton":"sendOrder"
		},
		goBack: function(){
			if(window.inTransition) return;
			window.isGoBack = true;
			window.history.back();
		},
		sendOrder: function(){
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
				send = confirm(message);
				if(send) {
					// send order info to server
					location.href = '#orderResultPage/' + this.store;
				}
			}
		},
		isFromValided: function(){
			var name = $.trim($('.name', this.el).val());
			var tel = $.trim($('.tel', this.el).val());
			var address = $.trim($('.address', this.el).val());
			var valided = false;
			
			if(name === ''){
				name = prompt('請輸入您的稱呼！');
			}else if(tel === ''){
				tel = prompt('請輸入手機號碼！');
			}else if(!this.isTel(tel)){
				tel = prompt('手機格式錯誤，請輸入正確的手機號碼！', tel);
			}else if(address === ''){
				address = prompt('請輸入您的地址！');
			} else {
				valided = true;
			}
			
			$('.name', this.el).val(name);
			$('.tel', this.el).val(tel);
			$('.address', this.el).val(address);
			
			return valided;
		},
		isTel: function(tel){
			var reg = /^([0-9]|[\-])+$/;
			if(tel.length < 10 || tel.length > 12){
				return false;
			}
			else{
				return reg.exec(tel);
			}
		},
		setStore: function(store){
			this.store = store;
		},
		render: function(){
			// re-bind event
			$('#title', this.el).html(this.store);
			this.scroller.render();
			this.delegateEvents();
			return this;
	  	}
	});
	window.myapp = window.myapp || {};
	window.myapp.UserInfoPageView = UserInfoPageView;
})(window.myapp.Widget.Scroller);
