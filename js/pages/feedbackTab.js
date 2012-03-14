// Filename: views/pages/feedbackTab.js
(function(TouchWidget, Scroller){
	var tabTemplate = [
		"<div class='about_text' style='width:100%;'>",
			"感謝您使用Jashami(甲蝦米)<br/>",
			"您希望哪些商家擁有Jashami的服務，請推薦給我們：",
			"<input id='recommendation' type='Text' class='INPUT Text'>",
			"請留下您的寶貴意見，我們將為您提供更好的服務:",
			"<input id='opinion' type='Text' class='INPUT Text'>",
			"<div id='sendFeedbackBtn' class='SubmitButton'>送出</div>",
		"</div>",
	].join('');
	
	var FeedbackTabView = Backbone.View.extend({
		initialize: function(){
			var scroller = new Scroller();
			scroller.html(_.template(tabTemplate));
			$(this.el).html(scroller.el);
			$(this.el).css('background-color', 'rgba(255, 255, 255, 0.75)');
			$(this.el).css('display', '-webkit-box');	
			$(scroller.el).css('width', '100%');
			this.sendFeedbackBtn = new TouchWidget({ el: $('#sendFeedbackBtn', this.el) });
			this.sendFeedbackBtn.changeColorWhenTouch = true;
		},
		events: {
    		'clickByTouch #sendFeedbackBtn': 'sendFeedback'
  		},
		render: function(){
			this.sendFeedbackBtn.delegateEvents();
			this.delegateEvents();
			return this;
	   	},
	   	sendFeedback: function(){
	   		var recommandation = $('#recommendation', this.el).val();
	   		var opinion = $('#opinion', this.el).val();
	   		alert('sendFeedback' + recommandation + opinion);
	   	}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.FeedbackTabView = FeedbackTabView;
})(window.myapp.Widget.TouchWidget, window.myapp.Widget.Scroller);
