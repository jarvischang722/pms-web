## Bacchus Project  From Athena Group

### 1.Install OracleDB client

  > 參考 doc/安裝node_oracle套件.md
 
### 2.Download package from npm

``` 
$ npm install 
```

### 3.Setup  configs

```
$ cp ./config/database_example.js ./config/database.js
$ cp ./config/systemConfig_example.js ./config/systemConfig.js

```

### 4.Run App

```
$ node app.js
```


## Branch

### 主要分支
    master：釋出的版本，只從 release 與 hotfix merge  回來，不直接在上面 commit 變更。
    develop：開發中的版本，預設在這 branch 上，開發修改功能都從這分支出去。
### 支援性分支
    feature branches：從 develop 分支出來，當功能開發修改完成後 merge 回 develop
    release branches：從 develop 分支出來，是準備釋出的版本，只修改版本號與 bug，完成後 merge 回 develop 與 master，並在 master 標上版本號的 tag
    hotfix branches：從 master 分支出來，主要是處理已釋出版本需要立即修改的錯誤，完成後 merge 回 develop 與 master，並在 master 標上版本號的 tag