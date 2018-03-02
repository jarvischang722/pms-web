Bacchus 客製Vue組件文件
===================

描述
-------------

src :   /path/to/bacchus4web/public/src/components/common/bacUIComps/main.js
dist:   /path/to/bacchus4web/public/js/common/BacUIComps.js

會將這個BacUIComps.js檔案掛在框架最外層
所以框架內每一個Compoent 都不須另外掛就可直接使用以下的自建組件



各組件說明
-------------
### 1. bac-select  (下拉選單)

####  Props:

| 屬性                | 型態      | 預設      | 必要    | 說明                 |
| ----------------- | ------- | ------- | ----- | ------------------ |
| v-model           | String  |         | Y     | 給Vue 綁定的data model |
| multiple          | Boolean | false   | N     | 是否多選               |
| value-field       | String  | value   | N     | 作為存入資料庫值的欄位        |
| text-field        | String  | display | N     | 顯示的欄位              |
| is-qry-src-before | String  | Y       | N     | 是否為KEY 欄位時才去後端撈資料  |
| field             | Object  | {}      | Y     | 欄位屬性               |
| default-val       | String  | Number  | Array | 預設值                |
| data              | Array   | []      | N     | 下拉選單資料             |

#### Events: 

|   事件    |  參數  |   說明   |
| :-----: | :--: | :----: |
| @change | none | 選到值後觸發 |

#### Usage: 

```
<bac-select v-model="person[fieldName]" :data="selectData"  
is-qry-src-before="Y" value-field="id" text-field="text" 
@update:v-model="val => person[fieldName] = val">
</bac-select>
```

### 2. bac-select-grid   (下拉Datagrid 選單)

#### Props:

| 屬性                | 型態      | 預設      | 必要    | 說明                                       |
| ----------------- | ------- | ------- | ----- | ---------------------------------------- |
| v-model           | String  |         | Y     | 給Vue 綁定的data model                       |
| multiple          | Boolean | false   | N     | 是否多選                                     |
| id-field          | String  | value   | N     | 作為存入資料庫值的欄位                              |
| text-field        | String  | display | N     | 顯示的欄位                                    |
| is-qry-src-before | String  | Y       | N     | 是否為KEY 欄位時才去後端撈資料                        |
| field             | Object  | {}      | Y     | 欄位屬性                                     |
| default-val       | String  | Number  | Array | 預設值                                      |
| data              | Array   | []      | N     | 下拉選單資料                                   |
| columns           | Array   | []      | N     | 下拉Datagrid 欄位屬性 [{**field**, **title**, **width**},...,{}] |

#### Events: 

|   事件    |  參數  |   說明   |
| :-----: | :--: | :----: |
| @change | none | 選到值後觸發 |

#### Usage: 
```
<bac-select-grid v-model="person[fieldName]" :data="selectData" is-qry-src-before="Y"
         id-field="id" text-field="text" columns="columns" data="selectData" @update:v-model="val => person[fieldName] = val"></bac-select>
```



### 3. search-comp (搜尋區塊選單)

#### Props:
| 屬性            | 型態       | 預設   | 必要   | 說明            |
| ------------- | -------- | ---- | ---- | ------------- |
| search-fields | Object   | []   | Y    | 搜尋區塊的欄位       |
| search-cond   | Object   | {}   | Y    | 存放搜尋條件的Obj    |
| fetch-data    | Function |      | Y    | 執行搜尋的Function |

#### Usage: 
