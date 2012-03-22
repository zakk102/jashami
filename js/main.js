var supportedLang = 'zh-tw';
var defaultLang = 'zh-tw';
var language = window.navigator.userLanguage || window.navigator.language || defaultLang;
language = language.toLowerCase();
if(supportedLang.indexOf(language)<0) language = defaultLang;
i18n.set(window.languages[language]);
$(document).ready(function () {
	$('#backgroundLogo').remove();
	var app_router = new myapp.Router;
	Backbone.history.start({pushState: true});
});