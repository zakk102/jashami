(function(isOpenNow){
	
	var GoogleAnalytics = {
		_develop: true,
		sendTrackEvent: function(category, action, label){
			if(!this._develop){
				if (window._gaq) {
		    		window._gaq.push(['_trackEvent', category, action, label]);
				}else{
					console.log('GA not load');
				}
			}else{
				console.log('develop mode, disable event sending GA event tracking: '+category+' '+action+' '+label);
			}
		},
		sendTrackUrl: function(url){
			if(!this._develop){
				if (window._gaq) {
		    		window._gaq.push(['_trackPageview', url]);
				}else{
					console.log('GA not load');
				}
			}else{
				console.log('develop mode, disable event sending GA url tracking: '+url);
			}
		},
		goPage: function(){
			var url = window.location.pathname + window.location.hash + "?open=" + isOpenNow();
			this.sendTrackUrl(url);
		}
	};
	
	window.myapp = window.myapp || {};
	window.myapp.GoogleAnalytics = GoogleAnalytics;
})(	window.myapp.Settings.isOpenNow);
