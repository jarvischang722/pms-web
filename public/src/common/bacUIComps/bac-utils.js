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
		try {
			$.post(url, lo_params).then(res => {
				let ln_endtime = new Date().getTime();
				let ln_execTimeSec = (ln_endtime - ln_starttime) / 1000;
				if (lo_params.func_id) {
					$.post("/api/doSaveFuncExecTime", {
						req_data: lo_params,
						res_data: _.pick(res || {}, "success", "errorMsg"),
						func_id: lo_params.func_id,
						prg_id: lo_params.prg_id,
						exec_time_sec: ln_execTimeSec
					});
				}
				if (typeof lf_callback === "function") {
					lf_callback(res);
				}
			});
		} catch (ex) {
			console.error(ex);
		}
	},
	doHttpPostProxy: (url, params) => {
		return new Promise(function (resolve, reject) {
			let ln_starttime = new Date().getTime();
			let lo_params = typeof params === "object" ? params : {};
			try {
				$.post(url, lo_params).then(res => {
					let ln_endtime = new Date().getTime();
					let ln_execTimeSec = (ln_endtime - ln_starttime) / 1000;
					if (lo_params.func_id) {
						$.post("/api/doSaveFuncExecTime", {
							req_data: lo_params,
							res_data: _.pick(res || {}, "success", "errorMsg"),
							func_id: lo_params.func_id,
							prg_id: lo_params.prg_id,
							exec_time_sec: ln_execTimeSec
						});
					}
					resolve(res);
				});
			} catch (ex) {
				reject(ex);
			}
		});
	}
};
