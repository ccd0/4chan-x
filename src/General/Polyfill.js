import $ from "../platform/$";

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Polyfill = {
  init() {
    this.toBlob();
    $.global(this.toBlob);
    if (!Element.prototype.matches) { Element.prototype.matches = Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector; }
  },
  // This function is converted to a string and then put in a script tag.
  // Do NOT shorten to `toBlob() {`.
  toBlob: function() {
    if (HTMLCanvasElement.prototype.toBlob) { return; }
    HTMLCanvasElement.prototype.toBlob = function(cb, type, encoderOptions) {
      const url = this.toDataURL(type, encoderOptions);
      const data = atob(url.slice(url.indexOf(',')+1));
      // DataUrl to Binary code from Aeosynth's 4chan X repo
      const l = data.length;
      const ui8a = new Uint8Array(l);
      for (let i = 0, end = l; i < end; i++) {
        ui8a[i] = data.charCodeAt(i);
      }
      return cb(new Blob([ui8a], {type: type || 'image/png'}));
    };
  }
};
export default Polyfill;
