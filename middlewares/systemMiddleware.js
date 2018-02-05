/**
 * Created by Jun Chang on 2017/1/5.
 */
const _ = require("underscore");

module.exports = function (req, res, next) {


    if (!_.isUndefined(req.params.subsys_id) && !_.isUndefined(req.params.subsys_id)) {
        if (req.params.subsys_id != req.cookies.usingSubsysID) {
            res.clearCookie("usingPrgID");
        }
        res.cookie('usingSubsysID', req.params.subsys_id);
    }

    next();
};