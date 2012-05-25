(function(ErrorLogServiceUrl, appVersion, LocalModel){
	
	window.onerror = function(errorMeaage, fileName, lineNumber){
/*		var arglen = arguments.length;
		var errorMsg="参数个数："+arglen+"个";
		for(var i=0;i<arglen;i++){
			errorMsg+="\n参数"+(i+1)+"："+arguments[i];
		}
		console.log(errorMsg);
*/
		addErrorLog({ errorType:'general', errorMsg:errorMeaage, errorLocation:fileName+":"+lineNumber });	
		return false;
	}
	
	$(window).bind('ajaxError2', function(event, data){
		var data = $.extend(data, {errorType:'ajaxError'});
		addErrorLog(data);
	});
	
	$(window).bind('imgLoadError', function(event, data){
		var data = $.extend(data, {errorType:'imgLoadError'});
		addErrorLog(data);
	});
	
	var addErrorLog = function(data){
		if(window._develop){
			console.log('develop mode, skip sending error log to server: '+JSON.stringify(data));
			return;
		}
		var d = new Date();
		data = $.extend(data, {errorTime:d.getTime(), appVersion:appVersion, url:window.location.href});
		sendErrorLog(data);
	};
	
	var sendErrorLog = function(errorData){
		var data = {
			uuid: LocalModel.getUUID(),
			userAgent: window.navigator.userAgent,
			osVersion: myapp.PG.Device.getVersion(),
			errorData:[errorData]
		};
		$.ajax({
			type: 'POST',
			url: ErrorLogServiceUrl+"?action=addErrorLog", 
			dataType: 'json',
			data:JSON.stringify(data), 
			success: function(data){
				console.log(data.msg);
			},
			error: function(xhr, type){
			    console.log('sendErrorLog: Ajax error!');
			    addErrorLogBatch(errorData);
			}
		});
	};
	
	var addErrorLogBatch = function(errorData){
		if(!window.myappErrorLog) window.myappErrorLog = [];
		window.myappErrorLog.push(errorData);
		sendErrorLogBatch();
	}
	var sendErrorLogBatch = function(){
		if(!window.myappErrorLog || window.myappErrorLog.length<1) return;
		var data = {
			uuid: LocalModel.getUUID(),
			userAgent: window.navigator.userAgent,
			osVersion: myapp.PG.Device.getVersion(),
			errorData:window.myappErrorLog
		};
		$.ajax({
			type: 'POST',
			url: ErrorLogServiceUrl+"?action=addErrorLog", 
			dataType: 'json',
			data:JSON.stringify(data), 
			success: function(data){
				console.log(data.msg);
				window.myappErrorLog = [];
			},
			error: function(xhr, type){
			    console.log('sendErrorLogBatch: Ajax error!');
			}
		});
	}
	setInterval(sendErrorLogBatch, 10000);
	
})(	window.myapp.Api.ErrorLogServiceUrl,
	window.myapp.Settings.appVersion,
	window.myapp.LocalModel);
