#!/bin/bash

#輸出的檔案路徑
outputPath=/path/to/healthSta
#輸出重啟紀錄的檔案路徑
restartRecordPath=/path/to/bacchusRestartRecord.txt
#重新嘗試連線的次數
reTries=3
#timeout 定義的秒數
timeoutSec=3
#要打的URL
checkURL=http://127.0.0.1:8888/1/login

#執行檢查
wget --timeout=$timeoutSec --tries=$reTries -O $outputPath  $checkURL

#計算檔案大小，回來沒東西大小會是0
filesize=$(stat -c%s "$outputPath")

#判斷檔案是否為空，空的代表回應異常執行重啟
if test -s $outputPath; then
        echo 'bacchus check success !!'
else
        echo Restart time : $(date +"%Y-%m-%d %H:%M:%S") >> $restartRecordPath
        pm2 restart bacchus
fi
