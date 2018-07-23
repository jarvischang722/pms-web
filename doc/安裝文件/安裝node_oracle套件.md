# 安裝流程
(以下動作皆為系統管理員)
### .Net framework、python 2.7
- npm install --global   windows-build-tools
### free Oracle Instant Client
- 解壓縮 instantclient-basic-windows.x64-12.1.0.2.0 與 instantclient-sdk-windows.x64-12.1.0.2.0
- 將解壓縮的所有檔案放在C:\oracle\instantclient
### Install the add-on(環境變數設定)
- set Path= C:\Python27
- set Path= C:\oracle\instantclient
- set OCI_LIB_DIR= C:\oracle\instantclient\sdk\lib\msvc
- set OCI_INC_DIR= C:\oracle\instantclient\sdk\include 
- set Path 裡加 %OCI_LIB_DIR%、%OCI_INC_DIR%


# 遭遇問題
### npm install orcaledb 
- 'oci.h': no file or directory -> 
    orcale檔案解壓縮完後全部放置C:\oracle\instantclient
### node app.js
- %1 is not a valid Win32 applicatio -> 
    環境變數設定: Path= C:\oracle\instantclient
### MSBUILD : error MSB3428: 無法載入 Visual C++ 元件 "VCBuild.exe"。
- 若要修正這個問題，請1) 安裝 .NET Framework 2.0 SDK，2) 安裝 Microsoft Visual Studio 2005，或 3) 將元件位置加入至系統路徑 (如果元件安裝在別的位置)。->
    npm config set msvs_version 2015
    
### oracledb The specified module could not be found.
- The Oracle client 12.1 requires the Visual Studio 2010 redistributable.

### node 9.4.0版要搭oracledb@2.2.0


# 安裝檔案連結(路徑)
- ftp://192.168.1.122/Public/tools/oracleClient4Nodejs/
    




