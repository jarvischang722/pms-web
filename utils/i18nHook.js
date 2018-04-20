

var _i18n;

/**
 * hookTranslate  如果程式單元沒有定義, 使用 SystemCommon
 * @param {Object} i18n : i18n Object
 * **/
exports.hookTranslate = function (i18n) {

  _i18n = i18n;

  console.log(["hookTranslate", i18n])

  var translateHandler = {
    get: function(obj, prop) {
      console.log(["translateHandler", obj, prop, prop in obj ])
      return prop in obj ?
        obj[prop] :
        _i18n.fn__("SystemCommon")[prop];
    }
  };

  function translate(phrase){

    console.log(["translate 1", phrase, arguments])
    //return _i18n.fn__(phrase);

    let keys =  phrase.split(".");

    //if(phrase=="PMS0810050")
   console.log(["translate 2", keys, phrase, _i18n.fn__(phrase)])

    if(keys[0]==="SystemCommon" || keys[0]==="program")
      return _i18n.fn__(phrase);

    //check if defined
    let translated = _i18n.fn__(phrase);
    // if(phrase=="PMS0810050")
    console.log(["translate 3", translated])

    if(typeof translated=="undefined" || translated==null)
      return _i18n.fn__(phrase.replace(keys[0], "SystemCommon"));
    else
      return new Proxy(translated, translateHandler);
  }

  i18n.fn__ = i18n.__;
  i18n.__ = translate.bind(i18n);

  return i18n;
}