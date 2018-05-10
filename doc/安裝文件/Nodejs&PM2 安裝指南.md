# Nodejs 與 PM2 環境安裝 on Linux

[**NVM**](#nvm-pane)

[**PM2**](#pm2-pane)

# NVM (Node Version Manager)
一般來說我們可以到[NodeJS官網](https://nodejs.org/en/download/)下載安裝檔安裝我們要的版本，但開發過程中或是主機上有時候為了要配合更新就必須要將原本的node版本移除掉再重新安裝，這樣對主機或是開發都麻煩而且主機上的程式有掛掉的風險，所以我們用了一個叫**NVM(Node Version Manager)**的node版本控制工具，將nodejs 透過nvm安裝，未來如果開發上或部署上需要更新node版本我們就可以下一個簡單的指令切換即可．以下為安裝步驟


## 安裝NVM

### 1.下載

```sh
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
```
### 2.設定 NVM 環境變數
在 ~/.bash_profile,~/.bashrc, ~/.profile, 或 ~/.zshrc 設定環境變數

```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # 讀取 NVM
```

> 通常安裝完後這些設定應該就會存在這些檔案其中一個裡~/.bash_profile,~/.bashrc, ~/.profile, 或 ~/.zshrc ，沒有的話才需要手動加入


設定完後，重新開啟 terminal 就可以使用 nvm 指令

### 3.確認可以安裝版本清單
```
$ nvm ls-remote
```	

![nvm ls-remote](http://i.imgur.com/WUC57TL.png)
	
### 4.安裝指定版本 的 node.js
```	
$ nvm install 8.4.0  
```	

![nvm install](http://i.imgur.com/4KhqJqn.png)

### 5.指定 nvm 使用的 Node.js 版本
	$ nvm use 8.4.0

### 6.預設開機使用 5.4.0 版本
	$ nvm alias default 8.4.0
	
### 7.檢查目前node 版本
	$ node -v	
	
 --------------

## 移除NVM
	rm -rf ~/.nvm
	rm -rf ~/.npm
	rm -rf ~/.bower
 
 
#  PM2 ( **P**(rocess) **M**(anager) **2** )
![nvm install](https://github.com/unitech/pm2/raw/master/pres/pm2.20d3ef.png)
nodejs ap 服務管理工具

### 安裝pm2 

```bash
$ npm install pm2 -g
```
### 啟動AP

```bash
$ pm2 install [啟動js的檔案 ex: app.js]  --name [自訂 ap 名稱]
```
ex : pm2 install app.js --name booking

### 查看服務清單

```bash
$ pm2 list  or  pm2 l
```

### 重啟Ap

```bash
$ pm2 restart <app_name|id|'all'>
```

### 停止Ap

```bash
$ pm2 stop <app_name|id|'all'>
```

### 刪除Ap

```bash
$ pm2 delete <app_name|id|'all'>
```


## PM2 問題排除(持續更新)

### AP無法正常啟動
>[PM2] Spawning PM2 daemon

>[PM2] PM2 Successfully daemonized
下完 pm2 start 後如果卡在這


查看pm2 log (/root/.pm2/pm2.log)
>TypeError: obj.hasOwnProperty is not a function
    at safeDeepClone (/usr/lib/node_modules/pm2/node_modules/safe-clone-deep/src/index.js:49:13)
    at safeDeepClone (/usr/lib/node_modules/pm2/node_modules/safe-clone-deep/src/index.js:53:22)
    at safeDeepClone (/usr/lib/node_modules/pm2/node_modules/safe-clone-deep/src/index.js:53:22)
    at cloneWrap (/usr/lib/node_modules/pm2/node_modules/safe-clone-deep/src/index.js:65:10)
    at Object.clone (/usr/lib/node_modules/pm2/lib/Utility.js:39:12)
    at Object.Common.deepCopy.Common.serialize.Common.clone (/usr/lib/node_modules/pm2/lib/Common.js:151:18)
    at /usr/lib/node_modules/pm2/lib/God.js:370:25
    at forkMode (/usr/lib/node_modules/pm2/lib/God.js:231:15)
    at /usr/lib/node_modules/pm2/lib/God/ForkMode.js:203:22
    at /usr/lib/node_modules/pm2/node_modules/async/lib/async.js:52:16
2017-05-15 10:18:32: [PM2] Trying to update PM2...
Be sure to have the latest version by doing `npm install pm2@latest -g` before doing this procedure.
/usr/lib/node_modules/pm2/node_modules/safe-clone-deep/src/index.js:49
    if (obj.hasOwnProperty(attr)) {
            ^

>TypeError: obj.hasOwnProperty is not a function
    at safeDeepClone (/usr/lib/node_modules/pm2/node_modules/safe-clone-deep/src/index.js:49:13)
    at safeDeepClone (/usr/lib/node_modules/pm2/node_modules/safe-clone-deep/src/index.js:53:22)
    at safeDeepClone (/usr/lib/node_modules/pm2/node_modules/safe-clone-deep/src/index.js:53:22)
    at cloneWrap (/usr/lib/node_modules/pm2/node_modules/safe-clone-deep/src/index.js:65:10)
    at Object.clone (/usr/lib/node_modules/pm2/lib/Utility.js:39:12)
    at Object.Common.deepCopy.Common.serialize.Common.clone (/usr/lib/node_modules/pm2/lib/Common.js:151:18)
    at Object.getFormatedProcesses (/usr/lib/node_modules/pm2/lib/God/Methods.js:68:21)
    at getMonitorData (/usr/lib/node_modules/pm2/lib/God/ActionMethods.js:42:25)
    at Server.onmessage (/usr/lib/node_modules/pm2/node_modules/pm2-axon-rpc/lib/server.js:105:6)
    at emitTwo (events.js:106:13)
    
    


解決方式重新安裝pm2 

```sh
$ sudo npm install pm2 -g  
```


> npm ERR! fetch failed http://tgz.pm2.io/gkt-1.0.0.tgz

如果重新安裝過程中有這個錯誤，請改下

```sh
$ npm i pm2@latest --no-optional -g --no-shrinkwrap 
```

[參考](https://github.com/Unitech/pm2/issues/2438)
