#!/bin/sh

conf_project_dir="$HOME/project_configs/bacchus4web"
conf_dir="$conf_project_dir"
db_conf="$conf_dir/database.js"
sys_conf="$conf_dir/systemConfig.js"


echo "=============================="
echo "== 檢查資料夾:[ $conf_project_dir ]=="
echo "=============================="
if [ ! -d "$conf_project_dir" ]; then

    echo  "Initail config directory"
    mkdir "$conf_project_dir"

    echo  "Initail database config"
    cp -f  ./configs/database_example.js  $db_conf

    echo  "Initail system config"
    cp -f  ./configs/systemConfig_example.js  $sys_conf
fi


echo "=============================="
echo "== 檢查資料庫設定檔:[ $db_conf ]=="
echo "=============================="
if [ ! -e "$db_conf" ]; then
    echo "找不到資料庫設定檔"
    exit 0;
else
    cp -f $db_conf  ./configs/
    echo "讀入資料庫設定檔 Done!"
fi

echo "=============================="
echo "== 檢查系統設定檔:[ $sys_conf ]=="
echo "=============================="
if [ ! -e "$sys_conf" ]; then
    echo "找不到系統設定檔"
    exit 0;
else
    cp -f $sys_conf  ./configs/
    echo "讀入系統設定檔 Done!"
fi