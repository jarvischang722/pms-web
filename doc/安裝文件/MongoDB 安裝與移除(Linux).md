# MongoDB 安裝與設定 on Linux(Centos6) 

* [安裝MongoDB](#installMongoDB)
* [設定說明](#settingMongoDB)
* [權限帳號設定](#authMongoDB)
* [備份與復原](#backupMongoDB)
* [移除MongoDB](#uninstallMongoDB)


### <a name="installMongoDB">安裝MongoDB</a>
#### 1.Configure the package management system (yum)
>目前10.53主機是安裝MongoDB 3.2 (2017/01/22)

在 **/etc/yum.repos.d/**建立一個檔案 mongodb-org-3.2.repo
	
```
$ vi /etc/yum.repos.d/mongodb-org-3.2.repo
```

將以下內容寫入mongodb-org-3.4.repo 儲存



```
[mongodb-org-3.2]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.2/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.2.asc

```
#### 2. 	Install the MongoDB packages and associated tools.
```sh
$ sudo yum install -y mongodb-org
```
#### 3.	 Mongo Server 設為開機啟動
```sh
$ sudo chkconfig --levels 345 mongod on
```
#### 4.  Check Result
```sh
$ sudo chkconfig --list | grep mongod
mongod          0:off   1:off   2:off   3:on    4:on    5:on    6:off
```

#### 5.啟動 mongod service
```sh
$ sudo service mongod start
```
***

### <a name="settingMongoDB">設定說明</a>
***

### <a name="authMongoDB">權限帳號設定</a>
#### 進入管理模式
```sh
$ mongo
```
#### 新增管理者角色
```sh
$ use admin
$ db.createUser({user:"root",pwd:"root123",roles:["userAdminAnyDatabase"]})
$ db.auth("root","root123")  //1 成功  0失敗
```
#### 新增一般角色
```sh
use [db name]
db.createUser({user:"webhotel",pwd:"mongo",roles:["readWrite"]})
```

***
### <a name="backupMongoDB">備份與復原</a>


#### 備份
```sh
$ mongodump  -h 127.0.0.1 --port 27017   -u athena -p mongo  --authenticationDatabase admin  -d webhotel   -o /mnt/dbbackup/webhotel
```
#### 復原
```sh
$ mongorestore  -h 127.0.0.1 --port 27017   -u athena -p mongo  --authenticationDatabase admin  -d webhotel  --drop   -o /mnt/dbbackup/webhotel
```

#### 單一Collection 匯出
```sh
$ mongoexport --host 210.64.24.148:27017  -d webhotel -c hotelsinfoss   -o hotelsInfo.json
```
#### 單一Collection 匯入
```sh
$ mongoimport -u athena -p mongo --host 192.168.12.53 -d webhotel -c hotelsinfos hotelsInfo.json
```

> *參考*
> 
> * http://mongodbcanred.blogspot.tw/2015/01/mongodbmongodump-mongorestore.html
> * https://docs.mongodb.com/v3.2/reference/program/mongodump/
> * http://www.lizi.pw/archives/17  (MongoDB密码正确但备份授权失败)
> * https://www.mkyong.com/mongodb/mongodb-import-and-export-example/(匯出匯入)


***
### <a name="uninstallMongoDB">移除MongoDB</a>
#### 1.Stop MongoDB
```sh
$ sudo service mongod stop
```
#### 2.Remove Packages.
```sh
$ sudo yum erase $(rpm -qa | grep mongodb-org)
```
#### 3.Remove Data Directories.
```sh
$ sudo rm -r /var/log/mongodb
$ sudo rm -r /var/lib/mongo
```

