(function(AppEventServiceUrl, LocalModel){
	
	var AppEvent = {
		_develop: true,
		sendEvent: function(data){
			if(data){
				data.UUID = LocalModel.getUUID();
			}
			if(!this._develop){
				$.ajax({
    				type: 'POST',
  					url: AppEventServiceUrl+'?action=sendEvent',
					dataType: 'json',
					data:JSON.stringify(data), 
					success: function(response){ 
				  		console.log(response);
				  	}
				});
			}else{
				console.log('develop mode, disable event sending: '+data.eventCategory+' '+data.eventAction+' '+data.eventLabel);
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
			this.sendEvent(data);
		},
		goPage: function(){
			var data = {};
			data.eventCategory = "Page";
			data.eventAction = "Enter";
			data.eventLabel = window.location.hash;
			this.sendEvent(data);
		}
	};
	
	window.myapp = window.myapp || {};
	window.myapp.AppEvent = AppEvent;
})(	window.myapp.Api.AppEventServiceUrl,
	window.myapp.LocalModel);
