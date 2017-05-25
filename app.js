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
var ios = require('socket.io-express-session');
var dbSvc = require("./services/dbTableService");
var dbconn = ["mongodb://", dbConfig.mongo.username, ":", dbConfig.mongo.password, "@", dbConfig.mongo.host, ":", dbConfig.mongo.port, "/", dbConfig.mongo.dbname].join("");
var mongoAgent = require("./plugins/mongodb");
var tbSVC = require("./services/dbTableService");
var _ = require("underscore");


//時間記錄
require("console-stamp")(console, {pattern: "yyyy/mm/dd ddd HH:MM:ss"});

//Oracle initial
require('./plugins/kplug-oracle/DB').create(dbConfig.oracle);


// i18n setting
i18n.configure({
    // watch for changes in json files to reload locale on updates - defaults to false
    autoReload: true,
    // setup some locales - other locales default to en silently
    locales: ['zh_tw', 'zh_cn', 'en', 'ja'],
    // you may alter a site wide default locale
    defaultLocale: 'en',
    // sets a custom cookie name to parse locale settings from - defaults to NULL
    cookie: sysConfig.secret + 'i18n',
    // where to store json files - defaults to './locales' relative to modules directory
    directory: __dirname + '/locales',
    // enable object notation
    objectNotation: true,
    // object or [obj1, obj2] to bind the i18n api and current locale to - defaults to null
    register: global,
    // query parameter to switch locale (ie. /home?lang=ch) - defaults to NULL
    queryParameter: 'locale'
});

require('./utils/passport-cas')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || port);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

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
var maxAgeSec = 20 * 60;                //session 設定過期時間（秒）
var sessionMiddleware = session({
    secret: sysConfig.secret,             // 防止cookie竊取
    proxy: true,                          //安全cookie的反向代理，通过x-forwarded-proto實現
    resave: false,                       //即使 session 没有被修改，也保存 session 值，預設為 true。
    saveUninitialized: false,              //是指無論有没有session cookie，每次请求都設置個session cookie ，預設為 connect.sid
    cookie: {
        maxAge: maxAgeSec * 1000        //單位 毫秒
    },
    store: new MongoStore({
        url: dbconn,
        ttl: maxAgeSec                   //單位 秒
    })
});

//設定socket.io 可以取得session
io.use(function (socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(sessionMiddleware);

//Layout 設定
// app.use(expressLayouts);
// app.set("layout extractScripts", true);
// app.set('layout', 'layouts/mainLayout');

//初始化io event
require("./plugins/socket.io/socketEvent")(io);

//一直保持session 不閒置
app.use(function (req, res, next) {
    req.session._touchSession = new Date();
    req.session.touch();
    next();
});

app.use(function (req, res, next) {
    res.locals.session = req.session;
    res.locals.locale = req.session.locale;
    next();
});

//設定系統提供語系
app.use(function (req, res, next) {
    var options = {
        maxAge: 1000 * 60 * 15, // would expire after 15 minutes
        //httpOnly: true, // The cookie only accessible by the web server
        //signed: true // Indicates if the cookie should be signed
    };
    var localeInfo = [
        {lang: 'en', sort: 1, name: 'English'},
        {lang: 'zh_TW', sort: 2, name: encodeURIComponent('繁體中文')}
    ];
    res.cookie('sys_locales', localeInfo, options);
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

    dbSvc.doTableAllUnLock(function (err, success) {
        if (err) {
            console.error(err);
        } else {
            console.log("Table unlock all program ID.");
        }

    })

}