//Filename: js/pages/userInfoPage.js
(function(Scroller){
	var pageTemplate = [
		'<div class="HeaderPanel">',
			'<div><div class="HeaderButton BackButton"><span class="Pointer"></span><span class="Button">返回</span></div></div>',
			'<div id="title"></div>',
			'<div></div>',
		'</div>',
		'<div id="userinfoList" style="background-color:rgba(255, 255, 255, 0.75) ; -webkit-box-flex: 10;display: -webkit-box; -webkit-box-orient: horizontal;">',
		'</div>'
	].join('');
	
	var infoListTemplate = [
		'<table class="UserInfo">',
			'<colgroup><col></colgroup>',
			'<tbody>',
				'<tr><td><div>送達時間</div></td><td><div class="DateTimeSelectionBox"></div></td></tr>',
				'<tr><td><div>稱呼</div></td><td><input type="Text" placeholder="必填" class="INPUT Text"></td></tr>',
				'<tr><td><div>手機</div></td><td><input type="Tel" placeholder="必填" class="INPUT Tel"></td></tr>',
				'<tr><td><div>地址</div></td><td>',
					'<table cellspacing="0" cellpadding="0" style="width: 100%; "><tbody><tr>',
						'<td align="left" style="vertical-align: middle; " width="200px"><div style="font-size: 12pt; ">台北市信義區</div></td>',
						'<td align="left" style="vertical-align: middle; "><input type="Text" placeholder="必填" class="INPUT Text" style=""></td>',
					'</tr></tbody></table>',
				'</td></tr>',
				'<tr><td><div>公司行號</div></td><td><input type="Text" placeholder="選填，公司請註明，以便外送人員找尋" class="INPUT Text"></td></tr>',
				'<tr><td><div>統一編號</div></td><td><input type="Tel" placeholder="選填" class="INPUT Tel"></td></tr>',
				'<tr><td><div>附註</div></td><td><input type="Text" placeholder="選填，任何您想補充說明的" class="INPUT Text"></td></tr>',
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
		},
		goBack: function(){
			if(window.inTransition) return;
			window.isGoBack = true;
			window.history.back();
		},
		render: function(){
			// re-bind event
			this.scroller.render();
			this.delegateEvents();
			return this;
	  	}
	});
	window.myapp = window.myapp || {};
	window.myapp.UserInfoPageView = UserInfoPageView;
})(window.myapp.Widget.Scroller);
