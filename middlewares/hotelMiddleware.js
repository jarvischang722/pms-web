/**
 * Created by Jun Chang on 2017/1/5.
 */
var _ = require("underscore");
module.exports = function (req, res, next) {

    // if (!_.isUndefined(req.query("subsys_id")) && !_.isEmpty(req.query("subsys_id"))) {
    //     res.cookies('current_subsys_id',req.query("subsys_id"));
    // }
    // if (!_.isUndefined(req.query("prg_id")) && !_.isEmpty(req.query("prg_id"))) {
    //     res.cookies('current_prg_id',req.query("prg_id"));
    // }
    next();
};