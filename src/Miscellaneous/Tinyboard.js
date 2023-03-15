import { g } from "../globals/globals";
import Main from "../main/Main";
import $ from "../platform/$";

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Tinyboard = {
  init() {
    if (g.SITE.software !== 'tinyboard') { return; }
    if (g.VIEW === 'thread') {
      return Main.ready(() => $.global(function() {
        let base;
        let {boardID, threadID} = document.currentScript.dataset;
        threadID = +threadID;
        const form = document.querySelector('form[name="post"]');
        window.$(document).ajaxComplete(function(event, request, settings) {
          let postID;
          if (settings.url !== form.action) { return; }
          if (!(postID = +request.responseJSON?.id)) { return; }
          const detail = {boardID, threadID, postID};
          try {
            const {redirect, noko} = request.responseJSON;
            if (redirect && (originalNoko != null) && !originalNoko && !noko) {
              detail.redirect = redirect;
            }
          } catch (error) {}
          event = new CustomEvent('QRPostSuccessful', {bubbles: true, detail});
          return document.dispatchEvent(event);
        });
        var originalNoko = window.tb_settings?.ajax?.always_noko_replies;
        return (((base = window.tb_settings || (window.tb_settings = {}))).ajax || (base.ajax = {})).always_noko_replies = true;
      }
      , {boardID: g.BOARD.ID, threadID: g.THREADID}));
    }
  }
};
export default Tinyboard;
