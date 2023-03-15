import Callbacks from "../classes/Callbacks";
import Post from "../classes/Post";
import Index from "../General/Index";
import { g, Conf, d, doc } from "../globals/globals";
import $ from "../platform/$";
import { DAY, HOUR, MINUTE, SECOND } from "../platform/helpers";

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var RelativeDates = {
  INTERVAL: 30000,

  init() {
    if (
      (['index', 'thread', 'archive'].includes(g.VIEW) && Conf['Relative Post Dates'] && !Conf['Relative Date Title']) ||
      Index.enabled
    ) {
      this.flush();
      $.on(d, 'visibilitychange PostsInserted', this.flush);
    }

    if (Conf['Relative Post Dates']) {
      return Callbacks.Post.push({
        name: 'Relative Post Dates',
        cb:   this.node
      });
    }
  },

  node() {
    if (!this.info.date) { return; }
    const dateEl = this.nodes.date;
    if (Conf['Relative Date Title']) {
      $.on(dateEl, 'mouseover', () => RelativeDates.hover(this));
      return;
    }
    if (this.isClone) { return; }

    // Show original absolute time as tooltip so users can still know exact times
    // Since "Time Formatting" runs its `node` before us, the title tooltip will
    // pick up the user-formatted time instead of 4chan time when enabled.
    dateEl.title = dateEl.textContent;

    return RelativeDates.update(this);
  },

  // diff is milliseconds from now.
  relative(diff, now, date, abbrev) {
    let number;
    let unit = (() => {
      if ((number = (diff / DAY)) >= 1) {
      const years  = now.getFullYear()  - date.getFullYear();
        let months = now.getMonth() - date.getMonth();
      const days   = now.getDate()  - date.getDate();
        if (years > 1) {
          number = years - ((months < 0) || ((months === 0) && (days < 0)));
          return 'year';
        } else if ((years === 1) && ((months > 0) || ((months === 0) && (days >= 0)))) {
          number = years;
          return 'year';
      } else if ((months = months + (12*years)) > 1) {
          number = months - (days < 0);
          return 'month';
        } else if ((months === 1) && (days >= 0)) {
          number = months;
          return 'month';
        } else {
          return 'day';
        }
    } else if ((number = (diff / HOUR)) >= 1) {
      return 'hour';
    } else if ((number = (diff / MINUTE)) >= 1) {
      return 'minute';
    } else {
      // prevent "-1 seconds ago"
      number = Math.max(0, diff) / SECOND;
      return 'second';
    }
    })();

    const rounded = Math.round(number);

    if (abbrev) {
      unit = unit === 'month' ? 'mo' : unit[0];
    } else {
      if (rounded !== 1) { unit += 's'; } // pluralize
    }

    if (abbrev) { return `${rounded}${unit}`; } else { return `${rounded} ${unit} ago`; }
  },

  // Changing all relative dates as soon as possible incurs many annoying
  // redraws and scroll stuttering. Thus, sacrifice accuracy for UX/CPU economy,
  // and perform redraws when the DOM is otherwise being manipulated (and scroll
  // stuttering won't be noticed), falling back to INTERVAL while the page
  // is visible.
  //
  // Each individual dateTime element will add its update() function to the stale list
  // when it is to be called.
  stale: [],
  flush() {
    // No point in changing the dates until the user sees them.
    if (d.hidden) { return; }

    const now = new Date();
    for (var data of RelativeDates.stale) { RelativeDates.update(data, now); }
    RelativeDates.stale = [];

    // Reset automatic flush.
    clearTimeout(RelativeDates.timeout);
    return RelativeDates.timeout = setTimeout(RelativeDates.flush, RelativeDates.INTERVAL);
  },

  hover(post) {
    const {
      date
    } = post.info;
    const now  = new Date();
    const diff = now - date;
    return post.nodes.date.title = RelativeDates.relative(diff, now, date);
  },

  // `update()`, when called from `flush()`, updates the elements,
  // and re-calls `setOwnTimeout()` to re-add `data` to the stale list later.
  update(data, now) {
    let abbrev, date;
    const isPost = data instanceof Post;
    if (isPost) {
      ({
        date
      } = data.info);
      abbrev = false;
    } else {
      date = new Date(+data.dataset.utc);
      abbrev = !!data.dataset.abbrev;
    }
    if (!now) { now = new Date(); }
    const diff = now - date;
    const relative = RelativeDates.relative(diff, now, date, abbrev);
    if (isPost) {
      for (var singlePost of [data].concat(data.clones)) {
        singlePost.nodes.date.firstChild.textContent = relative;
      }
    } else {
      data.firstChild.textContent = relative;
    }
    return RelativeDates.setOwnTimeout(diff, data);
  },

  setOwnTimeout(diff, data) {
    const delay = diff < MINUTE ?
      SECOND - ((diff + (SECOND / 2)) % SECOND)
    : diff < HOUR ?
      MINUTE - ((diff + (MINUTE / 2)) % MINUTE)
    : diff < DAY ?
      HOUR - ((diff + (HOUR / 2)) % HOUR)
    :
      DAY - ((diff + (DAY / 2)) % DAY);
    return setTimeout(RelativeDates.markStale, delay, data);
  },

  markStale(data) {
    if (RelativeDates.stale.includes(data)) { return; } // We can call RelativeDates.update() multiple times.
    if (data instanceof Post && !g.posts.get(data.fullID)) { return; } // collected post.
    if (data instanceof Element && !doc.contains(data)) { return; } // removed catalog reply.
    return RelativeDates.stale.push(data);
  }
};
export default RelativeDates;
