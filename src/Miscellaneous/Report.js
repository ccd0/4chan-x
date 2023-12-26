import Redirect from "../Archive/Redirect";
import $ from "../platform/$";
import ReportPage from './Report/ArchiveReport.html';
import CSS from "../css/CSS";
import Captcha from "../Posting/Captcha";
import { Conf, d, g } from "../globals/globals";

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */

var Report = {
  init() {
    let match;
    if (!(match = location.search.match(/\bno=(\d+)/))) { return; }
    Captcha.replace.init();
    this.postID = +match[1];
    return $.ready(this.ready);
  },

  ready() {
    $.addStyle(CSS.report);

    if (Conf['Archive Report']) { Report.archive(); }

    new MutationObserver(function() {
      Report.fit('iframe[src^="https://www.google.com/recaptcha/api2/frame"]');
      return Report.fit('body');
    }).observe(d.body, {
      childList:  true,
      attributes: true,
      subtree:    true
    }
    );
    return Report.fit('body');
  },

  fit(selector) {
    let el;
    if (!((el = $(selector, doc)) && (getComputedStyle(el).visibility !== 'hidden'))) { return; }
    const dy = (el.getBoundingClientRect().bottom - doc.clientHeight) + 8;
    if (dy > 0) { return window.resizeBy(0, dy); }
  },

  archive() {
    let match, urls;
    if (!(urls = Redirect.report(g.BOARD.ID)).length) { return; }

    const form    = $('form');
    const types   = $.id('reportTypes');
    const message = $('h3');

    const fieldset = $.el('fieldset', {
      id: 'archive-report',
      hidden: true
    }
    ,
      { innerHTML: ReportPage });
    const enabled = $('#archive-report-enabled', fieldset);
    const reason  = $('#archive-report-reason',  fieldset);
    const submit  = $('#archive-report-submit',  fieldset);

    $.on(enabled, 'change', function() {
      return reason.disabled = !this.checked;
    });

    if (form && types) {
      fieldset.hidden = !$('[value="31"]', types).checked;
      $.on(types, 'change', function(e) {
        fieldset.hidden = (e.target.value !== '31');
        return Report.fit('body');
      });
      $.after(types, fieldset);
      Report.fit('body');
      $.one(form, 'submit', function(e) {
        if (!fieldset.hidden && enabled.checked) {
          e.preventDefault();
          return Report.archiveSubmit(urls, reason.value, results => {
            this.action = '#archiveresults=' + encodeURIComponent(JSON.stringify(results));
            return this.submit();
          });
        }
      });
    } else if (message) {
      fieldset.hidden = /Report submitted!/.test(message.textContent);
      $.on(enabled, 'change', function() {
        return submit.hidden = !this.checked;
      });
      $.after(message, fieldset);
      $.on(submit, 'click', () => Report.archiveSubmit(urls, reason.value, Report.archiveResults));
    }

    if (match = location.hash.match(/^#archiveresults=(.*)$/)) {
      try {
        return Report.archiveResults(JSON.parse(decodeURIComponent(match[1])));
      } catch (error) {}
    }
  },

  archiveSubmit(urls, reason, cb) {
    const form = $.formData({
      board:  g.BOARD.ID,
      num:    Report.postID,
      reason
    });
    const results = [];
    for (var [name, url] of urls) {
      (function(name, url) {
        return $.ajax(url, {
          onloadend() {
            results.push([name, this.response || {error: ''}]);
            if (results.length === urls.length) {
              return cb(results);
            }
          },
          form
        });
      })(name, url);
    }
  },

  archiveResults(results) {
    const fieldset = $.id('archive-report');
    for (var [name, response] of results) {
      var line = $.el('h3',
        {className: 'archive-report-response'});
      if ('success' in response) {
        $.addClass(line, 'archive-report-success');
        line.textContent = `${name}: ${response.success}`;
      } else {
        $.addClass(line, 'archive-report-error');
        line.textContent = `${name}: ${response.error || 'Error reporting post.'}`;
      }
      if (fieldset) {
        $.before(fieldset, line);
      } else {
        $.add(d.body, line);
      }
    }
  }
};
export default Report;
