/**
 * Created by Joseph Yang on 2018/4/19.
 * hook i18n translate
 */
let _i18n;


/**
 * 如果程式單元沒有設定label, 使用 SystemCommon 的設定
 * @param {Object} i18n
 * @return {Object} i18n with hooked function
 * **/
exports.hookTranslate = function (i18n) {
  _i18n = i18n;

  let propHandler = {
    get: function(obj, prop) {

      return prop in obj ?
        obj[prop] :
        "_SystemCommon" in obj && prop in obj._SystemCommon ?
          obj._SystemCommon[prop]: _i18n.fn__.bind(this)("SystemCommon")[prop];
    }
  };


  let pidHandler = {
    get: function(obj, prop) {
      if (prop in obj) {
        obj[prop]["_SystemCommon"] = obj._SystemCommon;

        return new Proxy(obj[prop], propHandler);
      } else {

        return "_SystemCommon" in obj ?
          obj._SystemCommon : _i18n.fn__.bind(this)("SystemCommon");
      }
    }
  };

  function translate(phrase){
    let keys = phrase.split(".");

    if(keys[0]!=="program")
      {return _i18n.fn__.bind(this)(phrase);}

    //assert keys.length==1

    let translated = _i18n.fn__.bind(this)(phrase);
    translated._SystemCommon = _i18n.fn__.bind(this)("SystemCommon");

    return new Proxy(translated, pidHandler);
  }

  i18n.fn__ = i18n.__;
  i18n.__ = translate;

  return i18n;
};