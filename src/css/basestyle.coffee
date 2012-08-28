  css: (theme) ->
    agent = Style.agent()
    css='
::' + agent + 'selection {
  background-color: ' + theme["Text"] + ';
  color: ' + theme["Background Color"] + ';
}
body {
  padding: 16px 0 16px;
}
@media only screen and (max-width: 1100px) {
  body {
    padding-top: 31px;
  }
}
@media only screen and (max-width:689px) {
  body {
    padding-top: 46px;
  }
}
@media only screen and (max-width:553px) {
  body {
    padding-top: 61px;
  }
}html, body, input, select, textarea, .boardTitle {
  font-family: "' + Conf["Font"] + '";
}
#recaptcha_image img,
#qr img,
.captcha img {
  opacity: ' + Conf["Captcha Opacity"] + ';
}
#qp div.post .postertrip,
#qp div.post .subject,
.capcode,
.container::before,
.dateTime,
.file,
.fileInfo,
.fileText,
.fileText span:not([class])::after,
.name,
.postNum,
.postertrip,
.rules,
.subject,
.subjectm
.summary,
a,
blockquote,
div.post > blockquote .chanlinkify.YTLT-link.YTLT-text,
div.reply,
fieldset,
textarea,
time + span {
  font-size: ' + Conf["Font Size"] + 'px;
}
.globalMessage {
  bottom: auto;
  padding: 10px 5px 10px 5px;
  position: fixed;
  left: auto;
  right: 2px;
  top: -1000px;
}
.globalMessage b { font-weight: 100; }
/* Cleanup */
#absbot,
#ft li.fill,
#logo,
#postPassword + span,
#qr.auto:not(:hover) #recaptcha_reload_btn,
#recaptcha_switch_audio_btn,
#recaptcha_whatsthis_btn,
#settingsBox[style*="display: none;"],
.board > hr:last-of-type,
.closed,
.deleteform br,
.error:empty,
.hidden_thread > .summary,
.mobile,
.navLinksBot,
.next,
.pages td:nth-of-type(2n-1),
.postingMode,
.prev,
.qrHeader,
.replyContainer > .hide_reply_button.stub ~ .reply,
.replymode,
.rules,
.sideArrows:not(.hide_reply_button),
.stylechanger,
.warnicon,
.warning:empty,
.yui-menu-shadow,
a[href*="jlist"],
body > .postingMode ~ #delform hr,
body > br,
body > hr,
div.reply[hidden],
form table tbody > tr:nth-of-type(2) td[align="right"],
form[name="post"] h1,
html body > span[style="left: 5px; position: absolute;"]:nth-of-type(0),
table[style="text-align:center;width:100%;height:300px;"],
td[style^="padding: "]:not([style="padding: 10px 7px 7px 7px;"]):not([style="padding: 10px 7px 7px;"]),
#imgControls label:first-of-type input,
.autoPagerS,
#options hr,
.inline .report_button,
.inline input,
.entry:not(.focused) > .subMenu,
#autohide,
#qr.autohide select,
#qr.autohide .close {
  display: none !important;
}
div.post > blockquote .prettyprint span {
  font-family: monospace;
}
div.post div.file .fileThumb {
  float: left;
  margin: 3px 20px 0;
}
a {
  outline: 0;
}
#boardNavDesktop,
#boardNavDesktop a,
#boardNavDesktopFoot a,
#count,
#imageType,
#imageType option
#imgControls,
#navtopr a[href="javascript:;"],
#postcount,
#stats,
#timer,
#updater,
.pages a,
.pages strong,
body:not([class]) a[href="javascript:void(0);"],
input,
label {
  font-size: 12px;
  text-decoration: none;
}
.filtered {
  text-decoration: line-through;
}
/* YouTube Link Title */
div.post > blockquote .chanlinkify.YTLT-link.YTLT-na {
  text-decoration: line-through;
}
div.post > blockquote .chanlinkify.YTLT-link.YTLT-text {
  font-style: normal;
}
/* Z-INDEXES */
#options.reply.dialog {
  z-index: 999 !important;
}
#qp {
  z-index: 102 !important;
}
#autoPagerBorderPaging,
#boardNavDesktop,
#boardNavDesktopFoot:hover,
#ihover,
#menu.reply.dialog,
#navlinks,
#overlay,
#updater:hover,
.exPopup,
html .subMenu {
  z-index: 101 !important;
}
.fileThumb {
  z-index: 100 !important;
}
div.navLinks a:first-of-type::after,
.deleteform {
  z-index: 99 !important;
}
#qr,
body > form #imgControls {
  z-index: 98 !important;
}
.fileText ~ a > img + img {
  z-index: 96 !important;
}
#boardNavMobile,
#imageType,
#imgControls label:first-of-type,
#imgControls label:first-of-type::after,
#stats,
#updater {
  z-index: 10 !important;
}
#settingsBox {
  z-index: 9 !important;
}
.deleteform:hover input[type="checkbox"],
.deleteform:hover .rice {
  z-index: 7 !important;
}
#boardNavDesktopFoot::after,
#navtopr,
.deleteform::before,
.qrMessage,
#navtopr .settingsWindowLink::after {
  z-index: 6 !important;
}
#stats,
#watcher,
#watcher::before {
  z-index: 4 !important;
}
body::after {
  z-index: 3 !important;
}
#recaptcha_reload_btn,
.boardBanner,
.globalMessage::before,
.replyhider a {
  z-index: 1 !important;
}
div.reply,
div.reply.highlight {
  z-index: 0 !important;
  ' + agent + 'box-sizing: border-box;
}
/* ICON POSITIONS */
/* 4chan X Options / 4chan Options */
#navtopr .settingsWindowLink::after {
  position: fixed;
  left: auto;
  right: 17px;
  opacity: 0.3;
}
#navtopr .settingsWindowLink:hover::after {
  opacity: 1;
  right: 16px;
}
/* 4sight */
body > a[style="cursor: pointer; float: right;"]::after {
  font-size: 12px;
  position: fixed;
  right: 0px;
  opacity: 0.3;
}
body > a[style="cursor: pointer; float: right;"]:hover::after {
  opacity: 1;
}
/* Back */
div.navLinks > a:first-of-type::after {
  position: fixed;
  right: 230px;
  cursor: pointer;
  ' + agent + 'transform: scale(.8);
  opacity: 0.4;
  bottom: 1px;
  top: auto;
}
div.navLinks > a:first-of-type:hover::after {
  opacity: 1;
}
/* Delete Form */
.deleteform::before {
  visibility: visible;
  position: fixed;
  right: 210px;
  ' + agent + 'transform: scale(.9);
  opacity: 0.4;
  top: auto;
  bottom: 2px;
}
.deleteform:hover::before {
  opacity: 1;
  cursor: pointer;
  bottom: -30px;
  visibility: hidden;
}
/* Expand Images */
#imgControls label:first-of-type::after {
  opacity: 0.2;
  position: relative;
  top: 4px;
}
#imgControls label:hover:first-of-type::after {
  opacity: 1;
}
/* Global Message */
.globalMessage::before {
  height: 9px;
  position: fixed;
  right: 70px;
  min-width: 30px;
  max-width: 30px;
  padding-bottom: 5px;
  opacity: 0.4;
}
.globalMessage:hover::before {
  cursor: pointer;
  opacity: 1;
}
/* Slideout Navigation */
#boardNavDesktopFoot::after {
  border: none;
  position: fixed;
  right: 37px;
  opacity: 0.4;
}
#boardNavDesktopFoot:hover::after {
  opacity: 1;
  cursor: pointer;
}
/* Watcher */
#watcher::before {
  height: 9px;
  font-size: 12px;
  position: fixed;
  right: 42px;
  min-width: 30px;
  max-width: 30px;
  opacity: 0.4;
}
#watcher:hover::before {
  opacity: 1;
  cursor: pointer;
}
/* END OF ICON POSITIONS */
.boardBanner {
  position: fixed;
  left: auto;
  right: 2px;
  top: 19px;
  padding-top: 0px;
  margin: 0;
  margin-top: -6px;
  z-index: 1;
}
.boardBanner img {
  width: 248px;
  height: 83px;
  ' + agent + 'box-reflect: below 0px ' + agent + 'gradient( linear, left top, left bottom, from(transparent), color-stop(91%, rgba(255, 255, 255, .1)), color-stop(21.01%, transparent) );
}
.boardTitle {
  margin-top: 20px;
}
#watcher::before {
  top: 105px;
}
#watcher {
  position: fixed;
  top: 119px;
}
#boardNavDesktopFoot::after {
  top: 104px;
}
#boardNavDesktopFoot:hover {
  top: 119px;
}
#navtopr .settingsWindowLink::after {
  top: 104px;
}
#settingsBox {
  top: 110px;
}
body > a[style="cursor: pointer; float: right;"]::after {
  top: 104px;
}
.globalMessage::before {
  top: 104px;
}
.globalMessage:hover {
  top: 119px;
}
.boardTitle {
  margin-top: 20px;
}
#settingsBox {
  position: fixed;
  right: 5px;
  width: 234px;
}
#boardNavMobile {
  background: none;
  border: none;
  font-size: 12px;
  padding: 0px;
  padding-top: 1px;
  padding-left: 2px;
  width: 320px;
  pointer-events: none;
}
.pageJump {
  position: fixed;
  top: -1000px;
  pointer-events: all;
}
.extButton img {
  margin-top: -4px;
}
#boardNavMobile select {
  font-size: 11px;
  pointer-events: all;
}
.qrMessage {
  position: fixed;
  right: 3px;
  bottom: 250px;
  font-size: 11px;
  font-weight: 100;
  background: none;
  border: none;
  width: 248px;
}
.boardBanner {
  position: fixed;
  right: 2px;
  top: 19px;
  width: 248px;
  margin: 0;
  text-align: center;
 }
