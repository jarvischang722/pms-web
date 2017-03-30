var express = require('express');
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var expressLayouts = require('express-ejs-layouts');
var path = require('path');
var i18n = require("i18n");
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var routing = require('./routing');
var dbConfig = require('./configs/database');
var sysConfig = require('./configs/SystemConfig');
var debug = require('debug')('bacchus4web:server');
var passport = require('passport');
var flash = require('connect-flash');
var port = 8888;
var app = express();// initail express
var server = http.createServer(app);
var io = require('socket.io')(server);
var dbconn = ["mongodb://", dbConfig.mongo.username, ":", dbConfig.mongo.password, "@", dbConfig.mongo.host, ":", dbConfig.mongo.port, "/", dbConfig.mongo.dbname].join("");
var mongoAgent = require("./plugins/mongodb");
var tbSVC = require("./services/dbTableService");
var _ = require("underscore");
//初始化io event
require("./plugins/socket.io/socketEvent")(io);

//時間記錄
require("console-stamp")(console, {pattern: "yyyy/mm/dd ddd HH:MM:ss"});

//Oracle initial
require('./plugins/kplug-oracle/DB').create(dbConfig.oracle);


// i18n setting
i18n.configure({
    locales: ['zh_tw', 'zh_cn', 'en', 'ja'],
    defaultLocale: 'en',
    cookie: sysConfig.secret + 'i18n',
    directory: __dirname + '/locales',
    objectNotation: true
});

require('./utils/passport-cas')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || port);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//以下app.use使用中介軟體完成http功能
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));  //url編碼處理
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(i18n.init);
app.use(flash());

//session setting
app.use(session({
    secret: sysConfig.secret,             // 防止cookie竊取
    proxy: true,                          //安全cookie的反向代理，通过x-forwarded-proto實現
    resave: false,                       //即使 session 没有被修改，也保存 session 值，預設為 true。
    saveUninitialized: false,              //是指無論有没有session cookie，每次请求都設置個session cookie ，預設為 connect.sid

}));

app.use(function (req, res, next) {
    res.locals.session = req.session;
    res.locals.locale = req.session.locale;
    next();
});


routing(app, passport);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

tableUnlockforAllPrg();

server.listen(port, function () {
    // debug('Listening on ' + app.get('port'));
    console.log('Express server listening on port ' + app.get('port'));
});

/**
 * table unlock
 */
function tableUnlockforAllPrg() {

    mongoAgent.TemplateRf.find({page_id:1,template_id:'datagrid'}).exec(function (err, templates) {
        var funcs = [];
        var template = {};
        _.each(templates, function(template){
            funcs.push(
                function (callback) {
                    tbSVC.doTableUnLock(template.prg_id,
                        template.lock_table,
                        "",
                        "T",
                        ""
                        , callback)
                }
            )
        });

        require("async").parallel(funcs, function (err, result) {
            if(err){
               console.error("table unlock error!")
               console.error(err)
            }else{
                console.log("table unlock finished!");
            }

        })
    })

}