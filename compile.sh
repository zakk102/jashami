java -jar ../compiler.jar --compilation_level=SIMPLE_OPTIMIZATIONS --charset=UTF-8 --jscomp_off=internetExplorerChecks \
./js/libs/i18n/i18n-zakk.js \
./js/libs/zepto/zepto.min.js \
./js/libs/underscore/underscore-min.js \
./js/libs/backbone/backbone-min.js \
./js/libs/iscroll/iscroll.js \
./js/i18n/zh-tw.js \
./js/main.js \
./js/images.js \
./js/views/widget/scroller.js \
./js/views/widget/touchWidget.js \
./js/views/pages/orderTab.js \
./js/views/pages/historyTab.js \
./js/views/pages/feedbackTab.js \
./js/views/pages/aboutUsTab.js \
./js/views/pages/startPage.js \
./js/router.js \
--js_output_file=complied.js