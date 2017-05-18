/**
 * Created by Jun on 2016/12/26.
 * 資料庫設定檔
 */
module.exports = {
    //oracle 設定檔{Array}
    oracle: [{
        id: 'IDC_TEST_ORACLE',
        connectString: "210.64.24.131/WRS",
        user: "htce7",
        password: "sql",
        months: [1, 2, 3, 4, 5, 6],
        debug: 1
    }],
    //mongoDB 設定檔
    mongo: {
        host: "192.168.1.76",
        port: "2717",
        // host: "127.0.0.1",
        // port: "27017",
        dbname: "bacchus",
        username: "bacchus",
        password: "mongo"
    }
};