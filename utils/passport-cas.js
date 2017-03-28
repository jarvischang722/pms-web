/**
 * Created by Jun Chang on 2017/1/4.
 */


module.exports = function(passport){

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function (profile_ID, done) {

        return done(null, profile_ID);

    });
    //TODO 尚未完成cas 登入
    var serverBaseURL = encodeURIComponent("http://localhost:2874/");
    var BaseURL = "http://125.227.154.170/cas/login?TxnData={'dbuser'={'bacchus':'bacchus','webhotel':'webhotel'},'company'={'ATHENA':'ATHENA','CHIPN':'CHIPN'}}&service="+serverBaseURL;
    passport.use(new (require('passport-cas').Strategy)({
        version: 'CAS3.0',
        ssoBaseURL: BaseURL,
        serverBaseURL: serverBaseURL
    }, function(profile, done) {
        var login = profile.user;

        User.findOne({login: login}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: 'Unknown user'});
            }
            user.attributes = profile.attributes;
            return done(null, user);
        });
    }));

};