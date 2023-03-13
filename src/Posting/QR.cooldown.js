/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
QR.cooldown = {
  seconds: 0,
  delays: {
    deletion: 60
  }, // cooldown for deleting posts/files

  // Called from Main
  init() {
    if (!Conf['Quick Reply']) { return; }
    this.data = Conf['cooldowns'];
    this.changes = $.dict();
    return $.sync('cooldowns', this.sync);
  },

  // Called from QR
  setup() {
    // Read cooldown times
    $.extend(QR.cooldown.delays, g.BOARD.cooldowns());

    // The longest reply cooldown, for use in pruning old reply data
    QR.cooldown.maxDelay = 0;
    for (var type in QR.cooldown.delays) {
      var delay = QR.cooldown.delays[type];
      if (!['thread', 'thread_global'].includes(type)) {
        QR.cooldown.maxDelay = Math.max(QR.cooldown.maxDelay, delay);
      }
    }

    QR.cooldown.isSetup = true;
    return QR.cooldown.start();
  },

  start() {
    const {data} = QR.cooldown;
    if (
      !Conf['Cooldown'] ||
      !QR.cooldown.isSetup ||
      !!QR.cooldown.isCounting ||
      ((Object.keys(data[g.BOARD.ID] || {}).length + Object.keys(data.global || {}).length) <= 0)
    ) { return; }
    QR.cooldown.isCounting = true;
    return QR.cooldown.count();
  },

  sync(data) {
    QR.cooldown.data = data || $.dict();
    return QR.cooldown.start();
  },

  add(threadID, postID) {
    if (!Conf['Cooldown']) { return; }
    const start = Date.now();
    const boardID = g.BOARD.ID;
    QR.cooldown.set(boardID, start, {threadID, postID});
    if (threadID === postID) { QR.cooldown.set('global', start, {boardID, threadID, postID}); }
    QR.cooldown.save();
    return QR.cooldown.start();
  },

  addDelay(post, delay) {
    if (!Conf['Cooldown']) { return; }
    const cooldown = QR.cooldown.categorize(post);
    cooldown.delay = delay;
    QR.cooldown.set(g.BOARD.ID, Date.now(), cooldown);
    QR.cooldown.save();
    return QR.cooldown.start();
  },

  addMute(delay) {
    if (!Conf['Cooldown']) { return; }
    QR.cooldown.set(g.BOARD.ID, Date.now(), {type: 'mute', delay});
    QR.cooldown.save();
    return QR.cooldown.start();
  },

  delete(post) {
    let cooldown;
    if (!QR.cooldown.data) { return; }
    const cooldowns = (QR.cooldown.data[post.board.ID] || (QR.cooldown.data[post.board.ID] = $.dict()));
    for (var id in cooldowns) {
      cooldown = cooldowns[id];
      if ((cooldown.delay == null) && (cooldown.threadID === post.thread.ID) && (cooldown.postID === post.ID)) {
        QR.cooldown.set(post.board.ID, id, null);
      }
    }
    return QR.cooldown.save();
  },

  secondsDeletion(post) {
    if (!QR.cooldown.data || !Conf['Cooldown']) { return 0; }
    const cooldowns = QR.cooldown.data[post.board.ID] || $.dict();
    for (var start in cooldowns) {
      var cooldown = cooldowns[start];
      if ((cooldown.delay == null) && (cooldown.threadID === post.thread.ID) && (cooldown.postID === post.ID)) {
        var seconds = QR.cooldown.delays.deletion - Math.floor((Date.now() - start) / $.SECOND);
        return Math.max(seconds, 0);
      }
    }
    return 0;
  },

  categorize(post) {
    if (post.thread === 'new') {
      return {type: 'thread'};
    } else {
      return {
        type: !!post.file ? 'image' : 'reply',
        threadID: +post.thread
      };
    }
  },

  mergeChange(data, scope, id, value) {
    if (value) {
      return (data[scope] || (data[scope] = $.dict()))[id] = value;
    } else if (scope in data) {
      delete data[scope][id];
      if (Object.keys(data[scope]).length === 0) { return delete data[scope]; }
    }
  },

  set(scope, id, value) {
    QR.cooldown.mergeChange(QR.cooldown.data, scope, id, value);
    return (QR.cooldown.changes[scope] || (QR.cooldown.changes[scope] = $.dict()))[id] = value;
  },

  save() {
    const {changes} = QR.cooldown;
    if (!Object.keys(changes).length) { return; }
    return $.get('cooldowns', $.dict(), function({cooldowns}) {
      for (var scope in QR.cooldown.changes) {
        for (var id in QR.cooldown.changes[scope]) {
          var value = QR.cooldown.changes[scope][id];
          QR.cooldown.mergeChange(cooldowns, scope, id, value);
        }
        QR.cooldown.data = cooldowns;
      }
      return $.set('cooldowns', cooldowns, () => QR.cooldown.changes = $.dict());
    });
  },

  clear() {
    QR.cooldown.data = $.dict();
    QR.cooldown.changes = $.dict();
    QR.cooldown.auto = false;
    QR.cooldown.update();
    return $.queueTask($.delete, 'cooldowns');
  },

  update() {
    let cooldown;
    if (!QR.cooldown.isCounting) { return; }

    let save = false;
    let nCooldowns = 0;
    const now = Date.now();
    const {type, threadID} = QR.cooldown.categorize(QR.posts[0]);
    let seconds = 0;

    if (Conf['Cooldown']) { for (var scope of [g.BOARD.ID, 'global']) {
      var cooldowns = (QR.cooldown.data[scope] || (QR.cooldown.data[scope] = $.dict()));

      for (var start in cooldowns) {
        cooldown = cooldowns[start];
        start = +start;
        var elapsed = Math.floor((now - start) / $.SECOND);
        if (elapsed < 0) { // clock changed since then?
          QR.cooldown.set(scope, start, null);
          save = true;
          continue;
        }

        // Explicit delays from error messages
        if (cooldown.delay != null) {
          if (cooldown.delay <= elapsed) {
            QR.cooldown.set(scope, start, null);
            save = true;
          } else if (((cooldown.type === type) && (cooldown.threadID === threadID)) || (cooldown.type === 'mute')) {
            // Delays only apply to the given post type and thread.
            seconds = Math.max(seconds, cooldown.delay - elapsed);
          }
          continue;
        }

        // Clean up expired cooldowns
        var maxDelay = cooldown.threadID !== cooldown.postID ?
          QR.cooldown.maxDelay
        :
          QR.cooldown.delays[scope === 'global' ? 'thread_global' : 'thread'];
        if (QR.cooldown.customCooldown) {
          maxDelay = Math.max(maxDelay, parseInt(Conf['customCooldown'], 10));
        }
        if (maxDelay <= elapsed) {
          QR.cooldown.set(scope, start, null);
          save = true;
          continue;
        }

        if (((type === 'thread') === (cooldown.threadID === cooldown.postID)) && (cooldown.boardID !== g.BOARD.ID)) {
          // Only cooldowns relevant to this post can set the seconds variable:
          //   reply cooldown with a reply, thread cooldown with a thread.
          // Inter-board thread cooldowns only apply on boards other than the one they were posted on.
          var suffix = scope === 'global' ?
            '_global'
          :
            '';
          seconds = Math.max(seconds, QR.cooldown.delays[type + suffix] - elapsed);

          // If additional cooldown is enabled, add the configured seconds to the count.
          if (QR.cooldown.customCooldown) {
            seconds = Math.max(seconds, parseInt(Conf['customCooldown'], 10) - elapsed);
          }
        }
      }

      nCooldowns += Object.keys(cooldowns).length;
    } }

    if (save) { QR.cooldown.save; }

    if (nCooldowns) {
      clearTimeout(QR.cooldown.timeout);
      QR.cooldown.timeout = setTimeout(QR.cooldown.count, $.SECOND);
    } else {
      delete QR.cooldown.isCounting;
    }

    // Update the status when we change posting type.
    // Don't get stuck at some random number.
    // Don't interfere with progress status updates.
    const update = seconds !== QR.cooldown.seconds;
    QR.cooldown.seconds = seconds;
    if (update) { return QR.status(); }
  },

  count() {
    QR.cooldown.update();
    if ((QR.cooldown.seconds === 0) && QR.cooldown.auto && !QR.req) { return QR.submit(); }
  }
};
