// Filename: js/pages/feedbackTab.js
(function(Scroller, FeedbackServiceUrl, LocalModel){
	var tabTemplate = [
		"<div class='about_text' style='width:100%;'>",
			"感謝您使用Jashami(甲蝦米)<br/>",
			"您希望哪些商家擁有Jashami的服務，請推薦給我們：",
			"<input id='recommendation' type='Text' class='INPUT Text'>",
			"請留下您的寶貴意見，我們將為您提供更好的服務:",
			"<input id='opinion' type='Text' class='INPUT Text'>",
			"<a id='sendFeedbackBtn' class='SubmitButton'>送出</a>",
		"</div>",
	].join('');
	
	var FeedbackTabView = Backbone.View.extend({
		initialize: function(){
			var scroller = new Scroller();
			this.scroller = scroller;
			scroller.html(_.template(tabTemplate));
			$(this.el).html(scroller.el);
			$(this.el).css('display', '-webkit-box');	
			$(this.el).css('-webkit-box-flex', '10');
			$(scroller.el).css('width', '100%');
		},
		events: {
    		'click #sendFeedbackBtn': 'sendFeedback'
  		},
		render: function(){
			this.scroller.render();
			this.delegateEvents();
			return this;
	   	},
	   	sendFeedback: function(){
	   		var recommandation = $('#recommendation', this.el).val();
	   		var opinion = $('#opinion', this.el).val();
	   		var data = {};
	   		data.UUID = LocalModel.getUUID();
	   		data.appName = "o2oist";
	   		data.customerName = LocalModel.getUserName();
	   		data.customerPhoneNumber = LocalModel.getUserPhoneNumber();
	   		data.feedbacks = {};
	   		data.feedbacks.recommandation = recommandation;
	   		data.feedbacks.opinion = opinion;
	   		$.ajax({
				type: 'POST',
				url: FeedbackServiceUrl+'?action=sendFeedback',
				dataType: 'json',
				data:JSON.stringify(data), 
				success: function(response){ 
			  		console.log(response);
			  		alert('謝謝您的寶貴意見');
			  	},
			  	error: function(xhr, type){
				    alert('謝謝您的寶貴意見');
				}
			});
	   	}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.FeedbackTabView = FeedbackTabView;
})(	window.myapp.Widget.Scroller,
	window.myapp.Api.FeedbackServiceUrl,
	window.myapp.LocalModel);