.boardBanner img {
  width: 248px;
  height: 83px;
}
.boardTitle {
  font-size: 30px;
  font-weight: 400;
}
.boardSubtitle {
  font-size: 13px;
}
/* 4watch */
body > span > div {
  position: fixed;
  top: auto;
  bottom: 440px;
  right: 0;
  width: 248px;
}
hr {
  padding: 0;
  height: 0;
  width: 100%;
  clear: both;
  border: none;
}
/* Front Page */
.bd,
.bd ul,
img,
.pages,
.pages *,
#qr,
div[id^="qr"],
table.reply[style^="clear: both"],
.boxcontent > hr,
h3 {
  border: none;
}
.boxcontent input {
  height: 18px;
  vertical-align: bottom;
  margin-right: 1px;
}
a.yuimenuitemlabel {
  padding: 0 20px;
}
/* Navigation */
#boardNavDesktop, /* Top Navigation */
.pages /* Bottom Navigation */ {
  text-align: center;
  font-size: 0;
  color: transparent;
  width: auto;
}
#boardNavDesktop{
  width: auto;
  padding-right: 0px;
  margin-right: 0px;
  padding-top: 1px;
  padding-bottom: 3px;
}
#boardNavDesktopFoot {
  visibility: visible;
  position: fixed;
  top: -1000px;
  right: 2px;
  bottom: auto;
  width: 226px;
  color: transparent;
  font-size: 0;
  padding: 3px 10px 35px 10px;
  border-width: 1px;
  text-align: center;
  word-spacing: -3px;
}
.fileThumb {
  position: relative;
}
.pages td:nth-of-type(1) {
  font-size: 75%;
  text-transform: uppercase;
}
.pages td {
  color: transparent;
}
#boardNavDesktop a,
.pages a,
.pages strong,
.pages input {
  ' + agent + 'appearance: none;
  display: inline-block;
  font-size: 12px;
  border: none;
  text-align: center;
  margin: 0 1px 0 2px;
}
.pages {
  word-spacing: 10px;
}
/* moot"s announcements */
.globalMessage {
  font-size: 12px;
  text-align: center;
  font-weight: 200;
}
.pages input {
  margin-bottom: 2px;
}
.pages strong,
.pages input,
a,
.new {
  ' + agent + 'transition: background-color .1s linear;
}
/* Post Form */
/* Override OS-specific UI */
#ft li,
#ft ul,
#options input:not([type="radio"]),
#updater input:not([type="radio"]),
.box-outer,
.boxbar,
.deleteform input[value=Delete],
.recaptcha_image_cell > center > #recaptcha_image,
[name="recaptcha_response_field"],
.top-box,
h2,
input:not([type="radio"]),
input[type="submit"],
textarea {
  ' + agent + 'appearance: none;
}
/* Unfuxor the Captcha layout */
#recaptcha_widget_div tr, #recaptcha_widget_div td, #recaptcha_widget_div center, #recaptcha_widget_div #recaptcha_table, #recaptcha_widget_div #recaptcha_area, #recaptcha_widget_div #recaptcha_image {
  margin: 0;
  padding: 0;
  height: auto;
}
#recaptcha_table #recaptcha_image {
  border: none;
}
/* Formatting for all postarea elements */
.recaptchatable #recaptcha_response_field,
.deleteform input[type="password"],
input,
input.field,
input[type="submit"],
textarea {
  border-width: 1px !important;
  border-style: solid !important;
  padding: 1px !important;
  height: 20px !important;
}
#qr .move .field,
#qr input[type="submit"],
input[type="file"],
#qr textarea,
#qr .field {
  margin: 1px 0 0;
  vertical-align: bottom;
}
/* Width and height of all postarea elements (excluding some captcha elements) */
#recaptcha_response_field,
textarea.field,
#recaptcha_widget_div input,
#qr .move .field,
#qr .field[type="password"],
.ys_playerContainer audio,
#qr input[title="Verification"],
#recaptcha_image,
#qr div,
input[type="file"] {
  width: 248px;
}
/* Buttons */
input[type="submit"], /* Any lingering buttons */
input[value="Report"] {
  cursor: default;
  height: 20px;
  padding: 0;
  font-size: 12px;
}
#qr input[type="submit"] {
  width: 100%;
  float: left;
  clear: both;
}
#qr input[type="file"] {
  height: auto;
  border: none 0px;
  padding: 0;
  float: left;
}
#qr input[name="email"] + label {
  bottom: 2px;
  right: 4px;
}
#qr input[name="sub"] + input + label {
  font-size: 12px;
  top: auto;
  right: 70px;
  margin-top: 1px;
}
/* Image Hover and Image Expansion */
#ihover {
  max-width:85%;
  max-height:85%;
}
#qp {
  min-width: 500px;
}
.fileText ~ a > img + img {
  position: relative;
  top: 0px;
}
#imageType {
  border: none;
  width: 90px;
  position: relative;
  bottom: 1px;
  background: none;
}
/* #qr dimensions */
#qr {
  height: auto;
}
#recaptcha_reload_btn {
  position: absolute;
  height: 0;
  width: 0;
  padding: 12px 0 0 12px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAQAAAD8fJRsAAAAZ0lEQVR4XgXAsQ0BUQCA4c8kSrOo70KntAgxgkl05CV2sMOVEo2ofgEAYAIAdp6SRQBwkSQJgL3kbJYEwPC1BgArIFcAwAvIFgAcBQwAQAawQZK7g0UmAJKPt+QEAPlJHmYA4AYA8AeJKy3vtXoiawAAAABJRU5ErkJggg==") no-repeat;
  overflow: hidden;
}
.top-box .menubutton,
.boardTitle {
  background-image: none;
}
#delform > div:not(.thread) input,
.deleteform input[type="checkbox"],
.rice {
  vertical-align: middle;
}
#qr label input,
.boxcontent input,
.boxcontent textarea {
  ' + agent + 'appearance: none;
  border: 0;
}
input[type=checkbox],
.reply input[type=checkbox],
#options input[type=checkbox] {
  ' + agent + 'appearance: none;
  width: 12px;
  height: 12px;
  cursor: pointer;
}
.postingMode ~ #delform .opContainer input {
  position: relative;
  bottom: 2px;
}
/* Posts */
body > .postingMode ~ #delform br[clear="left"],
#delform center {
  position: fixed;
  bottom: -500px;
}
.deleteform {
  border-spacing: 0 1px;
}
#delform .fileText + br + a[target="_blank"] img,
#qp div.post .fileText + br + a[target="_blank"] img  {
  border: 0;
  float: left;
  margin: 5px 20px 15px;
}
#delform .fileText + br + a[target="_blank"] img + img {
  margin: 0 0 25px;
}
.fileText {
  margin-top: 17px;
}
.fileText span:not([class])::after {
  font-size: 13px;
}
#updater:hover {
  border: 0;
}
/* Fixes text spoilers */
.spoiler:not(:hover),
.spoiler:not(:hover) .quote,
.spoiler:not(:hover) a {
  color: rgb(0,0,0);
  text-shadow: none;
}
/* Remove default "inherit" background declaration */
.span.subject,
.subject,
.name,
.postertrip {
  background: transparent;
}
.name {
  font-weight: 700;
}
/* Addons and such */
body > div[style="width: 100%;"] {
  margin-top: 34px;
}
#copyright,
#boardNavDesktop a,
#qr td,
#qr tr[height="73"]:nth-of-type(2),
.recaptcha_input_area,
.menubutton a,
.pages td,
.recaptchatable td.recaptcha_image_cell,
td[style="padding-left: 7px;"],
div[id^="qr"] tr[height="73"]:nth-of-type(2) {
  padding: 0;
}
#navtopr {
  position: fixed;
  right: 60px;
  top: -100px;
  bottom: auto;
  font-size: 0;
  color: transparent;
}
/* Expand Images div */
#imgControls input {
  width: 10px;
  height: 10px;
  margin: 4px 1px;
  vertical-align: top;
}
#imgControls label {
  font-size: 0;
  color: transparent;
}
#imgControls label:first-of-type {
  position: fixed;
  right: 232px;
  top: 0px;
  bottom: auto;
}
#imageType {
  position: fixed;
  right: 140px;
  top: 1px;
  bottom: auto;
}
#imgControls label:nth-of-type(2)::after {
  font-size: 12px;
  content: "Preload?";
}
#imgControls select { float: right; }
/* Hide UI of the select element */
select > button,
select > input {
  opacity: 0;
}
#imgControls select > option { font-size: 80%; }
/* End of Expand Images div */
/* Reply Previews */
#qp div.post /* 4chan x Quote Preview */ {
  max-width: 70%;
  visibility: visible;
}
#qp div.op { display: table; }
#qp div.post { padding: 2px 6px; }
#qp div.post img {
  max-width: 300px;
  height: auto;
}
.deleteform {
  position: fixed;
  top: -1000px;
}
.deleteform  {
  position: fixed;
  top: -1000px;
  right: 2px;
  bottom: auto;
  width: 248px;
  margin: 0px;
  padding: 0px;
  font-size: 0px;
}
.deleteform:hover {
  position: fixed;
  right: 3px;
}
.deleteform {
  height: 18px;
  width: 250px;
}
.deleteform input[value="Delete"], .deleteform input[value="Report"] { float: left; }
.deleteform,
.deleteform { width: 246px; }
.deleteform:hover input[name="pwd"] {
  position: fixed;
  left: 105px;
  right: 3px;
  width: 146px;
  height: 20px;
  text-align: right;
}
div.deleteform input[type="password"] { width: 144px; }
.deleteform:hover input[type="checkbox"],
.deleteform:hover .rice {
  position: fixed;
  right: 130px;
}
.deleteform:hover::after {
  visibility: visible;
  position: fixed;
  right: 80px;
  font-size: 12px;
  content: "File Only";
  width: 50px;
}
.deleteform .field {
  width: 138px;
  margin-right: 1px;
}
div.navLinks {
  font-size: 0;
  visibility: hidden;
}
div.navLinks a {
  position: fixed;
  top: auto;
  right: -192px;
  bottom: -1000px;
  visibility: visible;
  height: 14px;
  width: 58px;
  margin: 0;
  padding: 0;
  font-size: 9px;
  text-transform: uppercase;
  vertical-align: bottom;
  padding-top: 5px;
  border-radius: 0;
  text-align: center;
}
/* File Clearer support */
.clearbutton {
  position: fixed;
  bottom: 45px;
  right: 55px;
}
/* AutoPager */
#autoPagerBorderPaging {
  position: fixed !important;
  right: 300px !important;
  bottom: 0px;
}
/* 4chan x options */
#options ul { margin: 0; }
#options ul > li { padding: 0; }
#options.reply.dialog, #options .dialog { width: 700px; }
#options ul {
  margin-bottom: 5px;
  padding-bottom: 7px;
}
#options ul:first-of-type { padding-top: 5px; }
#content textarea { width: 99%; }
/* End of 4chan x options */
#stats,
#navlinks {
  top: 0 !important;
  left: auto !important;
  bottom: auto !important;
  width: 96px;
  text-align: right;
  padding: 0;
  border: 0;
  border-radius: 0;
}
#stats {
  right: 45px !important;
  font-size: 12px;
  position: fixed;
  cursor: default;
}
#navlinks {
  right: 2px !important;
}
#updater {
  right: 2px !important;
  top: 0 !important;
  bottom: auto !important;
  width: 58px !important;
  border: 0;
  font-size: 12px;
  overflow: hidden;
  padding-bottom: 2px;
}
#updater { background: none; }
#count.new { background-color: transparent; }
#updater:hover {
  width: 150px;
  right: 2px !important;
}
#updater #count:not(.new) {
  font-size: 0;
  color: transparent;
}
#updater #count:not(.new)::after {
  font-size: 12px;
  content: "+0";
}
.opContainer .favicon {
  position: relative;
  top: 2px;
}
#watcher { padding-left: 0px; }
#watcher {
  padding: 1px 0;
  border-radius: 0;
}
#updater .move,
#options .move,
#stats .move { cursor: default !important; }
/* 4sight */
body > a[style="cursor: pointer; float: right;"] {
  position: fixed;
  top:-119px;
  right: 60px;
  font-size: 0px;
}
body > a[style="cursor: pointer; float: right;"] ~ div[style^="width: 100%;"] {
  display: block;
  position: fixed;
  top: 17px;
  bottom: 17px;
  left: 4px;
  right: 252px;
  width: auto;
  margin: 0;
}
body > a[style="cursor: pointer; float: right;"] ~ div[style^="width: 100%;"] > table {
  height: 100%;
  vertical-align: top;
}
body > a[style="cursor: pointer; float: right;"] ~ div[style^="width: 100%;"]{
  height: 95%;
  margin-top: 5px;
  margin-bottom: 5px;
}
#fs_status {
  width: auto;
  height: 100%;
  background: none;
  padding: 10px;
  overflow: scroll;
}
[alt="sticky"] + a::before { content: "Sticky | "; }
[alt="closed"] + a::before { content: "Closed | "; }
[alt="closed"] + a { text-decoration: line-through; }
/* Youtube Link Title */
.chanlinkify.YTLT-link.YTLT-text {
  font-family: monospace;
  font-size: 11px;
}
.fileText+br+a[target="_blank"]:hover { background: none; }
.inline, #qp {
  background-color: transparent;
  border: none;
}
/* Adblock Minus */
img[src^="//static.4chan.org/support/"] { display: none; }
input[type="submit"]:hover { cursor: pointer; }
/* 4chan Sounds */
.ys_playerContainer.reply {
  position: fixed;
  bottom: 252px;
  margin: 0;
  right: 3px;
  padding-right: 0;
  padding-left: 0;
  padding-top: 0;
}
#qr input:focus:' + agent + 'placeholder,
#qr textarea:focus:' + agent + 'placeholder {
  color: transparent;
}
img[md5] { image-rendering: optimizeSpeed; }
input,
textarea { text-rendering: geometricPrecision; }
#boardNavDesktop .current {
  font-weight: bold;
  font-size: 13px;
}
#postPassword {
  position: relative;
  bottom: 3px;
}
#recaptcha_table, #recaptcha_table tbody, #recaptcha tbody tr {
  display: block;
  visibility: visible;
}
.postContainer.inline {
  border: none;
  background: none;
  padding-bottom: 2px;
}
div.pagelist {
  background: none;
  border: none;
}
a.forwardlink { border: none; }
.deleteform { border-bottom: 2px solid transparent; }
.exif td { color: #999; }
.callToAction.callToAction-big {
  font-size: 18px;
  color: rgb(255,255,255);
}
body > table[cellpadding="30"] h1, body > table[cellpadding="30"] h3 { position: static; }
.focused.entry { background-color: transparent; }
#menu.reply.dialog, html .subMenu { padding: 0px; }
#charCount {
  background: none;
  position: absolute;
  right: 2px;
  top: 112px;
  color: rgb(0,0,0);
  font-size: 10px;
}
#charCount.warning {
  color: rgb(255,0,0);
  position: absolute;
  right: 2px;
  top: 110px;
}
textarea {
  resize: none;
}
/* .move contains the name field of the #qr. Here we"re making it behave like no more than a container. We also hide the "Quick Reply" text with a hack. */
#qr .move {
  color: transparent;
  font-size: 0;
  height: 20px;
  cursor: default;
}
/* Position and Dimensions of the #qr */
#qr {
  overflow: visible;
  position: fixed;
  top: auto !important;
  bottom: 20px !important;
  width: 248px;
  margin: 0;
  padding: 0;
  z-index: 5;
  background-color: transparent !important;
}
/* Width and height of all #qr elements (excluding some captcha elements) */
#qr textarea {
  min-height: 0 !important;
}
body > .postingMode ~ #delform .reply a > img[src^="//images"] {
  position: relative;
  z-index: 96;
}
#qr img {
  height: 47px;
  width: 248px;
}
#dump {
  background: none;
  border: none;
  width: 20px;
  height: 17px;
  margin: 0;
  font-size: 14px;
  vertical-align: middle;
  outline: none;
}
#dump:hover { background: none; }
#qr .move { height: 0px; }
#qr select {
  position: absolute;
  bottom: -18px;
  right: 65px;
  background: none;
  border: none;
  font-size: 12px;
  width: 128px;
}
#qr > form > label {
  font-size: 0px;
  color: transparent;
}
#qr > form > label::after {
  content: "Spoiler?";
  font-size: 12px;
}
.dump > form > label {
  display: block;
  visibility: hidden;
}
#qr [type="file"] input[type="text"] {
  width: 104px;
  position: relative;
  right: 1px;
}
#spoilerLabel {
  position: absolute;
  bottom: -20px;
  right: 20px;
}
#spoilerLabel input {
  position: relative;
  top: 1px;
  left: 2px;
}
#qr .warning {
  position: absolute;
  bottom: -18px;
  right: 1px;
  height: 20px;
  text-align: right;
  vertical-align: middle;
  padding-top: 2px;
  max-height: 16px;
}
.deleteform:hover {
  top: auto;
  bottom: 0px;
}
.deleteform:hover input[type="checkbox"],
.deleteform:hover .rice,
.deleteform:hover::after {
  top: auto;
  bottom: 2px;
}
.deleteform:hover input[name="pwd"] {
  top: auto;
  bottom: 0px;
}
input[title="Verification"],
.captchaimg img {
  margin-top: 1px;
}
#qr.autohide .move {
  display: inline-block;
  font-size: 12px;
  visibility: visible;
  height: 20px;
  bottom: 20px;
  text-align: center;
  overflow: visible;
  padding-top: 3px;
  ' + agent + 'transition: opacity .3s ease-in-out .3s;
  min-width: 0;
  width: 248px;
}
#qr.autohide:not(:hover) .move {
  position: fixed;
  bottom: 0px;
}
#qr.autohide {
  padding-bottom: 0px;
  bottom: -250px!important;
  ' + agent + 'transition: bottom .3s ease-in-out .3s, top .3s ease-in-out .3s;
}
#qr.autohide:hover {
  padding-bottom: 16px;
  ' + agent + 'transition: bottom .3s linear, top .3s linear;
  bottom: 1px;
}
#qr.autohide:hover .move { padding-bottom: 5px; }
#qr.autohide:hover .move input { display: inline-block; }
#qr.autohide:hover select { display: inline-block; }
#qr.autohide:hover .move { padding-top: 1px; }
#qr textarea.field,
#qr div { min-width: 0; }
html body span[style="left: 5px; position: absolute;"] a {
  height: 14px;
  padding-top: 3px;
  width: 56px;
}
#qr textarea.field {
  height: 88px !important;
}
.textarea {
  height: 89px !important;
}
hr {
  position: relative;
  top: 2px;
}
#updater input,
#options input,
#qr,
table.reply[style^="clear: both"] {
  border: none;
}
#delform > div:not(.thread) select,
.pages input[type="submit"] {
  margin: 0;
  height: 17px;
}
#qr.autohide .move {
  border-bottom: none;
}
.prettyprint {
  white-space: pre-wrap;
  border-radius: 2px;
  font-size: 11px;
}
body {
  background-color: ' + theme["Background Color"] + ';
  background-image: ' + theme["Background Image"] + ';
  background-repeat: ' + theme["Background Repeat"] + ';
  background-attachment: ' + theme["Background Attachment"] + ';
  background-position: ' + theme["Background Position"] + ';
}
.boardTitle {
  text-shadow: 1px 1px 1px ' + theme["Reply Border"] + ';
}
#ft li,
#ft ul,
#options .dialog,
#qr::before,
#watcher,
#updater:hover,
.box-outer,
.boxbar,
.deleteform input[value=Delete],
.top-box,
.yuimenuitem-selected,
html body span[style="left: 5px; position: absolute;"] a,
input[type="submit"],
#options.reply.dialog,
.deleteform input[value=Delete],
input[value="Report"],
#qr.autohide .move {
  background-color: ' + theme["Buttons Background"] + ';
  border-color: ' + theme["Buttons Border"]  + ';
}
.recaptchatable #recaptcha_response_field,
.deleteform input[type="password"],
#dump,
input,
input.field,
textarea,
textarea.field {
  background-color: ' + theme["Input Background"] + ';
  border: 1px solid ' + theme["Input Border"]  + ';
  color: ' + theme["Inputs"] + ';
  ' + agent + 'transition: all .2s linear;
}
div.navLinks a:first-of-type:hover,
.deleteform input:hover,
.recaptchatable #recaptcha_response_field:hover,
input:hover,
input.field:hover,
input[type="submit"]:hover,
textarea:hover,
textarea.field:hover {
  background-color: ' + theme["Hovered Input Background"] + ';
  border-color: ' + theme["Hovered Input Border"]  + ';
  color: ' + theme["Inputs"] + ';
}
.recaptchatable #recaptcha_response_field:focus,
.deleteform input[type="password"]:focus,
input:focus,
input.field:focus,
input[type="submit"]:focus,
textarea:focus,
textarea.field:focus {
  background-color: ' + theme["Focused Input Background"] + ';
  border-color: ' + theme["Focused Input Border"]  + ';
  color: ' + theme["Inputs"] + ';
}
#qp div.post,
div.reply {
  background-color: ' + theme["Reply Background"] + ';
  border: 1px solid ' + theme["Reply Border"]  + ';
}
.reply.highlight {
  background-color: ' + theme["Highlighted Reply Background"] + ';
  border: 1px solid ' + theme["Highlighted Reply Border"]  + ';
}
#boardNavDesktop,
.pages {
  background-color: ' + theme["Navigation Background"] + ';
  border-color: ' + theme["Navigation Border"]  + ';
}
#delform {
  background-color: ' + theme["Thread Wrapper Background"] + ';
  border: 1px solid ' + theme["Thread Wrapper Border"]  + ';
}
#boardNavDesktopFoot,
#watcher,
#watcher:hover,
.deleteform,
div.subMenu,
#menu {
  background-color: ' + theme["Dialog Background"] + ';
  border: 1px solid ' + theme["Dialog Border"]  + ';
}
.inline div.reply {
  /* Inline Quotes */
  background-color: ' + (if theme["Dark Theme"] == "1" then "rgba(255,255,255,0.03)" else "rgba(0,0,0,0.03)") + ';
  border: 1px solid ' + theme["Reply Border"] + ';
  box-shadow: 5px 5px 5px '+ theme["Shadow Color"] + ';
}
 [id^="q"] .warning {
  background: ' + theme["Input Background"] + ';
  border: 1px solid ' + theme["Input Border"]  + ';
  color: ' + theme["Warnings"] + ';
}
a,
#dump,
.entry,
div.post > blockquote a[href^="//"],
.sideArrows a,
div.postContainer span.postNum > .replylink {
  color: ' + theme["Links"] + ';
}
.postNum a {
  color: ' + theme["Post Numbers"] + ';
}
.subject {
  color: ' + theme["Subjects"] + ';
  font-weight: 600;
}
#updater:not(:hover),
#updater:not(:hover) #count:not(.new)::after,
.summary,
body > form,
body,
html body span[style="left: 5px; position: absolute;"] a,
input,
.deleteform::after,
textarea,
.abbr,
.boxbar,
.boxcontent,
.pages strong,
.reply,
.reply.highlight,
#boardNavDesktop .title,
#imgControls label::after,
#boardNavDesktop::after,
#updater #count:not(.new)::after,
#qr > form > label::after,
#qr.autohide .move,
span.pln {
  color: ' + theme["Text"] + ';
}
#options ul {
  border-bottom: 1px solid ' + theme["Reply Border"] + ';
}
.quote {
  color: ' + theme["Greentext"] + ';
}
span.quote > a.quotelink,
a.quotelink,
a.backlink {
  color: ' + theme["Backlinks"] + ';
  font-weight: 800;
}
div.subMenu,
#menu,
#qp div.post {
  box-shadow: 5px 5px 5px '+ theme["Shadow Color"] + ';
}
.rice {
  cursor: pointer;
  width: 10px;
  height: 10px;
  margin: 3px;
  display: inline-block;
  background-color: ' + theme["Checkbox Background"] + ';
  border: 1px solid ' + theme["Checkbox Border"]  + ';
}
#options input,
#options textarea,
#qr label input,
#updater input,
.bd {
  background-color: ' + theme["Buttons Background"] + ';
  border: 1px solid ' + theme["Buttons Border"]  + ';
}
.pages a,
#boardNavDesktop a {
  color: ' + theme["Navigation Links"] + ';
}
input[type=checkbox]:checked + .rice {
  background-color: ' + theme["Checkbox Checked Background"] + ';
}
a:hover,
#dump:hover,
.entry:hover,
div.post > blockquote a[href^="//"]:hover,
.sideArrows a:hover,
div.post div.postInfo span.postNum a:hover,
div.postContainer span.postNum > .replylink:hover,
.nameBlock > .useremail > .name:hover,
.nameBlock > .useremail > .postertrip:hover {
  color: ' + theme["Hovered Links"] + ';
}
.boardBanner a:hover,
#boardNavDesktop a:hover {
  color: ' + theme["Hovered Navigation Links"] + ';
}
.boardBanner {
  color: ' + theme["Board Title"] + ';
}
.name {
  color: ' + theme["Names"] + ';
}
.postertrip,
.trip {
  color: ' + theme["Tripcodes"] + ';
}
.nameBlock > .useremail > .postertrip,
.nameBlock > .useremail > .name {
  color: ' + theme["Emails"] + ';
}
.nameBlock > .useremail > .name,
.name {
  font-weight: 600;
}
a.forwardlink {
  border-bottom: 1px dashed;
}
.qphl {
  outline-color: ' + theme["Backlinked Reply Outline"] + ';
}
#qr::before {
  color: ' + (if theme["Dark Theme"] == "1" then "rgb(255,255,255)" else "rgb(0,0,0)") + ';
}
#qr input:' + agent + 'placeholder,
#qr textarea:' + agent + 'placeholder {
  color: ' + (if theme["Dark Theme"] == "1" then "rgba(255,255,255,0.5)" else "rgba(0,0,0,0.5)") + ';
}
.boxcontent dd,
#options ul {
  border-color: ' + (if theme["Dark Theme"] == "1" then "rgba(255,255,255,0.1)" else "rgba(0,0,0,0.1)") + ';
}
input[type=checkbox] {
  ' + agent + 'appearance: checkbox !important;
}
' + theme['Custom CSS']
    if theme['Dark Theme'] == '1'
      css += '
