
var _i18n;


/**
 * 如果程式單元沒有設定label, 使用 SystemCommon 的設定
 * @param {Object} i18n
 * @return {Object} i18n with hooked function
 * **/
exports.hookTranslate = function (i18n) {

  _i18n = i18n;

  var translateHandler = {
    get: function(obj, prop) {
      console.log(["translateHandler", obj, prop, prop in obj ])
      // return obj[prop];

      return prop in obj ?
        obj[prop] :
        _i18n.fn__("SystemCommon")[prop];
    }
  };

  function translate(phrase){

    let keys =  phrase.split(".");

    if(keys[0]==="SystemCommon" || keys[0]==="program")
      return _i18n.fn__.bind(this)(phrase);

    //check if defined
    let translated = _i18n.fn__.bind(this)(phrase);

    if(translated===phrase)
      translated =  _i18n.fn__.bind(this)(phrase.replace(keys[0], "SystemCommon"));

    return new Proxy(translated, translateHandler);
  }

  i18n.fn__ = i18n.__;
  i18n.__ = translate;

  return i18n;
}