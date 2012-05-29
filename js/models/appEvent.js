(function(AppEventServiceUrl, LocalModel){
	
	var AppEvent = {
		sendEvent: function(data){
			if(data){
				data.UUID = LocalModel.getUUID();
			}
			if(!window._develop){
				var url = AppEventServiceUrl+'?action=sendEvent';
				$.ajax({
    				type: 'POST',
  					url: url,
					dataType: 'json',
					cache : false,
					data:JSON.stringify(data), 
					success: function(response){ 
				  		console.log(response);
				  	},
				  	error: function(xhr, type){
					    console.log('sendEvent: Ajax error!');
					    $(window).trigger('ajaxError2', {errorMsg:url, errorLocation:printStackTrace()});
					}
				});
			}else{
				console.log('develop mode, skip event sending: '+data.eventCategory+', '+data.eventAction+', '+data.eventLabel+', '+data.eventPararmeter);
			}
		},
		onStart: function(){
			var data = {};
			data.eventCategory = "App";
			data.eventAction = "Enter";
			this.sendEvent(data);
		},
		onPause: function(){
			var data = {};
			data.eventCategory = "App";
			data.eventAction = "Pause";
			data.eventLabel = window.location.hash;
			this.sendEvent(data);
		},
		onResume: function(){
			var data = {};
			data.eventCategory = "App";
			data.eventAction = "Resume";
			data.eventLabel = window.location.hash;
			this.sendEvent(data);
		},
		goPage: function(){
			var data = {};
			data.eventCategory = "Page";
			data.eventAction = "Enter";
			var hash = window.location.hash;
			data.eventLabel = hash.substring(0, hash.indexOf('/'));;
			data.eventPararmeter = hash.substring(hash.indexOf('/')+1);;
			this.sendEvent(data);
		}
	};
	
	window.myapp = window.myapp || {};
	window.myapp.AppEvent = AppEvent;
})(	window.myapp.Api.AppEventServiceUrl,
	window.myapp.LocalModel);