.prettyprint {
  background-color: rgba(255,255,255,.1);
  border: 1px solid rgba(0,0,0,0.5);
}
span.tag { color: #96562c; }
span.pun { color: #5b6f2a; }
span.com { color: #a34443; }
span.str, span.atv { color: #8ba446; }
span.kwd { color: #987d3e; }
span.typ, span.atn { color: #897399; }
span.lit { color: #558773; }
/* 4chan X options */
#navtopr .settingsWindowLink::after {
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAIVJREFUGNOFkVENwCAMRE8CUiYBCZOAM6Rg4CWTMAlIuH0AG9mS0f7Q67W9FmkyMoWstxGIEgljTJKIhCd59IQp9+voBHaMOUmdnqgYs41qcxLYKZhCJFCxbrZJvUfz2LCm1liappoiYUxu8AiHVw2cPIXf6sXsl/L6Vb7c++9qi5v//dgFtjLxtKnNCFwAAAAASUVORK5CYII=");
}
/* Delete buttons */
.deleteform::before {
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAeRJREFUOE9tlM0rRFEYh0dMPiKxkWxsyEpWshCpURbWNPkvlCwYe6VJWU+zkmytZIOttZJsaHZioQkhH8+j++p0M/U0Z8597+/83o8zhUajUcjRwu8OGIAJmIFZmIJh6IHW/Ht5kXYCxmAVzuABvuAbXuAS9mAOesFDfzVSoW42FuEYXrOXFcjzyd41rMFQiIWQThS5AAP/E8jv3RO3Bf3hSHumo5MQeWZ9CjfJ3mO2d8d3pMuysQxFHVlYaxLpKLIP07ACV/AE2zAJ63CbuVbwBAYVsjsWNqzrRJE26ART3jAYdG/8bnJwk3VJIVtsd0LIdHSiiM+LYIdcKzQOR5DWsuJD5yRyVswA09GJItEQRUbgIHETh9cMctjyHbEmphNOjGuF+eyQfGfrBjixDluI2R0La00iHUVcm+4SOJipWNWHjr0P0mLbHVOJdHQSNetjvQNv2TvvfJcV8u7sJSc4J7bY7lhYa2LNdKLIApwn8T4bjdy9O469riy8c2KL7Y7zZRq61okiujDWmduEruiIRfXuOPaRYgjEb8VMJ2rzwfoQ7GRL2lovoHfHTzoO/907nShiLX9HJL39FtYL6N1x7JuJuxAzJWtiOjr5m7P8/1FMsq0vQQVqUIcqlGEUukxHJ8EPyeEKDPe5ibUAAAAASUVORK5CYII=");
}
/* Return button */
div.navLinks a:first-of-type::after {
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAC1QTFRFAAAA5OHk5OHk5OHk5OHk5OHk5OHk5OHk5OHk5OHk5OHk5OHk5OHk5OHk5OHkJaAqNQAAAA50Uk5TABAgQFBgcICPn6+/3+9ACPafAAAASElEQVQI15XMyxKAIAxD0eCr1ZT8/+eKDCOw07O700mBT45rrDXEXgul3sn0yCwsAaGBv/cw86xc92fbl0v7z7mBzeeudhJ/3aoUA1Vr0uhDAAAAAElFTkSuQmCC");
}
/* Watcher */
#watcher::before {
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACpQTFRFAAAA0dLU0dLU0dLU0dLU0dLU0dLU0dLU0dLU0dLU0dLU0dLU0dLU0dLUmYS1qAAAAA10Uk5TABAgQFBggI+fv8/f74aeqbgAAABVSURBVAjXnY0xDsMwEMNo+5TYPen/3+2SpUCXlhvBgfAH2uecrcdWt5O4ewHIdVtTvmXB9BoRoIzy5DqsDIAszvXRlyfItS3kXRZA9StJ0l1f/z/xBlXVAtkqW+Q3AAAAAElFTkSuQmCC");
}
/* Announcement */
.globalMessage::before {
   content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAK5JREFUGNN1kF0RxCAMhCMBCZVQCUhAwkmohDhAAhKQEAPfDBKQUAm5B3qU3s3t425mfyJygUTBMIzMLivYaTiGoigNpxJu8aSxLeeRTiOICIGOXfQLH8aT5eD8GKE4cTo4UTDKND1uWYRGFpzXkrnKGROc9JDnKBQTjDyJjbr0b+RnteO3WpgbhYSN/QQabX1L/HqLzyA2DKdTUCodx/E7dHgoFaOgJMo4kP8gEt+mlap7ZbvCVgAAAABJRU5ErkJggg==");
}
/* Slideout nav */
#boardNavDesktopFoot::after {
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAC1QTFRFAAAAzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMdShx9gAAAA50Uk5TABAgMEBggI+fr7/P3+82uMT1AAAAb0lEQVQIHQXBiQHDIAwEMOE8gGlu/3ErgWt297wAYyenT7IGjJNVqJUzsPMAniyuLODedspMQe3cKq8+8HxZOK0b9eUb6NYHO98Dv/am3FkDKq/Ktm9gp1h5AE8mxsku1M4ZMGby618yB6De7n4L/v79BDw2df22AAAAAElFTkSuQmCC");
}
/* 4sight */
body > a[style="cursor: pointer; float: right;"]::after {
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADBQTFRFAAAAzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMIXMlggAAAA90Uk5TABAgMEBQYICPn6+/z9/vD6iGsgAAAFRJREFUCB0FwYcBwyAMADAZCCN2y//fRgIAAG0MAMSba/8eAO9EVAe0BOMAxgISMDaIBKgGewKMesS+C0A7mXPdCgCQtwIAou6/A0DUPQCgnw4A4APNOQHMJOa9jgAAAABJRU5ErkJggg==");
}
/* Expand */
#imgControls label:first-of-type::after {
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAALlJREFUKFOFkT0KwlAQhANWaUSb+AciVmLlSZLcVhttBH9QjyIIHiDOF2ZhOxeGebM7b3dfUnRdVwmN0Aq1UAqFGU2eekWSQ8RTh6HNMDqiwczNiJsnkR8Jx1RrSTKKDlE467wR9jY+XK9jN0bSKQwfGy/iqVcrMWespd82fsW7XP/XmZUmuXPsfHLHq3grHKzveef8NXjozKPH4mjAvf5rZPNLGtPAjI7ozUtfiD+1kp4LPLZxDV78APzYoty/jZXwAAAAAElFTkSuQmCC");
}
'
    else
      css += '
.prettyprint {
  background-color: #e7e7e7;
  border: 1px solid #dcdcdc;
}
span.com { color: #d00; }
span.str, span.atv { color: #7fa61b; }
span.pun { color: #61663a; }
span.tag { color: #117743; }
span.kwd { color: #5a6F9e; }
span.typ, span.atn { color: #9474bd; }
span.lit { color: #368c72; }
/* 4chan X options */
#navtopr .settingsWindowLink::after {
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAIVJREFUGNOFkVERwCAMQyMBKZOAhEng69lCChImYRKQkH0AG7fdjfaHpmmbFmkyMoWstxGIEgljTJKIhCd59IQp9+voBHaMOUmdnqgYs41qcxLYKZhCJFCxbrZJvUfz2LCm1liappoiYUxu8AiHVw2cPIXf6sXsl/L6Vb7c++9qi5v//dgFAGGyWuspVmQAAAAASUVORK5CYII=");
}
/* Delete buttons */
.deleteform::before {
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAH9JREFUGNONkFEZgCAMhIlABCIQgQhE8O2vQQMiEMEIi7AIRjACPqGC4ueetu/udrcZ869wBMI7ZFkREpmN+IRXlpOo+HGt3KZA6eFA6mYZ4dzlkNFbcWefW467XonGYMnU3qrFKwjCQqKi2PmD5JOARansw/0PQpkbeMpUfdUBLYs3tDb03tIAAAAASUVORK5CYII=");
}
/* Return button */
div.navLinks > a:first-of-type::after {
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGNJREFUGNNjYKAaiC2IXY9LyiH2fuz/2P3YpBRi9wOl/mORjhWIbYBKgeB7oEIIbIgVAEnfR5JEhf2Yuu8DeQ2x/UBTgCYh7J6PajdEC6rL9+ORBgsGgO3DJY2kMAHkegbaAgCK4libswvDKwAAAABJRU5ErkJggg==");
}
/* Watcher */
#watcher::before {
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAALhJREFUOE+tkl0RgzAQhJFQCUhBAhJ4yENnMIEDJFRKJVRCJSCh3HfsMQfTFzI87CS5n+zuJU0ppalFdSOE9zY/x3EwvAzvBM7D2d7ObMnO8BUWW38JnCPXxSXeLDYKesNsYI+CNuWIE/Oce1YBAZgfYjtIVBNKyENAfUvzhDcp4AIvOvtT3CVrFlMNMwQb8x/PTHb3lXwSD8mb55CnBBP9SGKeNvuYdn+YdvYnpmvvXPO/7/2eVxSsk6VHBDjH8sAAAAAASUVORK5CYII=");
}
/* Announcement */
.globalMessage::before {
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAK5JREFUGNN1kE0VxCAMhCMBCZVQCUhAwp6+cyXEARKQgIRIQAISKiF7oEvp7ts5zuTNT0QukCgYhpHZZQU7DcdQFKXhVMItnjS25TzSaQQRIdCxi37hw3iyHJwfIxQnTgcnCkaZpscti9DIgvNaMlc5Y4KTHvIchWKCkSexUZf+jfysdvxWC3OjkLCxn0CjrW+JX2/xGcSG4XQKSqXjOH6HDg+lYhSURBkH8h9E4htm9nkTaedRxgAAAABJRU5ErkJggg==");
}
/* Slideout nav */
#boardNavDesktopFoot::after {
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEVQTFRFAAAAZ2dnzczMZ2dnzczMZ2dntLOzZ2dnq6qqZ2dnZ2dnZ2dnkI+PZ2dnjIyMqKenZ2dnZ2dnZ2dndXR0e3t7Z2dndHR03/W/BgAAABV0Uk5TABAQICAwQGBggI+fn6+vr7/P3+/vEpdk4gAAAHlJREFUCB0FwYEBgjAQBLDUCghY/aLn/qOagOWoqmMBtJHMmsnZoM2cHf3MbBjZAFtOlpzA+jbSHelwf/1WPbua8PjkiVmqcP/ke0OVmnjl+4Cr7OnW3/MGPbue4b0CI50zG2DLgTYzOvrIbNCO5KorORqg71W1d/gDBFEGZ/GMsaMAAAAASUVORK5CYII=");
}
/* 4sight */
body > a[style="cursor: pointer; float: right;"]::after {
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAH9JREFUGNONkFEZgCAMhIlABCIQgQhE8O2vQQMiEMEIi7AIRjACPqGC4ueetu/udrcZ869wBMI7ZFkREpmN+IRXlpOo+HGt3KZA6eFA6mYZ4dzlkNFbcWefW467XonGYMnU3qrFKwjCQqKi2PmD5JOARansw/0PQpkbeMpUfdUBLYs3tDb03tIAAAAASUVORK5CYII=");
}
/* Expand */
#imgControls label:first-of-type::after {
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAMRJREFUKFNtks0OAUEQhOdM4iBx8XMSwb6En0dw89CciQMXvIIb9XW6pXfYpDKlu6rV9G4ppfSElbB2THTGA486GrQmfjteOnfJAKcWfbQ2IQp38WkyDMWvqY/WDEyJxkl8JoyFg4sfrjEDOflrpoUAU/CLD0CT72dB8lRiIp6niD+0NkS8lvBfJCYfPf9ZJ4v4RqovjXjh8cLUujSGWOuzyjzS71vq25a2qcB690JH6DrPL26DYSDkT2PpNeqNwFSApv8BTpBEE3rYF6oAAAAASUVORK5CYII=");
}
'
    switch Conf['Post Form Style']
      when 'fixed'
        mascotposition = '264'
        css += '
#qr {
  right: 2px !important;
  left: auto !important;
}
'
      when 'slideout'
        mascotposition = '0'
        css += '
#qr {
  right: -233px !important;
  left: auto !important;
  ' + agent + 'transition: right .3s ease-in-out 1s, left .3s ease-in-out 1s;
}
#qr:hover,
#qr.focus,
#qr.dump {
  right: 2px !important;
  left: auto !important;
  ' + agent + 'transition: right .3s linear, left .3s linear;
}
'
      when 'tabbed slideout'
        mascotposition = '0'
        css += '
#qr {
  right: -249px !important;
  left: auto !important;
  ' + agent + 'transition: right .3s ease-in-out 1s, left .3s ease-in-out 1s;
}
#qr:hover,
#qr.focus,
#qr.dump {
  right: 2px !important;
  left: auto !important;
  ' + agent + 'transition: right .3s linear, left .3s linear;
}
#qr::before {
  ' + agent + 'transform: rotate(-90deg);
  ' + agent + 'transform-origin: bottom right;
  margin-left: -212px;
  margin-right: 264px;
  margin-bottom: -20px;
  width: 210px;
  display: inline-block;
  font-size: 12px;
  opacity: 0.5;
  height: 18px;
  text-align: center;
  content: "Post Form";
  padding-top: 3px;
  vertical-align: middle;
  ' + agent + 'transition: opacity .3s ease-in-out 1s;
}
#qr:hover::before,
#qr.focus::before,
#qr.dump::before {
  opacity: 0;
  ' + agent + 'transition: opacity .3s linear;
}
'
      when 'transparent fade'
        mascotposition = '0'
        css += '
