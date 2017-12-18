/**
 * Created by user on 2015/8/19.
 * Author : Jun.Chang
 * include controller
 */
var _ = require("underscore");
var fs = require("fs");
var routersDirectory = __dirname+"/routes/";

module.exports = function(app, passport){
    fs.readdirSync(routersDirectory).filter(function(file) {
        require(routersDirectory + file )(app);
    });
};
