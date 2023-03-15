// cSpell:ignore installGentoo, fontawesome, webfont

import $ from '../platform/$';

// import boardCss from './board.css';
import faCSS from '../../node_modules/font-awesome/css/font-awesome.css';
import faWebFont from '../../node_modules/font-awesome/fonts/fontawesome-webfont.woff';

import burichan from './burichan.css';
import fontAwesome from './font-awesome.css';
import futaba from './futaba.css';
import linkifyAudio from './linkify.audio.png';
import linkifyBitchute from './linkify.bitchute.png';
import linkifyClyp from './linkify.clyp.png';
import linkifyDailymotion from './linkify.dailymotion.png';
import linkifyGfycat from './linkify.gfycat.png';
import linkifyGist from './linkify.gist.png';
import linkifyImage from './linkify.image.png';
import linkifyInstallgentoo from './linkify.installgentoo.png';
import linkifyLiveleak from './linkify.liveleak.png';
import linkifyPastebin from './linkify.pastebin.png';
import linkifyPeertube from './linkify.peertube.png';
import linkifySoundcloud from './linkify.soundcloud.png';
import linkifyStreamable from './linkify.streamable.png';
import linkifyTwitchtv from './linkify.twitchtv.png';
import linkifyTwitter from './linkify.twitter.png';
import linkifyVideo from './linkify.video.png';
import linkifyVidlii from './linkify.vidlii.png';
import linkifyCimeo from './linkify.vimeo.png';
import linkifyVine from './linkify.vine.png';
import linkifyVocaroo from './linkify.vocaroo.png';
import linkifyYoutube from './linkify.youtube.png';

import photon from './photon.css';
import report from './report.css';
import spooky from './spooky.css';
import style from './style.css';
// style.inc
import supports from './supports.css';
import tomorrow from './tomorrow.css';
import www from './www.css';
import yotsubaB from './yotsuba-b.css';
import yotsuba from './yotsuba.css';
import { fa, icons } from './style';
import { g } from '../globals/globals';

// <%
  // var inc       = require['style'];
  // var faCSS     = read('/node_modules/font-awesome/css/font-awesome.css');
  // var faWebFont = readBase64('/node_modules/font-awesome/fonts/fontawesome-webfont.woff');
  // var mainCSS   = ['font-awesome', 'style', 'yotsuba', 'yotsuba-b', 'futaba', 'burichan', 'tomorrow', 'photon', 'spooky'].map(x => read(`${x}.css`)).join('');
//   var iconNames = files.filter(f => /^linkify\.[^.]+\.png$/.test(f));
//   var icons     = iconNames.map(readBase64);
// %>

const mainCSS = fontAwesome + style + yotsuba +yotsubaB+futaba+burichan+tomorrow + photon + spooky;
const faIcons: { name: string, data: string }[] = [
  { name: "Audio", data: linkifyAudio },
  { name: "Bitchute", data: linkifyBitchute },
  { name: "Clyp", data: linkifyClyp },
  { name: "Dailymotion", data: linkifyDailymotion },
  { name: "Gfycat", data: linkifyGfycat },
  { name: "Gist", data: linkifyGist },
  { name: "Image", data: linkifyImage },
  { name: "Installgentoo", data: linkifyInstallgentoo },
  { name: "Liveleak", data: linkifyLiveleak },
  { name: "Pastebin", data: linkifyPastebin },
  { name: "Peertube", data: linkifyPeertube },
  { name: "Soundcloud", data: linkifySoundcloud },
  { name: "Streamable", data: linkifyStreamable },
  { name: "Twitchtv", data: linkifyTwitchtv },
  { name: "Twitter", data: linkifyTwitter },
  { name: "Video", data: linkifyVideo },
  { name: "Vidlii", data: linkifyVidlii },
  { name: "Cimeo", data: linkifyCimeo },
  { name: "Vine", data: linkifyVine },
  { name: "Vocaroo", data: linkifyVocaroo },
  { name: "Youtube", data: linkifyYoutube },
];

const CSS = {

  boards: fa(faCSS, faWebFont) + mainCSS + icons(faIcons) + supports,

  report,

  www,

  sub: function(css: string) {
    var variables = {
      site: g.SITE.selectors
    };
    return css.replace(/\$[\w\$]+/g, function(name) {
      var words = name.slice(1).split('$');
      var sel = variables;
      for (var i = 0; i < words.length; i++) {
        if (typeof sel !== 'object') return ':not(*)';
        sel = $.getOwn(sel, words[i]);
      }
      if (typeof sel !== 'string') return ':not(*)';
      return sel;
    });
  }

};

export default CSS;