#qr {
  right: 2px !important;
  left: auto !important;
  opacity: 0.2;
  ' + agent + 'transition: opacity .3s ease-in-out 1s;
}
#qr:hover,
#qr.focus,
#qr.dump {
  opacity: 1;
  ' + agent + 'transition: opacity .3s linear;
}
'
    if Conf['Fit Width Replies']
      css += '
.summary {
  clear: both;
  padding-left: 20px;
  display: block;
}
.replyContainer {
  clear: both;
}
.sideArrows {
  z-index: 1;
  position: absolute;
  right: 0px;
  height: 10px;
}
.postInfo {
  margin: 1px 0 0;
  position: relative;
  width: 100%;
}
.sideArrows a, .sideArrows span {
  position: static;
  width: 20px;
  font-size: 9px;
  height: 10px;
}
.sideArrows {
  width: 20px;
  padding-top: 1px;
}
div.reply .report_button, .sideArrows, div.reply .postInfo input, div.reply .postInfo .rice, div.reply .menu_button {
  opacity: 0;
}
form .replyContainer:not(:hover) div.reply .report_button, form .replyContainer:not(:hover) div.reply .menu_button, form .replyContainer:not(:hover) .sideArrows, form .replyContainer:not(:hover) .postInfo input, .postInfo .rice {
  ' + agent + 'transition: opacity .3s ease-out 0s;
}
form .replyContainer:hover div.reply .report_button, form .replyContainer:hover div.reply .menu_button, form .replyContainer:hover .sideArrows, .replyContainer:hover .postInfo input, .replyContainer:hover .postInfo .rice {
  opacity: 1;
  ' + agent + 'transition: opacity .3s ease-in 0s;
}
 div.reply input:checked {
  opacity: 1;
}
form .postContainer blockquote {
  margin-left: 30px;
}
div.reply {
  padding-top: 6px;
  padding-left: 10px;
}
div.reply .postInfo input,
div.reply .postInfo .rice {
  position: absolute;
  top: -3px;
  right: 5px;
}
div.reply .report_button, div.reply .menu_button {
  position: absolute;
  right: 26px;
  top: -1px;
  font-size: 9px;
}
.sideArrows a {
  position: absolute;
  right: 36px;
  top: 7px;
}
.sideArrows a {
  font-size: 9px;
}
div.thread {
  padding: 0;
  position: relative;
}
div.post:not(#qp):not([hidden]) {
  margin: 0;
  width: 100%;
}
div.reply {
  display: table;
  clear: both;
}
div.sideArrows {
  float: none;
}
.hide_thread_button {
  position: relative;
  z-index: 2;
  margin-right: 10px;
  margin-left: 5px;
  font-size: 9px;
}
.opContainer input {
  opacity: 1;
}
#options.reply {
  display: inline-block;
}
'
    else
      css += '
