let express = require('express');
let session = require("express-session");
let MongoStore = require('connect-mongo')(session);
let path = require('path');
let i18n = require("i18n");
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let http = require('http');
let routing = require('./routing');
let dbConfig = require('./configs/database');
let sysConfig = require('./configs/systemConfig');
let debug = require('debug')('bacchus4web:server');
let passport = require('passport');
let flash = require('connect-flash');
let port = 8888;
let app = express();// initail express
let server = http.createServer(app);
let io = require('socket.io')(server);
let dbSvc = require("./services/DbTableService");
let dbconn = ["mongodb://", dbConfig.mongo.username, ":", dbConfig.mongo.password, "@", dbConfig.mongo.host, ":", dbConfig.mongo.port, "/", dbConfig.mongo.dbname].join("");
let mongoAgent = require("./plugins/mongodb");
let tbSVC = require("./services/DbTableService");
let _ = require("underscore");
let compression = require('compression');

// compress all responses
app.use(compression());

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
app.use(favicon(path.join(__dirname, 'public/images/icon', 'athena_lg.ico')));

//以下app.use使用中介軟體完成http功能
//app.use(logger('dev'));

//靜態檔案指定路徑
app.use(express.static(__dirname + '/public'));

//為了post擴充可傳的資料量
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}));

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));  //url編碼處理
app.use(cookieParser(sysConfig.secret));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(i18n.init);
app.use(flash());

//session setting
const maxAgeSec = sysConfig.sessionExpiredMS || 1000 * 60 * 60 * 3;                //session 設定過期時間（秒）
let sessionMiddleware = session({
    secret: sysConfig.secret,             // 防止cookie竊取
    proxy: true,                          //安全cookie的反向代理，通过x-forwarded-proto實現
    resave: false,                       //即使 session 没有被修改，也保存 session 值，預設為 true。
    saveUninitialized: false,              //是指無論有没有session cookie，每次请求都設置個session cookie ，預設為 connect.sid,
    cookie: {
        maxAge: maxAgeSec       //單位 毫秒
    },
    store: new MongoStore({
        url: dbconn,
        ttl: maxAgeSec / 1000                   //單位 秒
    })
});

//設定socket.io 可以取得session
io.use(function (socket, next) {
    sessionMiddleware(socket.request, socket.request.res, function () {
        socket.session = socket.request.session;
        socket.session.id = socket.request.sessionID;
        next();
    });
});

app.use(sessionMiddleware);

//初始化io event
require("./plugins/socket.io/socketEvent")(io);


app.use(function (req, res, next) {
    res.locals.session = req.session;
    res.locals.locale = req.session.locale;
    res.locals._ = require("underscore");
    next();
});

routing(app, passport);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
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


server.listen(port, function () {
    // debug('Listening on ' + app.get('port'));
    tableUnlockforAllPrg();
    console.log('Express server listening on port ' + app.get('port'));
});

/**
 * table unlock
 */
function tableUnlockforAllPrg() {

    dbSvc.doTableAllUnLock(function (err, success) {
        if (err) {
            console.error(err);
        }
        else {
            console.log("Table unlock all program ID.");
        }

    });

}