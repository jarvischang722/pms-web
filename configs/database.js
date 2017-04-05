/**
 * Created by Jun on 2016/12/26.
 * 資料庫設定檔
 */
module.exports = {
    //oracle 設定檔
    oracle: {
        connectString: "192.168.168.203:1521/MISUTF8",
        user: "htce7",
        password: "sql"
    },
    //mongoDB 設定檔
    mongo: {
        // host: "192.168.1.76",
        // port: "2717",
        // dbname: "bacchus",
        // username: "bacchus",
        // password: "mongo"
        host: "192.168.168.34",
        port: "27017",
        dbname: "bacchus"

    },
    //是否要Debug模式
    debug : 1
};