.sideArrows a {
  font-size: 9px;
}
.sideArrows a {
  position: static;
}
div.reply {
  padding-right: 5px;
}
.sideArrows {
  margin-right: 5px;
  width: 20px;
  float: left;
}
.sideArrows a {
  width: 20px;
  font-size: 12px;
}
.hide_thread_button {
  position: relative;
  z-index: 2;
  margin-right: 5px;
}
div.reply {
  padding-top: 5px;
  padding-left: 2px;
  display: table;
}
div.thread {
  overflow: visible;
  padding: 0;
  position: relative;
}
div.post:not(#qp):not([hidden]) {
  margin: 0;
}
.thread > div > .post {
  overflow: visible;
}
.sideArrows span {
  font-size: 9px;
}
.sideArrows {
  width: 20px;
}
.sideArrows a {
  right: 27px;
 }
div.reply .report_button, div.reply .menu_button {
  right: 13px;
 }
div.reply {
  padding-top: 6px;
  padding-left: 8px;
}
.sideArrows {
  margin-right: 2px;
  width: 20px;
}
form .postContainer blockquote {
  margin-left: 30px;
}
'

    unless Conf['Hide Sidebar']
      switch Conf['Page Margin']
        when 'none'
          pagemargin = '2px'
        when 'small'
          pagemargin = '25px'
        when 'medium'
          pagemargin = '50px'
        when 'large'
          pagemargin = '150px'
        when 'fully centered'
          pagemargin = '252px'

      css += '
