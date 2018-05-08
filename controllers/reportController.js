/**
 * Created by jing on 2018/05/07.
 */

const _ = require("underscore");


/**
 * 報表(靜態)
 */
exports.getreport = function (req, res) {
    res.render("subsystem/report/report", {mdl_id: req.params.mdl_id});
};