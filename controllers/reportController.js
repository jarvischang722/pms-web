/**
 * Created by jing on 2018/05/07.
 */

const _ = require("underscore");
const reportSvc = require("../services/reportService");

/**
 * 報表
 */
exports.report = (req, res) => {
    res.render("subsystem/report/report", {prg_id: req.params.prg_id});
};

/**
 * 取得報表
 */
exports.doGenReport = (req, res) => {
    reportSvc.handleReports(req, (errorMsg, reportPdfUrl) => {
        res.json({success: errorMsg == null, errorMsg: errorMsg, reportPdfUrl: reportPdfUrl});
    });
};