body {
  margin: 1px 252px 0 ' + pagemargin + ';
}
#boardNavDesktop,
.pages {
  left:  ' + pagemargin + ';
  right: 252px;
}
'
    else
      css += '
#boardNavDesktop,
.pages {
  left:  2px;
  right: 2px;
}
'

    if Conf['Compact Post Form Inputs']
      css += '
#qr textarea.field {
  height: 114px !important;
}
.textarea {
  height: 115px !important;
}
.field[name="name"],
.field[name="email"],
.field[name="sub"] {
  width: 75px !important;
  margin-left: 1px !important;
}
'
    else
      css += '
.field[name="email"],
.field[name="sub"] {
  width: 248px !important;
}
.field[name="name"] {
  width: 227px !important;
  margin-left: 1px !important;
}
.field[name="email"],
.field[name="sub"] {
  margin-top: 1px;
}
'

    if Conf['Expand Post Form Textarea']
      css += '
#qr textarea {
  display: block;
  ' + agent + 'transition: all 0.25s ease 0s, width .3s ease-in-out .3s;
  float: right;
}
#qr textarea:focus {
  width: 400px;
}
'

    if Conf['Filtered Backlinks']
      css += '
.filtered.backlink {
  display: none;
}
'

    if Conf['Rounded Edges']
      css += '
