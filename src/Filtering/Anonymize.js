/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Anonymize = {
  init() {
    if (!Conf['Anonymize']) { return; }
    return $.addClass(doc, 'anonymize');
  }
};
