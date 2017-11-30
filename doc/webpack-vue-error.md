# webpack 編譯 vue 錯誤集

###1. 
錯誤訊息: **template syntax error Component template should contain exactly one root element. If you are using v-if on multiple elements, use v-else-if to chain them instead.** \
錯誤原因：vue模板只支持一個元素，不能並列包含兩個以上。 
解決辦法：在並列控件的最外層加上< div>< /div> 