import Callbacks from "../classes/Callbacks";
// #region tests_enabled
import Test from "../General/Test";
// #endregion
import { g, Conf } from "../globals/globals";
import ImageHost from "../Images/ImageHost";
import ExpandComment from "../Miscellaneous/ExpandComment";
import $ from "../platform/$";
import $$ from "../platform/$$";
import Embedding from "./Embedding";

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var Linkify = {
  init() {
    if (!['index', 'thread', 'archive'].includes(g.VIEW) || !Conf['Linkify']) { return; }

    if (Conf['Comment Expansion']) {
      ExpandComment.callbacks.push(this.node);
    }

    Callbacks.Post.push({
      name: 'Linkify',
      cb:   this.node
    });

    return Embedding.init();
  },

  node() {
    let link;
    if (this.isClone) { return Embedding.events(this); }
    if (!Linkify.regString.test(this.info.comment)) { return; }
    for (link of $$('a', this.nodes.comment)) {
      if (g.SITE.isLinkified?.(link)) {
        $.addClass(link, 'linkify');
        if (ImageHost.useFaster) { ImageHost.fixLinks([link]); }
        Embedding.process(link, this);
      }
    }
    const links = Linkify.process(this.nodes.comment);
    if (ImageHost.useFaster) { ImageHost.fixLinks(links); }
    for (link of links) { Embedding.process(link, this); }
  },

  process(node) {
    let length;
    const test     = /[^\s"]+/g;
    const space    = /[\s"]/;
    const snapshot = $.X('.//br|.//text()', node);
    let i = 0;
    const links = [];
    while ((node = snapshot.snapshotItem(i++))) {
      var result;
      var {data} = node;
      if (!data || (node.parentElement.nodeName === "A")) { continue; }

      while ((result = test.exec(data))) {
        var {index} = result;
        var endNode = node;
        var word    = result[0];
        // End of node, not necessarily end of space-delimited string
        if ((length = index + word.length) === data.length) {
          var saved;
          test.lastIndex = 0;

          while (saved = snapshot.snapshotItem(i++)) {
            var end;
            if ((saved.nodeName === 'BR') || ((saved.parentElement.nodeName === 'P') && !saved.previousSibling)) {
              var part1, part2;
              if (
                // link deliberately split
                (part1 = word.match(/(https?:\/\/)?([a-z\d-]+\.)*[a-z\d-]+$/i)) &&
                (part2 = snapshot.snapshotItem(i)?.data?.match(/^(\.[a-z\d-]+)*\//i)) &&
                ((part1[0] + part2[0]).search(Linkify.regString) === 0)
              ) {
                continue;
              } else {
                break;
              }
            }

            if ((saved.parentElement.nodeName === "A") && !Linkify.regString.test(word)) {
              break;
            }

            endNode  = saved;
            ({data}   = saved);

            if (end = space.exec(data)) {
              // Set our snapshot and regex to start on this node at this position when the loop resumes
              word += data.slice(0, end.index);
              test.lastIndex = (length = end.index);
              i--;
              break;
            } else {
              ({length} = data);
              word    += data;
            }
          }
        }

        if (Linkify.regString.test(word)) {
          links.push(Linkify.makeRange(node, endNode, index, length));

          // #region tests_enabled
          if (links.length) {
            Test.assert(() => word === links[links.length - 1]?.toString());
          }
          // #endregion
        }

        if (!test.lastIndex || (node !== endNode)) { break; }
      }
    }

    i = links.length;
    while (i--) {
      links[i] = Linkify.makeLink(links[i]);
    }
    return links;
  },

  regString: new RegExp(`(\
\
(https?|mailto|git|magnet|ftp|irc):(\
[a-z\\d%/?]\
)\
|\
([-a-z\\d]+[.])+(\
aero|asia|biz|cat|com|coop|dance|info|int|jobs|mobi|moe|museum|name|net|org|post|pro|tel|travel|xxx|xyz|edu|gov|mil|[a-z]{2}\
)([:/]|(?![^\\s"]))\
|\
[\\d]{1,3}\\.[\\d]{1,3}\\.[\\d]{1,3}\\.[\\d]{1,3}\
|\
[-\\w\\d.@]+@[a-z\\d.-]+\\.[a-z\\d]\
)`, 'i'),

  makeRange(startNode, endNode, startOffset, endOffset) {
    const range = document.createRange();
    range.setStart(startNode, startOffset);
    range.setEnd(endNode,   endOffset);
    return range;
  },

  makeLink(range) {
    let t;
    let encodedDomain;
    let text = range.toString();

    // Clean start of range
    let i = text.search(Linkify.regString);

    if (i > 0) {
      text = text.slice(i);
      while ((range.startOffset + i) >= range.startContainer.data.length) { i--; }

      if (i) { range.setStart(range.startContainer, range.startOffset + i); }
    }

    // Clean end of range
    i = 0;
    while (/[)\]}>.,]/.test(t = text.charAt(text.length - (1 + i)))) {
      if (!/[.,]/.test(t) && !((text.match(/[()\[\]{}<>]/g)).length % 2)) { break; }
      i++;
    }

    if (i) {
      text = text.slice(0, -i);
      while ((range.endOffset - i) < 0) { i--; }

      if (i) {
        range.setEnd(range.endContainer, range.endOffset - i);
      }
    }

    // Make our link 'valid' if it is formatted incorrectly.
    if (!/((mailto|magnet):|.+:\/\/)/.test(text)) {
      text = (
        /@/.test(text) ?
          'mailto:'
        :
          'http://'
      ) + text;
    }

    // Decode percent-encoded characters in domain so that they behave consistently across browsers.
    if (encodedDomain = text.match(/^(https?:\/\/[^/]*%[0-9a-f]{2})(.*)$/i)) {
      text = encodedDomain[1].replace(/%([0-9a-f]{2})/ig, function(x, y) {
        if (y === '25') { return x; } else { return String.fromCharCode(parseInt(y, 16)); }
      }) + encodedDomain[2];
    }

    const a = $.el('a', {
      className: 'linkify',
      rel:       'noreferrer noopener',
      target:    '_blank',
      href:      text
    }
    );

    // Insert the range into the anchor, the anchor into the range's DOM location, and destroy the range.
    $.add(a, range.extractContents());
    range.insertNode(a);

    return a;
  }
};
export default Linkify;