.rice {
  border-radius: 2px;
}
div.reply,
div.reply.highlight,
#options,
#watcher,
#qp,
td[style="border: 1px dashed;"],
div.reply > tr > div.reply,
.inline div.reply,
h2,
.deleteform,
#boardNavDesktopFoot,
.globalMessage {
  border-radius: 3px;
}
.pages b,
.pages input,
a,
.new {
  border-radius: 9px;
}
#postForm::after {
  border-radius: 6px 6px 0 0;
}
.qphl {
  ' + agent + 'outline-radius: 3px;
}
'

    if Conf['Slideout Watcher']
      css += '
#watcher {
  position: fixed;
  top: -1000px !important;
  right: 2px !important;
  left: auto !important;
  bottom: auto !important;
  width: 246px !important;
  padding-bottom: 4px;
}
#watcher:hover {
  z-index: 99 !important;
  top: 119px !important;
}
'
    else
      css += '
#watcher::before {
  display: none;
}
#watcher {
  right: 2px !important;
  left: auto !important;
  width: 246px;
  padding-bottom: 4px;
  z-index: 96;
}
'
    if Conf['Underline Links']
      css += '
#credits a,
.abbr a,
.backlink:not(.filtered),
.chanlinkify,
.file a,
.pages,
.pages a,
.quotejs,
.quotelink:not(.filtered),
.quotelink:not(.filtered),
.useremail,
a.deadlink,
a[href*="//dis"],
a[href*=res],
div.post > blockquote .chanlinkify.YTLT-link.YTLT-text,
div.postContainer span.postNum > .replylink {
	text-decoration: underline;
}
'

    switch Conf['Slideout Navigation']
      when 'compact'
        css += '
