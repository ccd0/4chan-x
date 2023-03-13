/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class Board {
  toString() { return this.ID; }

  constructor(ID) {
    this.ID = ID;
    this.boardID = this.ID;
    this.siteID  = g.SITE.ID;
    this.threads = new SimpleDict();
    this.posts   = new SimpleDict();
    this.config  = BoardConfig.boards?.[this.ID] || {};

    g.boards[this] = this;
  }

  cooldowns() {
    const c2 = (this.config || {}).cooldowns || {};
    const c = {
      thread: c2.threads || 0,
      reply:  c2.replies || 0,
      image:  c2.images  || 0,
      thread_global: 300 // inter-board thread cooldown
    };
    // Pass users have reduced cooldowns.
    if (d.cookie.indexOf('pass_enabled=1') >= 0) {
      for (var key of ['reply', 'image']) {
        c[key] = Math.ceil(c[key] / 2);
      }
    }
    return c;
  }
}
