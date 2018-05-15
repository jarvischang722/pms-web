module.exports = {
    /**
     * 代理$.post 跟後端溝通
     * @param url {String}
     * @param params {Object | Function}
     * @param callback {Function}
     */
    doHttpPostAgent: (url, params, callback) => {
        let ln_starttime = new Date().getTime();
        let lo_params = typeof params === "object" ? params : {};
        let lf_callback = callback != undefined && typeof params === "object" ? callback : params;
        $.post(url, lo_params).then(res => {
            let ln_endtime = new Date().getTime();
            // console.log(`exec time : ${(ln_endtime - ln_starttime) / 1000}秒`);
            // console.log(lf_callback);
            if (typeof lf_callback === "function") {
                lf_callback(res);
            }
        });
    }
};