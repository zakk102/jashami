// Filename: views/pages/aboutUsTab.js
(function(appVersion, ChildBrowser, Images, Scroller){
	var tabTemplate = [
		'<div id="about-panel" data-scrollable="y">',
			'<p id="intro">',
				//'早上九點半～晚上七點半<br/>',
				//'可以向甲蝦米客服人員訂餐<br/>',
				
				'天天 09:30  到  19:30  輕鬆叫外送！<br/>',
				//'只有四個步驟：<br/>',
				'<span class="intro-step"><span class="intro-step-index">1</span><span class="intro-step-icon-wrap"><span id="intro-step1-icon" class="intro-step-icon" style="-webkit-mask-box-image:url('+Images["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_027_search"]+');"></span><span class="intro-step-text">尋找店家</span></span></span><br/>',
				'<span class="intro-step"><span class="intro-step-index">2</span><span class="intro-step-icon-wrap"><span id="intro-step2-icon" class="intro-step-icon" style="-webkit-mask-box-image:url('+Images["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_209_cart_in"]+');"></span><span class="intro-step-text">選擇餐點</span></span></span><br/>',
				'<span class="intro-step"><span class="intro-step-index">3</span><span class="intro-step-icon-wrap"><span id="intro-step3-icon" class="intro-step-icon" style="-webkit-mask-box-image:url('+Images["css/icons/jashami-logo-toung"]+');"></span><span class="intro-step-text">送給客服</span></span></span><br/>',
				'<span class="intro-step"><span class="intro-step-index">4</span><span class="intro-step-icon-wrap"><span id="intro-step4-icon" class="intro-step-icon" style="-webkit-mask-box-image:url('+Images["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_139_phone"]+');"></span><span class="intro-step-text">客服回電</span></span></span><br/>',
				'不清楚？有疑問？<br/>',
				'<a href="tel:0227638295" id="about-call" class="button"><span id="about-call-icon" class="icon" style="-webkit-mask-box-image:url('+Images["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_139_phone"]+');"></span>打電話</a>',
				'或<a href="mailto:service@o2oist.com" id="about-email" class="button"><span id="about-email-icon" class="icon" style="-webkit-mask-box-image:url('+Images["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_124_message_plus"]+');"></span>寄信</a>給客服<br/>', 
				'到<a class="button outButton" href="http://www.facebook.com/o2oist?v=feed" target="_blank"><span id="fanpage-icon" class="icon" style="-webkit-mask-box-image:url('+Images["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_320_facebook"]+');"></span>粉絲頁</a>給我們加油打氣！',
			'</p>',
		'</div>',
		'<div style="text-align:right;font-size:50%;color:gray;"><%= appVersion %></div>'
	].join('');
	
	var AboutUsTabView = Backbone.View.extend({
		initialize: function(){
			var scroller = new Scroller();
			scroller.html(_.template(tabTemplate, {appVersion:appVersion}));
			$(this.el).html(scroller.el);
			$(scroller.el).css('width', '100%');
		},
		events: {
			"click a.outButton":"goToFanPage"
  		},
  		goToFanPage: function(event){
  			if(window.phonegapEnabled){
  				var url = event.currentTarget.href;
  				ChildBrowser.go(url);
  				event.preventDefault();
  			}
  		},
		render: function(tab){
			return this;
	   }
	});
	
	window.myapp = window.myapp || {};
	window.myapp.AboutUsTabView = AboutUsTabView;
})(	window.myapp.Settings.appVersion,
	window.myapp.PG.ChildBrowser,
	window.myapp.Images,
	window.myapp.Widget.Scroller);
