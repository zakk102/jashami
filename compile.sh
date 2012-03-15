java -jar ./compiler.jar --compilation_level=SIMPLE_OPTIMIZATIONS --charset=UTF-8 --jscomp_off=internetExplorerChecks \
./js/libs/i18n/i18n-zakk.js \
./js/libs/zepto/zepto.min.js \
./js/libs/underscore/underscore-min.js \
./js/libs/backbone/backbone-min.js \
./js/libs/iscroll/iscroll.js \
./js/i18n/zh-tw.js \
./js/main.js \
./js/images.js \
./js/widget/scroller.js \
./js/widget/touchWidget.js \
./js/pages/orderTab.js \
./js/pages/historyTab.js \
./js/pages/feedbackTab.js \
./js/pages/aboutUsTab.js \
./js/pages/startPage.js \
./js/router.js \
--js_output_file=complied.js