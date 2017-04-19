/**
 * Created by Jun on 2016/12/26.
 * 資料庫設定檔
 */
module.exports = {
    //oracle 設定檔
    oracle: {
        connectString: "125.227.154.170:1521/WRS",
        user: "htce7",
        password: "sql"
    },
    //mongoDB 設定檔
    mongo: {
        // host: "192.168.1.76",
        host: "localhost",
        // port: "2717",
        port: "27017",
        dbname: "bacchus",
        username: "bacchus",
        password: "mongo"

    },
    //是否要Debug模式
    debug : 1
};