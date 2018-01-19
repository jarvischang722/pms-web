"no-alert": 0,//禁止使用alert confirm prompt
 "no-array-constructor": 2,//禁止使用數組構造器
 "no-bitwise": 0,//禁止使用按位運算符
 "no-caller": 1,//禁止使用arguments.caller或arguments.callee
 "no-catch-shadow": 2,//禁止catch子句參數與外部作用域變量同名
 "no-class-assign": 2,//禁止給類賦值
 "no-cond-assign": 2,//禁止在條件表達式中使用賦值語句
 "no-console": 2,//禁止使用console
 "no-const-assign": 2,//禁止修改const聲明的變量
 "no-constant-condition": 2,//禁止在條件中使用常量表達式 if(true) if(1)
 "no-continue": 0,//禁止使用continue
 "no-control-regex": 2,//禁止在正則表達式中使用控製字符
 "no-debugger": 2,//禁止使用debugger
 "no-delete-var": 2,//不能對var聲明的變量使用delete操作符
 "no-div-regex": 1,//不能使用看起來像除法的正則表達式/=foo/
 "no-dupe-keys": 2,//在創建對象字面量時不允許鍵重複 {a:1,a:1}
 "no-dupe-args": 2,//函數參數不能重複
 "no-duplicate-case": 2,//switch中的case標籤不能重複
 "no-else-return": 2,//如果if語句裡面有return,後面不能跟else語句
 "no-empty": 2,//塊語句中的內容不能為空
 "no-empty-character-class": 2,//正則表達式中的[]內容不能為空
 "no-empty-label": 2,//禁止使用空label
 "no-eq-null": 2,//禁止對null使用==或!=運算符
 "no-eval": 1,//禁止使用eval
 "no-ex-assign": 2,//禁止給catch語句中的異常參數賦值
 "no-extend-native": 2,//禁止擴展native對象
 "no-extra-bind": 2,//禁止不必要的函數綁定
 "no-extra-boolean-cast": 2,//禁止不必要的bool轉換
 "no-extra-parens": 2,//禁止非必要的括號
 "no-extra-semi": 2,//禁止多餘的冒號
 "no-fallthrough": 1,//禁止switch穿透
 "no-floating-decimal": 2,//禁止省略浮點數中的0 .5 3.
 "no-func-assign": 2,//禁止重複的函數聲明
 "no-implicit-coercion": 1,//禁止隱式轉換
 "no-implied-eval": 2,//禁止使用隱式eval
 "no-inline-comments": 0,//禁止行內備註
 "no-inner-declarations": [2, "functions"],//禁止在塊語句中使用聲明（變量或函數）
 "no-invalid-regexp": 2,//禁止無效的正則表達式
 "no-invalid-this": 2,//禁止無效的this，只能用在構造器，類，對象字面量
 "no-irregular-whitespace": 2,//不能有不規則的空格
 "no-iterator": 2,//禁止使用__iterator__ 屬性
 "no-label-var": 2,//label名不能與var聲明的變量名相同
 "no-labels": 2,//禁止標籤聲明
 "no-lone-blocks": 2,//禁止不必要的嵌套塊
 "no-lonely-if": 2,//禁止else語句內只有if語句
 "no-loop-func": 1,//禁止在循環中使用函數（如果沒有引用外部變量不形成閉包就可以）
 "no-mixed-requires": [0, false],//聲明時不能混用聲明類型
 "no-mixed-spaces-and-tabs": [2, false],//禁止混用tab和空格
 "linebreak-style": [0, "windows"],//換行風格
 "no-multi-spaces": 1,//不能用多餘的空格
 "no-multi-str": 2,//字符串不能用\換行
 "no-multiple-empty-lines": [1, {"max": 2}],//空行最多不能超過2行
 "no-native-reassign": 2,//不能重寫native對象
 "no-negated-in-lhs": 2,//in 操作符的左邊不能有!
 "no-nested-ternary": 0,//禁止使用嵌套的三目運算
 "no-new": 1,//禁止在使用new構造一個實例後不賦值
 "no-new-func": 1,//禁止使用new Function
 "no-new-object": 2,//禁止使用new Object()
 "no-new-require": 2,//禁止使用new require
 "no-new-wrappers": 2,//禁止使用new創建包裝實例，new String new Boolean new Number
 "no-obj-calls": 2,//不能調用內置的全局對象，比如Math() JSON()
 "no-octal": 2,//禁止使用八進制數字
 "no-octal-escape": 2,//禁止使用八進制轉義序列
 "no-param-reassign": 2,//禁止給參數重新賦值
 "no-path-concat": 0,//node中不能使用__dirname或__filename做路徑拼接
 "no-plusplus": 0,//禁止使用++，--
 "no-process-env": 0,//禁止使用process.env
 "no-process-exit": 0,//禁止使用process.exit()
 "no-proto": 2,//禁止使用__proto__屬性
 "no-redeclare": 2,//禁止重複聲明變量
 "no-regex-spaces": 2,//禁止在正則表達式字面量中使用多個空格 /foo bar/
 "no-restricted-modules": 0,//如果禁用了指定模塊，使用就會報錯
 "no-return-assign": 1,//return 語句中不能有賦值表達式
 "no-script-url": 0,//禁止使用javascript:void(0)
 "no-self-compare": 2,//不能比較自身
 "no-sequences": 0,//禁止使用逗號運算符
 "no-shadow": 2,//外部作用域中的變量不能與它所包含的作用域中的變量或參數同名
 "no-shadow-restricted-names": 2,//嚴格模式中規定的限制標識符不能作為聲明時的變量名使用
 "no-spaced-func": 2,//函數調用時 函數名與()之間不能有空格
 "no-sparse-arrays": 2,//禁止稀疏數組， [1,,2]
 "no-sync": 0,//nodejs 禁止同步方法
 "no-ternary": 0,//禁止使用三目運算符
 "no-trailing-spaces": 1,//一行結束後面不要有空格
 "no-this-before-super": 0,//在調用super()之前不能使用this或super
 "no-throw-literal": 2,//禁止拋出字面量錯誤 throw "error";
 "no-undef": 1,//不能有未定義的變量
 "no-undef-init": 2,//變量初始化時不能直接給它賦值為undefined
 "no-undefined": 2,//不能使用undefined
 "no-unexpected-multiline": 2,//避免多行表達式
 "no-underscore-dangle": 1,//標識符不能以_開頭或結尾
 "no-unneeded-ternary": 2,//禁止不必要的嵌套 var isYes = answer === 1 ? true : false;
 "no-unreachable": 2,//不能有無法執行的代碼
 "no-unused-expressions": 2,//禁止無用的表達式
 "no-unused-vars": [2, {"vars": "all", "args": "after-used"}],//不能有聲明後未被使用的變量或參數
 "no-use-before-define": 2,//未定義前不能使用
 "no-useless-call": 2,//禁止不必要的call和apply
 "no-void": 2,//禁用void操作符
 "no-var": 0,//禁用var，用let和const代替
 "no-warning-comments": [1, { "terms": ["todo", "fixme", "xxx"], "location": "start" }],//不能有警告備註
 "no-with": 2,//禁用with

 "array-bracket-spacing": [2, "never"],//是否允許非空數組裡面有多餘的空格
 "arrow-parens": 0,//箭頭函數用小括號括起來
 "arrow-spacing": 0,//=>的前/後括號
 "accessor-pairs": 0,//在對像中使用getter/setter
 "block-scoped-var": 0,//塊語句中使用var
 "brace-style": [1, "1tbs"],//大括號風格
 "callback-return": 1,//避免多次調用回調什麼的
 "camelcase": 2,//強制駝峰法命名
 "comma-dangle": [2, "never"],//對象字面量項尾不能有逗號
 "comma-spacing": 0,//逗號前後的空格
 "comma-style": [2, "last"],//逗號風格，換行時在行首還是行尾
 "complexity": [0, 11],//循環複雜度
 "computed-property-spacing": [0, "never"],//是否允許計算後的鍵名什麼的
 "consistent-return": 0,//return 後面是否允許省略
 "consistent-this": [2, "that"],//this別名
 "constructor-super": 0,//非派生類不能調用super，派生類必須調用super
 "curly": [2, "all"],//必須使用 if(){} 中的{}
 "default-case": 2,//switch語句最後必須有default
 "dot-location": 0,//對象訪問符的位置，換行的時候在行首還是行尾
 "dot-notation": [0, { "allowKeywords": true }],//避免不必要的方括號
 "eol-last": 0,//文件以單一的換行符結束
 "eqeqeq": 2,//必須