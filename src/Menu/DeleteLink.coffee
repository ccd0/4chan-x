/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var DeleteLink = {
  auto: [$.dict(), $.dict()],

  init() {
    if (!['index', 'thread'].includes(g.VIEW) || !Conf['Menu'] || !Conf['Delete Link']) { return; }

    const div = $.el('div', {
      className: 'delete-link',
      textContent: 'Delete'
    }
    );
    const postEl = $.el('a', {
      className: 'delete-post',
      href: 'javascript:;'
    }
    );
    const fileEl = $.el('a', {
      className: 'delete-file',
      href: 'javascript:;'
    }
    );
    this.nodes = {
      menu:  div.firstChild,
      links: [postEl, fileEl]
    };

    const postEntry = {
      el: postEl,
      open() {
        postEl.textContent = DeleteLink.linkText(false);
        $.on(postEl, 'click', DeleteLink.toggle);
        return true;
      }
    };
    const fileEntry = {
      el: fileEl,
      open({file}) {
        if (!file || file.isDead) { return false; }
        fileEl.textContent = DeleteLink.linkText(true);
        $.on(fileEl, 'click', DeleteLink.toggle);
        return true;
      }
    };

    return Menu.menu.addEntry({
      el: div,
      order: 40,
      open(post) {
        if (post.isDead) { return false; }
        DeleteLink.post = post;
        DeleteLink.nodes.menu.textContent = DeleteLink.menuText();
        DeleteLink.cooldown.start(post);
        return true;
      },
      subEntries: [postEntry, fileEntry]});
  },

  menuText() {
    let seconds;
    if ((seconds = DeleteLink.cooldown.seconds[DeleteLink.post.fullID])) {
      return `Delete (${seconds})`;
    } else {
      return 'Delete';
    }
  },

  linkText(fileOnly) {
    let text = fileOnly ? 'File' : 'Post';
    if (DeleteLink.auto[+fileOnly][DeleteLink.post.fullID]) {
      text = `Deleting ${text.toLowerCase()}...`;
    }
    return text;
  },

  toggle() {
    const {post} = DeleteLink;
    const fileOnly = $.hasClass(this, 'delete-file');
    const auto = DeleteLink.auto[+fileOnly];

    if (auto[post.fullID]) {
      delete auto[post.fullID];
    } else {
      auto[post.fullID] = true;
    }
    this.textContent = DeleteLink.linkText(fileOnly);

    if (!DeleteLink.cooldown.seconds[post.fullID]) {
      return DeleteLink.delete(post, fileOnly);
    }
  },

  delete(post, fileOnly) {
    const link = DeleteLink.nodes.links[+fileOnly];
    delete DeleteLink.auto[+fileOnly][post.fullID];
    if (post.fullID === DeleteLink.post.fullID) { $.off(link, 'click', DeleteLink.toggle); }

    const form = {
      mode: 'usrdel',
      onlyimgdel: fileOnly,
      pwd: QR.persona.getPassword()
    };
    form[+post.ID] = 'delete';

    return $.ajax($.id('delform').action.replace(`/${g.BOARD}/`, `/${post.board}/`), {
      responseType: 'document',
      withCredentials: true,
      onloadend() { return DeleteLink.load(link, post, fileOnly, this.response); },
      form: $.formData(form)
    }
    );
  },

  load(link, post, fileOnly, resDoc) {
    let msg;
    if (!resDoc) {
      new Notice('warning', 'Connection error, please retry.', 20);
      if (post.fullID === DeleteLink.post.fullID) { $.on(link, 'click', DeleteLink.toggle); }
      return;
    }

    link.textContent = DeleteLink.linkText(fileOnly);
    if (resDoc.title === '4chan - Banned') { // Ban/warn check
      const el = $.el('span', {innerHTML: "You can&#039;t delete posts because you are <a href=\"//www.4chan.org/banned\" target=\"_blank\">banned</a>."});
      return new Notice('warning', el, 20);
    } else if (msg = resDoc.getElementById('errmsg')) { // error!
      new Notice('warning', msg.textContent, 20);
      if (post.fullID === DeleteLink.post.fullID) { $.on(link, 'click', DeleteLink.toggle); }
      if (QR.cooldown.data && Conf['Cooldown'] && /\bwait\b/i.test(msg.textContent)) {
        DeleteLink.cooldown.start(post, 5);
        DeleteLink.auto[+fileOnly][post.fullID] = true;
        return DeleteLink.nodes.links[+fileOnly].textContent = DeleteLink.linkText(fileOnly);
      }
    } else {
      if (!fileOnly) { QR.cooldown.delete(post); }
      if (resDoc.title === 'Updating index...') {
        // We're 100% sure.
        (post.origin || post).kill(fileOnly);
      }
      if (post.fullID === DeleteLink.post.fullID) { return link.textContent = 'Deleted'; }
    }
  },

  cooldown: {
    seconds: $.dict(),

    start(post, seconds) {
      // Already counting.
      if (DeleteLink.cooldown.seconds[post.fullID] != null) { return; }

      if (seconds == null) { seconds = QR.cooldown.secondsDeletion(post); }
      if (seconds > 0) {
        DeleteLink.cooldown.seconds[post.fullID] = seconds;
        return DeleteLink.cooldown.count(post);
      }
    },

    count(post) {
      if (post.fullID === DeleteLink.post.fullID) { DeleteLink.nodes.menu.textContent = DeleteLink.menuText(); }
      if ((DeleteLink.cooldown.seconds[post.fullID] > 0) && Conf['Cooldown']) {
        DeleteLink.cooldown.seconds[post.fullID]--;
        setTimeout(DeleteLink.cooldown.count, 1000, post);
      } else {
        delete DeleteLink.cooldown.seconds[post.fullID];
        for (var fileOnly of [false, true]) {
          if (DeleteLink.auto[+fileOnly][post.fullID]) {
            DeleteLink.delete(post, fileOnly);
          }
        }
      }
    }
  }
};
