/**
 * Created by Jun on 2016/12/26.
 * 資料庫設定檔
 */
module.exports = {
    //oracle 設定檔{Array}
    oracle: [{
        id: "IDC_TEST_ORACLE",
        connectString: "192.168.60.79/WRS",
        user: "bacchus",
        password: "tomcat284362",
        months: [1, 2, 3, 4, 5, 6],
        debug: 1
    }],
    // oracle 參數設定
    oracle_maxRows: 1000,
    oracle_poolMin: 5,
    oracle_poolMax: 20,
    oracle_poolTimeout: 60,
    oracle_poolIncrement: 1,
    //mongoDB 設定檔
    mongo: {
        host: "192.168.60.77",
        port: "2717",
        dbname: "bacchus",
        username: "bacchus",
        password: "mongo"
    }
};