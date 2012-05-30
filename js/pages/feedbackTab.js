// Filename: js/pages/feedbackTab.js
(function(Scroller, FeedbackServiceUrl, LocalModel){
	var tabTemplate = [
		"<p class='about_text' >",
			"甲蝦米有這些問題：<br/>",
			"<textarea id='opinion' type='Text' class='INPUT Text'></textarea><br/><br/>",
			"我想要這些店家加入甲蝦米：<br/>",
			"<input id='recommendation' type='Text' class='INPUT Text'><br/><br/>",
			"我的手機是",
			"<input id='cellphone' class='INPUT Text' value='<%= cellphone %>'><br/>",
			"請客服儘快跟我聯絡",

		"</p>",
		"<p class='submit-paragraph'><a id='sendFeedbackBtn' class='SubmitButton'>送出</a></p>"
	].join('');
	
	var FeedbackTabView = Backbone.View.extend({
		initialize: function(){
			var cellphone=LocalModel.getUserPhoneNumber();
			if(!cellphone)cellphone="";
			var scroller = new Scroller();
			this.scroller = scroller;
			scroller.html(_.template(tabTemplate,{cellphone:cellphone}));
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
	   		var url = FeedbackServiceUrl+'?action=sendFeedback';
	   		$.ajax({
				type: 'POST',
				url: url,
				dataType: 'json',
				cache : false,
				data:JSON.stringify(data), 
				success: function(response){ 
					try{
				  		console.log(response);
				  		alert('謝謝您的寶貴意見');
				  	}catch(err){
				  		$(window).trigger('tryCatchError', {errorMsg:err.message+" at ajax for "+url, errorLocation:err.stack});
				  	}
			  	},
			  	error: function(xhr, type){
			  		$(window).trigger('ajaxError2', {errorMsg:url, errorLocation:printStackTrace()});
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