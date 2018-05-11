# 安裝Oracle client 套件( CentOS 6.x )
## 1. gcc升級至 (v4.8)
下載repository & 安裝

	$ wget http://people.centos.org/tru/devtools-2/devtools-2.repo -O /etc/yum.repos.d/devtools-2.repo
	$ yum install devtoolset-2-gcc devtoolset-2-binutils
	$ yum install devtoolset-2-gcc-c++ devtoolset-2-gcc-gfortran

查看版本

	$ /opt/rh/devtoolset-2/root/usr/bin/gcc --version
	gcc (GCC) 4.8.2 20140120 (Red Hat 4.8.2-15)
	Copyright (C) 2013 Free Software Foundation, Inc.
	This is free software; see the source for copying conditions.  There is NO
	warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

設定環境變數

	$ scl enable devtoolset-2 bash
	
	$ source /opt/rh/devtoolset-2/enable

查看

	$ gcc --version
	gcc (GCC) 4.8.2 20140120 (Red Hat 4.8.2-15)
	...

>因為npm 在 安裝oracledb時需要編譯C++ ， 測試過程中發現4.8 版較不會有問題，故使用此版本

## 2. 下載oracle client SDK & basic
		$ cd /opt/oracle
		$ unzip instantclient-basic-linux.x64-12.2.0.1.0.zip
		$ unzip instantclient-sdk-linux.x64-12.2.0.1.0.zip
		$ mv instantclient_12_2 instantclient
		$ cd instantclient
		$ ln -s libclntsh.so.12.1 libclntsh.so
		
		------
>[instant client 下載位置 ](http://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html)

## 3. 環境設定

~/.bash_profile 跟 ~/.bashrc加入路徑

	$ export LD_LIBRARY_PATH=/opt/oracle/instantclient:$LD_LIBRARY_PATH
	$ export OCI_LIB_DIR=/opt/oracle/instantclient
	$ export OCI_INC_DIR=/opt/oracle/instantclient/sdk/include

讀入環境設定檔

	source ~/.bash_profile

## 4. 安裝npm oracledb 套件 
	$ sudo npm -E install oracledb

**參考**

1. [安裝oracle for nodejs](https://github.com/oracle/node-oracledb/blob/master/INSTALL.md#instzip)
2. [安裝gcc 4.8](https://gist.github.com/stephenturner/e3bc5cfacc2dc67eca8b)

