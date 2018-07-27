/**
 * =========================================================
 * Created by Jun on 2016/12/26.
 * 資料庫設定檔
 * =========================================================
 * default: 一定要有，在找不到指定DB的情況下，至少還有預設可以用
 * id編號規則: IDC_BACCHUS_ + athena_id
 * =========================================================
 */
module.exports = {
    //oracle 設定檔{Array}
	oracle_pool: false,
    oracle: [
        {
            id: "default",
            connectString: "192.168.60.79/WRS",              //IDC測試
            user: "bacchus",                                 //IDC測試
            password: "sql",
            months: [1, 2, 3, 4, 5, 6]
        },
        {
            //id組合方式: IDC_BACCHUS_ + athena_id
            id: 'IDC_BACCHUS_1',
            connectString: "192.168.60.79/WRS",              //IDC測試
            user: "bacchus",                                 //IDC測試
            password: "sql",
            months: [1, 2, 3, 4, 5, 6],
            debug: 1
        // },
        // {
        //     id: 'CAS',
        //     connectString: "192.168.60.79/WRS",
        //     user: "cas",
        //     password: "tomcat284362",
        //     months: [1, 2, 3, 4, 5, 6],
        //     debug: 1
        }
    ],
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