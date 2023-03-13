/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PostRedirect = {
  init() {
    return $.on(d, 'QRPostSuccessful', e => {
      if (!e.detail.redirect) { return; }
      this.event = e;
      this.delays = 0;
      return $.queueTask(() => {
        if ((e === this.event) && (this.delays === 0)) {
          return location.href = e.detail.redirect;
        }
      });
    });
  },

  delays: 0,

  delay() {
    if (!this.event) { return null; }
    const e = this.event;
    this.delays++;
    return () => {
      if (e !== this.event) { return; }
      this.delays--;
      if (this.delays === 0) {
        return location.href = e.detail.redirect;
      }
    };
  }
};
