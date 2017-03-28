/**
 * Created by Jun on 2016/12/26.
 */
var _ = require("underscore");

module.exports = function(req, res, next){

    if(_.isUndefined(req.session.user) || _.isNull(req.session.user)){
        res.redirect("/login");
    }else if(!_.isUndefined(req.session.user) && _.isUndefined(req.session.user.sys_id)){
        res.redirect("/systemOption");
    }else{
        next();
    }

};