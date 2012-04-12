// i18n
	var supportedLang = 'zh-tw';
	var defaultLang = 'zh-tw';
	var language = window.navigator.userLanguage || window.navigator.language || defaultLang;
	language = language.toLowerCase();
	if(supportedLang.indexOf(language)<0) language = defaultLang;
	i18n.set(window.languages[language]);

// phonegap
	$(document).bind("deviceready", function(){
		window.console.log("phonegap load");
		window.phonegapEnabled = true;
	});
// start
	$(document).ready(function () {
		$('#backgroundLogo').remove();
		var app_router = new myapp.Router;
		Backbone.history.start();
	});