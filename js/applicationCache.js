(function(){
	var cacheStatusValues = [];
	cacheStatusValues[0] = 'uncached';
	cacheStatusValues[1] = 'idle';
	cacheStatusValues[2] = 'checking';
	cacheStatusValues[3] = 'downloading';
	cacheStatusValues[4] = 'updateready';
	cacheStatusValues[5] = 'obsolete';
	
	var cache = window.applicationCache;
	cache.addEventListener('cached', logEvent, false);
	cache.addEventListener('checking', logEvent, false);
	cache.addEventListener('downloading', logEvent, false);
	cache.addEventListener('error', logEvent, false);
	cache.addEventListener('noupdate', logEvent, false); 
	cache.addEventListener('obsolete', logEvent, false);
	cache.addEventListener('progress', logEvent, false);
	cache.addEventListener('updateready', logEvent, false);
	
	function logEvent(e) {
		var online, status, type, message;
		online = (isOnline()) ? 'yes' : 'no';
		status = cacheStatusValues[cache.status];
     	type = e.type;
     	message = 'online: ' + online;
     	message+= ', event: ' + type;
     	message+= ', status: ' + status;
	    if (type == 'error' && navigator.onLine) {
	        message+= ' There was an unknown error, check your Cache Manifest.';
	    }
	    log(''+message);
	}
	
	function log(s) { window.console.log(s); }

	function isOnline() { return navigator.onLine; }
    
    cache.addEventListener('updateready', function(e){
    	if (cacheStatusValues[cache.status] != 'idle') {
    		cache.swapCache();
    		log('Swapped/updated the Cache Manifest.');
            window.location.reload();
        }
    }, false);

// busy panel    
    function downloadCacheCallback(e){
    	if(window.loadingPanel) window.loadingPanel.$el.show();
    }
    function readyCacheCallback(e){
    	if(window.loadingPanel) window.loadingPanel.$el.hide();
    }
	cache.addEventListener('downloading', downloadCacheCallback);
	cache.addEventListener('progress', downloadCacheCallback);
	cache.addEventListener('updateready', downloadCacheCallback);
	cache.addEventListener('cached', downloadCacheCallback);
	cache.addEventListener('error', downloadCacheCallback);
})();
