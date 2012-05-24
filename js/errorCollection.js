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
	
	
	var addErrorLog = function(data){
		var d = new Date();
		data = $.extend(data, {errorTime:d.getTime(), appVersion:appVersion});
		sendErrorLog(data);
	};
	
	var sendErrorLog = function(errorData){
		var data = {
			uuid: LocalModel.getUUID(),
			userAgent: window.navigator.userAgent,
			osVersion: myapp.PG.Device.getVersion(),
			errorData:[errorData]
		};
		console.log(data);
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
			}
		});
	}
	
})(	window.myapp.Api.ErrorLogServiceUrl,
	window.myapp.Settings.appVersion,
	window.myapp.LocalModel);
