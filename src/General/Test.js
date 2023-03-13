/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// <% if (readJSON('/.tests_enabled')) { %>
var Test = {
  init() {
    if ((g.SITE.software !== 'yotsuba') || !['index', 'thread'].includes(g.VIEW)) { return; }

    if (Conf['Menu']) {
      const a = $.el('a',
        {textContent: 'Test HTML building'});
      $.on(a, 'click', this.cb.testOne);
      Menu.menu.addEntry({
        el: a,
        open(post) {
          a.dataset.fullID = post.fullID;
          return true;
        }
      });
    }

    const a2 = $.el('a',
      {textContent: 'Test HTML building'});
    $.on(a2, 'click', this.cb.testAll);
    Header.menu.addEntry({
      el: a2});

    if (Unread.posts) {
      const testOrderLink = $.el('a',
        {textContent: 'Test Post Order'});
      $.on(testOrderLink, 'click', this.cb.testOrder);
      Header.menu.addEntry({
        el: testOrderLink});
    }

    return $.on(d, 'keydown', this.cb.keydown);
  },

  assert(condition) {
    if (!condition()) {
      return new Notice('warning', `Assertion failed: ${condition}`, 30);
    }
  },

  normalize(root) {
    let el, i;
    let node;
    const root2 = root.cloneNode(true);
    for (el of $$('.mobile', root2)) {
      $.rm(el);
    }
    for (el of $$('a[href]', root2)) {
      var {
        href
      } = el;
      href = href.replace(/(^\w+:\/\/boards\.4chan(?:nel)?\.org\/[^\/]+\/thread\/\d+)\/.*/, '$1');
      el.setAttribute('href', href);
    }
    ImageHost.fixLinks($$('.fileText > a, a.fileThumb', root2));
    for (el of $$('img[src]', root2)) {
      el.src = el.src.replace(/(spoiler-\w+)\d(\.png)$/, '$11$2');
    }
    for (el of $$('pre.prettyprinted', root2)) {
      var nodes = $.X('.//br|.//wbr|.//text()', el);
      i = 0;
      nodes = ((() => {
        const result = [];
        while (node = nodes.snapshotItem(i++)) {
          result.push(node);
        }
        return result;
      })());
      $.rmAll(el);
      $.add(el, nodes);
      el.normalize();
      $.rmClass(el, 'prettyprinted');
    }
    for (el of $$('pre[style=""]', root2)) {
      el.removeAttribute('style');
    }
    // XXX https://bugzilla.mozilla.org/show_bug.cgi?id=1021289
    $('.fileInfo[data-md5]', root2)?.removeAttribute('data-md5');
    const textNodes = $.X('.//text()', root2);
    i = 0;
    while (node = textNodes.snapshotItem(i++)) {
      node.data = node.data.replace(/\ +/g, ' ');
      // XXX https://a.4cdn.org/sci/thread/5942502.json, https://a.4cdn.org/news/thread/6.json, https://a.4cdn.org/wsg/thread/957536.json
      if (node.previousSibling?.nodeName === 'BR') { node.data = node.data.replace(/^\n+/g, ''); }
      if (node.nextSibling?.nodeName === 'BR') { node.data = node.data.replace(/\n+$/g, ''); }
      if (node.data === '') { $.rm(node); }
    }
    return root2;
  },

  firstDiff(x, y) {
    let x2 = x.cloneNode(false);
    let y2 = y.cloneNode(false);
    if (!x2.isEqualNode(y2)) { return [x2, y2]; }
    let i = 0;
    while (true) {
      x2 = x.childNodes[i];
      y2 = y.childNodes[i];
      if (!x2 || !y2) { return [x2, y2]; }
      if (!x2.isEqualNode(y2)) { return Test.firstDiff(x2, y2); }
      i++;
    }
  },

  testOne(post) {
    Test.postsRemaining++;
    return $.cache(g.SITE.urls.threadJSON({boardID: post.boardID, threadID: post.threadID}), function() {
      if (!this.response) { return; }
      const {posts} = this.response;
      g.SITE.Build.spoilerRange[post.board.ID] = posts[0].custom_spoiler;
      for (var postData of posts) {
        if (postData.no === post.ID) {
          var t1 = new Date().getTime();
          var obj = g.SITE.Build.parseJSON(postData, post.board);
          var root = g.SITE.Build.post(obj);
          var t2 = new Date().getTime();
          Test.time += t2 - t1;
          var post2 = new Post(root, post.thread, post.board, {forBuildTest: true});
          var fail = false;

          var x = post.normalizedOriginal;
          var y = post2.normalizedOriginal;
          if (!x.isEqualNode(y)) {
            fail = true;
            c.log(`${post.fullID} differs`);
            var [x2, y2] = Array.from(Test.firstDiff(x, y));
            c.log(x2);
            c.log(y2);
            c.log(x.outerHTML);
            c.log(y.outerHTML);
          }

          for (var key in Config.filter) {
            if ((!key === 'General') && !((key === 'MD5') && (post.board.ID === 'f'))) {
              var val1 = Filter.values(key, obj);
              var val2 = Filter.values(key, post2);
              if ((val1.length !== val2.length) || !val1.every((x, i) => x === val2[i])) {
                fail = true;
                c.log(`${post.fullID} has filter bug in ${key}`);
                c.log(val1);
                c.log(val2);
              }
            }
          }

          if (fail) {
            Test.postsFailed++;
          } else {
            c.log(`${post.fullID} correct`);
          }
          Test.postsRemaining--;
          if (Test.postsRemaining === 0) { Test.report(); }
        }
      }
    });
  },

  testAll() {
    g.posts.forEach(function(post) {
      if (!post.isClone && !post.isFetchedQuote) {
        let abbr;
        if (!((abbr = $('.abbr', post.nodes.comment)) && /Comment too long\./.test(abbr.textContent))) {
          return Test.testOne(post);
        }
      }
    });
  },

  postsRemaining: 0,
  postsFailed: 0,
  time: 0,

  report() {
    if (Test.postsFailed) {
      new Notice('warning', `${Test.postsFailed} post(s) differ (${Test.time} ms)`, 30);
    } else {
      new Notice('success', `All correct (${Test.time} ms)`, 5);
    }
    return Test.postsFailed = (Test.time = 0);
  },

  cb: {
    testOne() {
      Test.testOne(g.posts.get(this.dataset.fullID));
      return Menu.menu.close();
    },

    testAll() {
      Test.testAll();
      return Header.menu.close();
    },

    testOrder() {
      let x;
      const list1 = ((() => {
        const result = [];
        for (x of Unread.order.order()) {           result.push(x.ID);
        }
        return result;
      })());
      const list2 = ((() => {
        const result1 = [];
        for (x of ($$((g.SITE.isOPContainerThread ? `${g.SITE.selectors.thread}, ` : '') + g.SITE.selectors.postContainer))) {           result1.push(+x.id.match(/\d*$/)[0]);
        }
        return result1;
      })());
      const pass = (function() {
        if (list1.length !== list2.length) { return false; }
        for (let i = 0, end = list1.length; i < end; i++) {
          if (list1[i] !== list2[i]) { return false; }
        }
        return true;
      })();
      if (pass) {
        return new Notice('success', `Orders same (${list1.length} posts)`, 5);
      } else {
        new Notice('warning', 'Orders differ.', 30);
        c.log(list1);
        return c.log(list2);
      }
    },

    keydown(e) {
      if (Keybinds.keyCode(e) !== 'v') { return; }
      if (['INPUT', 'TEXTAREA'].includes(e.target.nodeName)) { return; }
      Test.testAll();
      e.preventDefault();
      return e.stopPropagation();
    }
  }
};
// <% } %>
