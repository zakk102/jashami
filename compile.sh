# update compiled time to manifest
_now=$(date)
sed -i '' '2 s/#.* Compiled time/'"# $_now Compiled time"'/' ios.manifest
sed -i '' '2 s/#.* Compiled time/'"# $_now Compiled time"'/' android.manifest

# update compiled time to main.js
sed -i '' 's/window.myapp.compiledTime = ".*"./window.myapp.compiledTime = "'"$_now"'";/' js/main.js


# Start compiling

ioslibs="\
./js/libs/stacktrace.js \
./js/libs/phonegap/phonegap-ios.js \
./js/libs/phonegap/phonegap-plugin-ios.js \
./js/libs/phonegap/phonegap-zakk.js \
./js/libs/i18n/i18n-zakk.js \
./js/libs/zepto/zepto.min.js \
./js/libs/underscore/underscore-min.js \
./js/libs/backbone/backbone-min.js \
./js/libs/backbone/backbone-relational.js \
./js/libs/iscroll/iscroll.js \
./js/libs/masonry/masonry.min.js \
"

androidlibs="\
./js/libs/stacktrace.js \
./js/libs/phonegap/phonegap-android.js \
./js/libs/phonegap/phonegap-plugin-android.js \
./js/libs/phonegap/phonegap-zakk.js \
./js/libs/i18n/i18n-zakk.js \
./js/libs/zepto/zepto.min.js \
./js/libs/underscore/underscore-min.js \
./js/libs/backbone/backbone-min.js \
./js/libs/backbone/backbone-relational.js \
./js/libs/iscroll/iscroll.js \
./js/libs/masonry/masonry.min.js \
"

apps="\
./js/settings.js \
./js/applicationCache.js \
./js/localModel.js \
./js/errorCollection.js \
./js/i18n/zh-tw.js \
./js/main.js \
./js/utils.js \
./js/models/addressAndZipcode.js \
./js/models/menuData.js \
./js/models/order.js \
./js/models/shoppingCartData.js \
./js/models/appEvent.js \
./js/models/googleAnalytics.js \
./js/images.js \
./js/widget/touchWidget.js \
./js/widget/scroller.js \
./js/widget/addressSelector.js \
./js/widget/timeSelector.js \
./js/widget/nativeSelector.js \
./js/widget/nativeAddressSelector.js \
./js/widget/nativeTimeSelector.js \
./js/widget/loadingPanel.js \
./js/widget/accordion.js \
./js/views/storeBrief.js \
./js/views/productOption.js \
./js/views/nativeProductOption.js \
./js/views/productPanel.js \
./js/views/shoppingCartPanel.js \
./js/pages/orderTab.js \
./js/pages/historyTab.js \
./js/pages/feedbackTab.js \
./js/pages/aboutUsTab.js \
./js/pages/startPage.js \
./js/pages/storePage.js \
./js/pages/orderInfoPage.js \
./js/pages/userInfoPage.js \
./js/pages/orderResultPage.js \
./js/router.js \
"

java -jar ./compiler.jar --compilation_level=SIMPLE_OPTIMIZATIONS --jscomp_off=internetExplorerChecks $ioslibs --js_output_file=compiled_ioslibs.js
java -jar ./compiler.jar --compilation_level=SIMPLE_OPTIMIZATIONS --jscomp_off=internetExplorerChecks $androidlibs --js_output_file=compiled_androidlibs.js
java -jar ./compiler.jar --compilation_level=SIMPLE_OPTIMIZATIONS --jscomp_off=internetExplorerChecks $apps --charset UTF-8 --js_output_file=compiled_apps.js