#boardNavDesktopFoot {
  height: 84px;
  padding-bottom: 0px;
  padding-top: 0px;
  word-spacing: 3px;
}
#navbotr {
  display: none;
}
'
      when 'list'
        css += '
#boardNavDesktopFoot a {
  z-index: 1;
  display: block;
}
#boardNavDesktopFoot {
  height: 300px;
  overflow-y: scroll;
  padding-bottom: 0px;
  padding-top: 0px;
  word-spacing: 0px;
}
#boardNavDesktopFoot a::after{
  content: " - " attr(title);
  font-size: 12px;
}
#boardNavDesktopFoot a[href*="//boards.4chan.org/"]::after,
#boardNavDesktopFoot a[href*="//rs.4chan.org/"]::after {
  content: "/ - " attr(title);
  font-size: 12px;
}
#boardNavDesktopFoot a[href*="//boards.4chan.org/"]::before,
#boardNavDesktopFoot a[href*="//rs.4chan.org/"]::before {
  content: "/";
  font-size: 12px;
}
#navbotr {
  display: none;
}
'
      when 'hide'
        css += '
#boardNavDesktopFoot::after, #boardNavDesktopFoot {
	display: none;
}
'

    switch Conf['Reply Spacing']
      when 'none'
        css += '
.replyContainer {
  margin-bottom: 0px;
}
#delform {
  margin-bottom: 12px;
}
'
      when 'small'
        css += '
.replyContainer {
  margin-bottom: 2px;
}
#delform {
  margin-bottom: 10px;
}
'
      when 'medium'
        css += '
.replyContainer {
  margin-bottom: 4px;
}
#delform {
  margin-bottom: 8px;
}
'
      when 'large'
        css += '
.replyContainer {
  margin-bottom: 6px;
}
#delform {
  margin-bottom: 6px;
}
'

    switch Conf['Sage Highlighting']
      when 'text'
        css += '
  a.useremail[href*="sage"]:last-of-type::after,
  a.useremail[href*="Sage"]:last-of-type::after,
  a.useremail[href*="SAGE"]:last-of-type::after {
    content: " (sage) ";
    color: ' + theme["Sage"] + ';
  }
'
      when 'image'
        css += '
  a.useremail[href*="sage"]:last-of-type::after,
  a.useremail[href*="Sage"]:last-of-type::after,
  a.useremail[href*="SAGE"]:last-of-type::after {
    content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAABa1BMVEUAAACqrKiCgYIAAAAAAAAAAACHmX5pgl5NUEx/hnx4hXRSUVMiIyKwrbFzn19SbkZ1d3OvtqtpaWhcX1ooMyRsd2aWkZddkEV8vWGcpZl+kHd7jHNdYFuRmI4bHRthaV5WhUFsfGZReUBFZjdJazpGVUBnamYfHB9TeUMzSSpHgS1cY1k1NDUyOC8yWiFywVBoh1lDSEAZHBpucW0ICQgUHhBjfFhCRUA+QTtEQUUBAQFyo1praWspKigWFRZHU0F6j3E9Oz5VWFN0j2hncWONk4sAAABASDxJWkJKTUgAAAAvNC0fJR0DAwMAAAA9QzoWGhQAAAA8YytvrFOJsnlqyT9oqExqtkdrsExpsUsqQx9rpVJDbzBBbi5utk9jiFRuk11iqUR64k5Wf0JIZTpadk5om1BkyjmF1GRNY0FheFdXpjVXhz86XSp2yFJwslR3w1NbxitbtDWW5nNnilhFXTtYqDRwp1dSijiJ7H99AAAAUnRSTlMAJTgNGQml71ypu3cPEN/RDh8HBbOwQN7wVg4CAQZ28vs9EDluXjo58Ge8xwMy0P3+rV8cT73sawEdTv63NAa3rQwo4cUdAl3hWQSWvS8qqYsjEDiCzAAAAIVJREFUeNpFx7GKAQAYAOD/A7GbZVAWZTBZFGQw6LyCF/MIkiTdcOmWSzYbJVE2u1KX0J1v+8QDv/EkyS0yXF/NgeEILiHfyc74mICTQltqYXBeAWU9HGxU09YqqEvAElGjyZYjPyLqitjzHSEiGkrsfMWr0VLe+oy/djGP//YwfbeP8bN3Or0bkqEVblAAAAAASUVORK5CYII=") "  ";
  }
'

    switch Conf['Announcements']
      when '4chan default'
        css += '
.globalMessage {
  position: static;
  background: none;
  border: none;
  margin-top: 0px;
}
.globalMessage::before {
  display: none;
}
.globalMessage:hover {
  top: 0px;
}
'
      when 'slideout'
        css += '
.globalMessage:hover {
  position: fixed;
  z-index: 99;
}
.globalMessage {
  width: 236px;
  background-color: ' + theme["Dialog Background"] + ';
  border: 1px solid ' + theme["Dialog Border"]  + ';
}
'
      when 'hide'
        css += '
.globalMessage {
  display: none;
}
.globalMessage::before {
  display: none;
}
'

    switch Conf['Boards Navigation']
      when 'sticky top'
        css += '
#boardNavDesktop {
  position: fixed;
  top: 0;
}
'
      when 'sticky bottom'
        css += '
#boardNavDesktop {
  position: fixed;
  bottom: 0;
}
'
      when 'top'
        css += '
#boardNavDesktop {
  position: absolute;
  top: 0;
}
'
      when 'hide'
        css += '
#boardNavDesktop {
  position: absolute;
  top: -100px;
}
'

    switch Conf['Pagination']
      when 'sticky top'
        css += '
.pages {
  position: fixed;
  top: 0;
}
'
      when 'sticky bottom'
        css += '
.pages {
  position: fixed;
  bottom: 0;
}
'
      when 'top'
        css += '
.pages {
  position: absolute;
  top: 0;
}
'
      when 'on side'
       css += '
.pages {
  padding: 0;
  visibility: hidden;
  top: auto;
  bottom: 175px;
  width: 290px;
  left: auto;
  right: 251px;
  position: fixed;
  ' + agent + 'transform: rotate(90deg);
  ' + agent + 'transform-origin: bottom right;
  letter-spacing: -1px;
  word-spacing: -6px;
  z-index: 6;
  margin: 0;
  height: 15px;
}
.pages a, .pages strong, .pages input {
  visibility: visible;
  min-width: 0;
}
'
      when 'hide'
        css += '
.pages {
  display: none;
}
'
    switch Conf["Checkboxes"]
      when "show", "hide checkboxes"
        css += '
#delform input[type=checkbox] {
  display: none;
}
'
      when "make checkboxes circular"
        css += '
#delform input[type=checkbox] {
  display: none;
}
.rice {
  border-radius: 6px;
}
'

    if Conf["Mascots"]
      mascotimages = []
      for category, mascots of Mascots
        for name, mascot of mascots
          if enabledmascots[name] == true
            mascotimages.push mascot
      css += '
body::after {
  position: fixed;
  bottom: ' + mascotposition + 'px;
  right: 0;
  left: auto;
  ' + agent + 'transform: scaleX(1);
  content: ' + mascotimages[Math.floor(Math.random() * mascotimages.length)] + '
}
'


    switch Conf['Emoji Position']
      when 'left'
        css += Style.emoji('before', 'left')
      when 'right'
        css += Style.emoji('after', 'right')

    return css