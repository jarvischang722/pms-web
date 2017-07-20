/**
 * Created by Jun on 2016/12/26.
 * 資料庫設定檔
 */
module.exports = {
    //oracle 設定檔{Array}
    oracle: [{
        id: 'IDC_TEST_ORACLE',
        // connectString: "210.64.24.131/WRS",
        connectString: "192.168.60.79/WRS",
        user: "htce7",
        password: "sql",
        months: [1, 2, 3, 4, 5, 6],
        debug: 1,
        maxRows: 1000  //query db max rows
    }],
    //mongoDB 設定檔
    mongo: {
        // host: "125.227.154.170",
        host: "127.0.0.1",
        port: "2717",
        dbname: "bacchus",
        username: "bacchus",
        password: "mongo"
    }
};