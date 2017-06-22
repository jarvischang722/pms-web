/**
 * Created by Jun on 2017/6/17.
 */
function cursor(e) {
    this.e = e.target;
    this.prefix = e.target.value.substring(0, e.target.selectionStart);
    this.suffix = e.target.value.substring(e.target.selectionEnd);
    this.start = e.target.selectionStart;
    this.insertTextInCursor = function (text) {
        this.e.value = this.prefix + text + this.suffix;
    };
}

