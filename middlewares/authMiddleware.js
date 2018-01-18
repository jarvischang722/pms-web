/**
 * Created by Jun on 2016/12/26.
 */
var _ = require("underscore");

module.exports = function (req, res, next) {

    if (!req.session.activeSystem) {
        req.session.activeSystem = {
            id: "",
            name_zh_TW: "",
            name_en: "",
            name_ja: ""
        };
    }

    req.session._touchSession = new Date();
    req.session.touch();
    if (_.isUndefined(req.session.user) || _.isNull(req.session.user)) {
        if (req.session.athena_id && req.session.comp_cod) {
            res.redirect(`/${req.session.athena_id}/${req.session.comp_cod}/login`);
        } else {
            res.redirect(`/login`);
        }

    } else if (!_.isUndefined(req.session.user) && _.isUndefined(req.session.activeSystem.id)) {
        res.redirect("/systemOption");
    } else {
        next();
    }

};