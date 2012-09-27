  css: (theme) ->
    agent = Style.agent()
    css = """
/* dialog styling */
.dialog.reply {
  display: block;
  border: 1px solid rgba(0,0,0,.25);
  padding: 0;
}
.move {
  cursor: move;
}
label,
.favicon {
  cursor: pointer;
}
a[href="javascript:;"] {
  text-decoration: none;
}
.warning,
.disabledwarning {
  color: red;
}
.hide_thread_button:not(.hidden_thread) {
  float: left;
}
.thread > .hidden_thread ~ *,
[hidden],
#content > [name=tab]:not(:checked) + div,
#updater:not(:hover) > :not(.move),
.autohide:not(:hover) > form,
#qp input,
.forwarded,
#qp .rice {
  display: none !important;
}
.menu_button {
  display: inline-block;
}
.menu_button > span {
  border-top:   .5em solid;
  border-right: .3em solid transparent;
  border-left:  .3em solid transparent;
  display: inline-block;
  margin: 2px;
  vertical-align: middle;
}
#menu {
  position: absolute;
  outline: none;
}
.entry {
  border-bottom: 1px solid rgba(0,0,0,.25);
  cursor: pointer;
  display: block;
  outline: none;
  padding: 3px 7px;
  position: relative;
  text-decoration: none;
  white-space: nowrap;
}
.entry:last-child {
  border: none;
}
.focused.entry {
  background: rgba(255,255,255,.33);
}
.entry.hasSubMenu {
  padding-right: 1.5em;
}
.hasSubMenu::after {
  content: "";
  border-left: .5em solid;
  border-top: .3em solid transparent;
  border-bottom: .3em solid transparent;
  display: inline-block;
  margin: .3em;
  position: absolute;
  right: 3px;
}
.hasSubMenu:not(.focused) > .subMenu {
  display: none;
}
.subMenu {
  position: absolute;
  left: 100%;
  top: 0;
  margin-top: -1px;
}
h1,
.boardBanner {
  text-align: center;
}
#qr > .move {
  min-width: 300px;
  overflow: hidden;
  box-sizing: border-box;
  """ + agent + """box-sizing: border-box;
  padding: 0 2px;
}
#qr > .move > span {
  float: right;
}
#autohide,
.close,
#qr select,
#dump,
.remove,
.captchaimg,
#qr div.warning {
  cursor: pointer;
}
#qr select,
#qr > form {
  margin: 0;
}
#dump {
  background: """ + agent + """linear-gradient(#EEE, #CCC);
  width: 10%;
}
.gecko #dump {
  padding: 1px 0 2px;
}
#dump:hover,
#dump:focus {
  background: """ + agent + """linear-gradient(#FFF, #DDD);
}
#dump:active,
.dump #dump:not(:hover):not(:focus) {
  background: """ + agent + """linear-gradient(#CCC, #DDD);
}
#qr:not(.dump) #replies,
.dump > form > label {
  display: none;
}
#replies {
  display: block;
  height: 100px;
  position: relative;
  """ + agent + """user-select: none;
  user-select: none;
}
#replies > div {
  counter-reset: thumbnails;
  top: 0; right: 0; bottom: 0; left: 0;
  margin: 0; padding: 0;
  overflow: hidden;
  position: absolute;
  white-space: pre;
}
#replies > div:hover {
  bottom: -10px;
  overflow-x: auto;
  z-index: 1;
}
.thumbnail {
  background-color: rgba(0,0,0,.2) !important;
  background-position: 50% 20% !important;
  background-size: cover !important;
  border: 1px solid #666;
  box-sizing: border-box;
  """ + agent + """box-sizing: border-box;
  cursor: move;
  display: inline-block;
  height: 90px; width: 90px;
  margin: 5px; padding: 2px;
  opacity: .5;
  outline: none;
  overflow: hidden;
  position: relative;
  text-shadow: 0 1px 1px #000;
  """ + agent + """transition: opacity .25s ease-in-out;
  vertical-align: top;
}
.thumbnail:hover,
.thumbnail:focus {
  opacity: .9;
}
.thumbnail#selected {
  opacity: 1;
}
.thumbnail::before {
  counter-increment: thumbnails;
  content: counter(thumbnails);
  color: #FFF;
  font-weight: 700;
  padding: 3px;
  position: absolute;
  top: 0;
  right: 0;
  text-shadow: 0 0 3px #000, 0 0 8px #000;
}
.thumbnail.drag {
  box-shadow: 0 0 10px rgba(0,0,0,.5);
}
.thumbnail.over {
  border-color: #FFF;
}
.thumbnail > span {
  color: #FFF;
}
.remove {
  background: none;
  color: #E00;
  font-weight: 700;
  padding: 3px;
}
.remove:hover::after {
  content: " Remove";
}
.thumbnail > label {
  background: rgba(0,0,0,.5);
  color: #FFF;
  right: 0; bottom: 0; left: 0;
  position: absolute;
  text-align: center;
}
.thumbnail > label > input {
  margin: 0;
}
#addReply {
  color: #333;
  font-size: 3.5em;
  line-height: 100px;
}
#addReply:hover,
#addReply:focus {
  color: #000;
}
.field {
  border: 1px solid #CCC;
  box-sizing: border-box;
  """ + agent + """box-sizing: border-box;
  color: #333;
  font: 13px sans-serif;
  margin: 0;
  padding: 2px 4px 3px;
  """ + agent + """transition: color .25s, border .25s;
}
.field:-moz-placeholder,
.field:hover:-moz-placeholder {
  color: #AAA;
}
.field:hover,
.field:focus {
  border-color: #999;
  color: #000;
  outline: none;
}
#qr > form > div:first-child > .field:not(#dump) {
  width: 30%;
}
#qr textarea.field {
  display: -webkit-box;
  min-height: 160px;
  min-width: 100%;
}
#qr.captcha textarea.field {
  min-height: 120px;
}
#charCount {
  color: #000;
  background: hsla(0, 0%, 100%, .5);
  position: absolute;
  margin: 1px;
  font-size: 8pt;
  right: 0;
  top: 100%;
  bottom: 0;
  pointer-events: none;
}
#charCount.warning {
  color: red;
}
.captchainput > .field {
  min-width: 100%;
}
.captchaimg {
  text-align: center;
}
.captchaimg > img {
  display: block;
  height: 57px;
  width: 300px;
}
#qr [type=file] {
  margin: 1px 0;
  width: 70%;
}
#qr [type=submit] {
  margin: 1px 0;
  padding: 1px; /* not Gecko */
  width: 30%;
}
.gecko #qr [type=submit] {
  padding: 0 1px; /* Gecko does not respect box-sizing: border-box */
}
.fileText:hover .fntrunc,
.fileText:not(:hover) .fnfull {
  display: none;
}
.fitwidth img[data-md5] + img {
  max-width: 100%;
}
.gecko  .fitwidth img[data-md5] + img,
.presto .fitwidth img[data-md5] + img {
  width: 100%;
}
#qr,
#qp,
#updater,
#stats,
#ihover,
#overlay,
#navlinks {
  position: fixed;
}
#ihover {
  max-height: 97%;
  max-width: 75%;
  padding-bottom: 18px;
}
#navlinks {
  font-size: 16px;
  top: 25px;
  right: 5px;
}
#overlay {
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.5);
  z-index: 1;
}
#options {
  z-index: 2;
  position: fixed;
  display: inline-block;
  padding: 5px;
  text-align: left;
  vertical-align: middle;
  left: 5%;
  right: 5%;
  top: 10%;
  bottom: 10%;
}
#options #style_tab + div select {
  width: 100%;
}
#theme_tab + div > div > div:not(.selectedtheme) h1 {
  color: transparent !important;
}
#theme_tab + div > div > div.selectedtheme h1 {
  right: 11px;
}
#theme_tab + div > div h1 {
  position: absolute;
  right: 300px;
  bottom: 10px;
  margin: 0;
  """ + agent + """transition: all .2s ease-in-out;
}
#theme_tab + div > div {
  margin-bottom: 3px;
}
#credits {
  float: right;
}
#options ul {
  padding: 0;
}
#options ul li {
  overflow: auto;
  padding: 0 5px 0 7px;
}
#options .optionlabel {
  text-decoration: underline;
}
#options input:checked + .optionlabel,
#options input:checked + .rice + .optionlabel {
  font-weight: 800;
}
#options input,
#options .rice {
  float: right;
  clear: left;
}
#options #rice_tab + div input {
  float: none;
  clear: none;
  margin: 1px;
}
#options article li {
  margin: 10px 0 10px 2em;
}
#options code {
  background: hsla(0, 0%, 100%, .5);
  color: #000;
  padding: 0 1px;
}
#options label {
  text-decoration: underline;
}
#options .styleoption label {
  text-decoration: none;
}
#options .option {
  width: 50%;
  display: inline-block;
}
#options .styleoption {
  padding: 1px 5px 1px 7px;
}
#options .mascots {
  text-align: center;
  padding: 0;
}
#options .mascot {
  display: inline;
  padding: 0;
  position: relative;
}
#options .mascot > div:first-child {
  border: 2px solid rgba(0,0,0,0);
  width: 200px;
  height: 250px;
  display: inline-block;
  margin: 5px;
  cursor: pointer;
  background-position: top center;
  background-repeat: no-repeat;
  background-size: 200px auto;
  text-align: center;
}
#options .mascot div.enabled {
  border: 2px solid rgba(0,0,0,0.5);
  background-color: rgba(255,255,255,0.1);
}
#mascotConf {
  position: fixed;
  height: 400px;
  bottom: 0;
  left: 50%;
  width: 500px;
  margin-left: -250px;
  overflow: auto;
}
#mascotConf input,
#mascotConf input:""" + agent + """placeholder {
  text-align: center;
}
#mascotConf h2 {
  margin: 10px 0 0;
  font-size: 14px;
}
#content {
  overflow: auto;
  position: absolute;
  top: 2.5em;
  right: 5px;
  bottom: 5px;
  left: 5px;
}
.suboptions,
#mascotcontent,
#themecontent {
  overflow: auto;
  position: absolute;
  right: 0;
  bottom: 1.5em;
  left: 0;
}
#mascotcontent,
.suboptions {
  top: 0;
}
#themecontent {
  top: 1.5em;
}
#mascotcontent {
  text-align: center;
}
#save,
.stylesettings {
  position: absolute;
  right: 10px;
  bottom: 0;
}
#addthemes {
  position: absolute;
  left: 10px;
  bottom: 0;
}
.mascotname,
.mascotoptions {
  margin: 5px;
  border-radius: 10px;
  padding: 1px 5px;
}
.mascotmetadata {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
}
#close,
#mascots_batch {
  position: absolute;
  left: 10px;
  bottom: 0;
}
#content textarea {
  font-family: monospace;
  min-height: 350px;
  resize: vertical;
  width: 100%;
}
#updater {
  text-align: right;
}
#updater:not(:hover) {
  border: none;
  background: transparent;
}
#updater input[type=number] {
  width: 4em;
}
.new {
  background: lime;
}
#watcher {
  padding-bottom: 5px;
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
}
#watcher:not(:hover) {
  max-height: 220px;
}
#watcher > div {
  max-width: 200px;
  overflow: hidden;
  padding-left: 5px;
  padding-right: 5px;
  text-overflow: ellipsis;
}
#watcher > .move {
  padding-top: 5px;
  text-decoration: underline;
}
#qp {
  padding: 2px 2px 5px;
}
#qp .post {
  border: none;
  margin: 0;
  padding: 0;
}
#qp img {
  max-height: 300px;
  max-width: 500px;
}
.qphl {
  outline: 2px solid rgba(216,94,49,.7);
}
.quotelink.deadlink {
  text-decoration: underline !important;
}
.deadlink:not(.quotelink) {
  text-decoration: none !important;
}
.image_expanded {
  clear: both !important;
}
.inlined {
  opacity: .5;
}
.inline {
  background-color: rgba(255,255,255,0.15);
  border: 1px solid rgba(128,128,128,0.5);
  display: table;
  margin: 2px;
  padding: 2px;
}
.inline .post {
  background: none;
  border: none;
  margin: 0;
  padding: 0;
}
div.opContainer {
  display: block !important;
}
.opContainer.filter_highlight {
  box-shadow: inset 5px 0 rgba(255,0,0,.5);
}
.opContainer.filter_highlight.qphl {
  box-shadow:
    inset 5px 0 rgba(255,0,0,.5),
    0 0 0 2px rgba(216,94,49,.7);
}
.filter_highlight > .reply {
  box-shadow: -5px 0 rgba(255,0,0,0.5);
}
.filter_highlight > .reply.qphl {
  box-shadow:
    -5px 0 rgba(255,0,0,.5),
    0 0 0 2px rgba(216,94,49,.7)
}
.filtered,
.quotelink.filtered {
  text-decoration: underline;
  text-decoration: line-through !important;
}
.quotelink.forwardlink,
.backlink.forwardlink {
  text-decoration: none;
  border-bottom: 1px dashed;
}
.threadContainer {
  margin-left: 20px;
  border-left: 1px solid black;
}
.stub ~ * {
  display: none !important;
}
"""
    if (Conf["Quick Reply"] and Conf["Hide Original Post Form"]) or Conf["Style"]
      css += """#postForm {
  display: none;
}"""

    if Conf["Recursive Filtering"]
      css += """.hidden + .threadContainer {
  display: none;
}"""

    if Conf["Style"]
      $.ready ->
        Style.rice d.body

      Conf["styleenabled"] = "1"

      @remStyle()

      if Conf["Sidebar"] == "large"
        sidebarOffsetW = 51
        sidebarOffsetH = 17
      else
        sidebarOffsetW = 0
        sidebarOffsetH = 0
        
      if Conf["Sidebar Location"] == "left"
        sidebarLocation = ["left",  "right"]
      else
        sidebarLocation = ["right", "left" ]

      css += """
::""" + agent + """selection {
  background: """ + theme["Text"] + """;
  color: """ + theme["Background Color"] + """;
}
body {
  padding: 16px 0 16px;
}
body > script + hr + div {
  display: none;
}
@media only screen and (max-width: 1100px) {
  body {
    padding-top: 32px;
  }
}
@media only screen and (max-width:689px) {
  body {
    padding-top: 47px;
  }
}
@media only screen and (max-width:553px) {
  body {
    padding-top: 62px;
  }
}
html,
body {
  min-height: 100%;
}
html,
body,
input,
select,
textarea,
.boardTitle {
  font-family: '""" + Conf["Font"] + """';
}
#qr img,
.captcha img {
  opacity: """ + Conf["Captcha Opacity"] + """;
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
.summary,
a,
big,
blockquote,
div.post > blockquote .chanlinkify.YTLT-link.YTLT-text,
div.reply,
fieldset,
textarea,
time + span {
  font-size: """ + Conf["Font Size"] + """;
}
.globalMessage b {
  font-weight: 100;
}
/* Cleanup */
#absbot,
#autohide,
#ft li.fill,
#imgControls label:first-of-type input,
#imgControls .rice,
#logo,
#postPassword + span,
.autoPagerS,
.board > hr:last-of-type,
.closed,
.deleteform,
.entry:not(.focused) > .subMenu,
.error:empty,
.hidden_thread > .summary,
.inline .report_button,
.inline input,
.mobile,
.navLinksBot,
.next,
.postInfo input,
.postInfo .rice,
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
body > .postingMode ~ #delform hr,
body > br,
body > hr,
div.reply[hidden],
html body > span[style="left: 5px; position: absolute;"]:nth-of-type(0),
table[style="text-align:center;width:100%;height:300px;"] {
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
#navtopright a[href="javascript:;"],
#postcount,
#stats,
#timer,
#updater,
.pages a,
.pages strong,
body:not([class]) a[href="javascript:;"],
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
#mascotConf,
#options.reply.dialog,
#themeConf {
  z-index: 999 !important;
}
#qp {
  z-index: 102 !important;
}
#autoPagerBorderPaging,
#boardNavDesktop,
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
  z-index: """ + (if Conf["Images Overlap Post Form"] then "100" else "1") + """ !important;
}

div.navLinks > a:first-of-type::after {
  z-index: 99 !important;
}
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
#boardNavDesktopFoot::after,
#navtopright,
.qrMessage,
#navtopright .settingsWindowLink::after {
  z-index: 6 !important;
}
#stats,
#watcher,
#watcher::before,
.boardTitle,
.menu_button,
.sideArrows {
  z-index: 4 !important;
}
.boardBanner,
.globalMessage::before,
.replyhider a {
  z-index: 1 !important;
}
div.reply,
div.reply.highlight {
  z-index: 0 !important;
  """ + agent + """box-sizing: border-box;
  box-sizing: border-box;
}
/* ICON POSITIONS */
/* 4sight */
body > a[style="cursor: pointer; float: right;"]::after {
  font-size: 12px;
  position: fixed;
  """ + (if sidebarLocation[0] == "left" then "left: " + (231 + sidebarOffsetW) + "px" else "right: 2px") + """;
  opacity: 0.4;
  visibility: visible;
}
body > a[style="cursor: pointer; float: right;"]:hover::after {
  opacity: 1;
}
/* 4chan X Options / 4chan Options */
#navtopright .settingsWindowLink::after {
  visibility: visible;
  position: fixed;
  """ + (if sidebarLocation[0] == "left" then "left: " + (212 + sidebarOffsetW) + "px" else "right: 21px") + """;
  opacity: 0.4;
}
#navtopright .settingsWindowLink:hover::after {
  opacity: 1;
}
/* Slideout Navigation */
#boardNavDesktopFoot::after {
  border: none;
  position: fixed;
  """ + (if sidebarLocation[0] == "left" then "left: " + (193 + sidebarOffsetW) + "px" else "right: 40px") + """;
  opacity: 0.4;
}
#boardNavDesktopFoot:hover::after {
  opacity: 1;
}
/* Watcher */
#watcher::before {
  font-size: 12px;
  position: fixed;
  """ + (if sidebarLocation[0] == "left" then "left: " + (175 + sidebarOffsetW) + "px" else "right: 59px") + """;
  opacity: 0.4;
}
#watcher:hover::before {
  opacity: 1;
  cursor: pointer;
}
/* Global Message */
.globalMessage::before {
  position: fixed;
""" + (if sidebarLocation[0] == "left" then "left: " + (155 + sidebarOffsetW) + "px" else "right: 78px") + """;
  opacity: 0.4;
}
/* Back */
div.navLinks > a:first-of-type::after {
  visibility: visible;
  position: fixed;
  cursor: pointer;
  """ + agent + """transform: scale(.8);
  """ + (if sidebarLocation[0] == "left" then "left: 2px" else "right: " + (228 + sidebarOffsetW) + "px") + """;
  opacity: 0.4;
}
.globalMessage:hover::before {
  opacity: 1;
}
div.navLinks > a:first-of-type:hover::after {
  opacity: 1;
}
/* Expand Images */
#imgControls label:first-of-type::after {
  opacity: 0.4;
  display: inline-block;
  margin-top: 4px;
}
#imgControls label:hover:first-of-type::after {
  opacity: 1;
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
  """ + sidebarLocation[0] + """: 2px;
  bottom: 250px;
  font-size: 11px;
  font-weight: 100;
  background: none;
  border: none;
  width: """ + (248 + sidebarOffsetW) + """px;
}
.boardTitle {
  font-size: 30px;
  font-weight: 400;
}
.boardSubtitle {
  font-size: 13px;
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
""" + (if Conf["Custom Navigation"] then "" else "#boardNavDesktop,") + """
.pages /* Bottom Navigation */ {
  text-align: center;
  font-size: 0;
  color: transparent;
  width: auto;
}
#boardNavDesktop{
  text-align: center;
  width: auto;
  padding-right: 0px;
  margin-right: 0px;
  padding-top: 1px;
  padding-bottom: 3px;
}
#boardNavDesktopFoot {
  visibility: visible;
  position: fixed;
  """ + sidebarLocation[0] + """: 2px;
  bottom: auto;
  color: transparent;
  font-size: 0;
  border-width: 1px;
  text-align: center;
  height: 0;
  width: """ + (248 + sidebarOffsetW) + """px !important;
  overflow: hidden;
  """ + agent + """transition: height .5s linear, border 0s ease-in-out .5s;
  """ + agent + """box-sizing: border-box;
  box-sizing: border-box;
}
.center {
  text-align: center;
  clear: both;
}
img.topad,
img.middlead,
img.bottomad {
  opacity: 0.3;
  """ + agent + """transition: opacity .3s ease-in-out .3s;
}
img.topad:hover,
img.middlead:hover,
img.bottomad:hover {
  opacity: 1;
  """ + agent + """transition: opacity .3s linear;
}
.fileThumb {
  position: relative;
}
""" + (unless Conf["Custom Navigation"] then "#boardNavDesktop a,") + """
.pages a,
.pages strong {
  display: inline-block;
  font-size: 12px;
  border: none;
  text-align: center;
  margin: 0 1px 0 2px;
}
.pages {
  word-spacing: 10px;
}
/* moots announcements */
.globalMessage {
  font-size: 12px;
  text-align: center;
  font-weight: 200;
}
.pages strong,
a,
.new {
  """ + agent + """transition: background-color .1s linear;
}
/* Post Form */
/* Override OS-specific UI */
#ft li,
#ft ul,
#options input:not([type="radio"]),
#updater input:not([type="radio"]),
.box-outer,
.boxbar,
.top-box,
h2,
input:not([type="radio"]),
input[type="submit"],
textarea {
  """ + agent + """appearance: none;
}
input[type=checkbox] {
  """ + agent + """appearance: checkbox !important;
}
/* Formatting for all postarea elements */
#browse,
#file,
#threadselect select,
input,
input.field,
input[type="submit"] {
  padding: 1px !important;
  height: 20px !important;
}
textarea {
  padding: 1px !important;
}
#browse,
#file,
#qr input[type="submit"],
#qr textarea,
#qr .field {
  margin: 1px 0 0;
  vertical-align: bottom;
}
/* Width and height of all postarea elements (excluding some captcha elements) */
textarea.field,
#qr .field[type="password"],
.ys_playerContainer audio,
#qr input[title="Verification"],
#qr > form > div {
  width: """ + (248 + sidebarOffsetW) + """px;
}
/* Buttons */
#browse,
input[type="submit"], /* Any lingering buttons */
input[value="Report"] {
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
  position: absolute;
  opacity: 0;
  z-index: -1;
}
#file {
  width: """ + (177 + sidebarOffsetW) + """px;
}
#browse {
  text-align: center;
  width: 70px;
  margin: 1px 1px 0 0;
}
#browse,
#file,
#threadselect select {
  cursor: pointer;
  """ + agent + """box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
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
.top-box .menubutton,
.boardTitle {
  background-image: none;
}
.rice {
  vertical-align: middle;
}
#qr label input,
.boxcontent input,
.boxcontent textarea {
  """ + agent + """appearance: none;
  border: 0;
}
input[type=checkbox],
.reply input[type=checkbox],
#options input[type=checkbox] {
  """ + agent + """appearance: none;
  width: 12px !important;
  height: 12px !important;
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
  background-color: rgb(0,0,0);
  text-shadow: none !important;
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
.menubutton a,
.pages td,
td[style="padding-left: 7px;"],
div[id^="qr"] tr[height="73"]:nth-of-type(2) {
  padding: 0;
}
#navtopright {
  visibility: hidden;
  position: fixed;
  bottom: -100px;
  left: -100px;
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
  """ + (if sidebarLocation[0] == "left" then "left: 4px" else "right: " + (232 + sidebarOffsetW) + "px") + """;
  top: 0px;
  bottom: auto;
}
#imageType {
  position: fixed;
  """ + (if sidebarLocation[0] == "left" then "left: 22px" else "right: " + (140 + sidebarOffsetW) + "px") + """;
  top: 1px;
  bottom: auto;
}
#imgControls select {
  float: right;
}
#imgControls select > option {
  font-size: 80%;
}
/* End of Expand Images div */
/* Reply Previews */
#qp div.post /* 4chan x Quote Preview */ {
  max-width: 70%;
  visibility: visible;
}
#qp div.op {
  display: table;
}
#qp div.post {
  padding: 2px 6px;
}
#qp div.post img {
  max-width: 300px;
  height: auto;
}
div.navLinks {
  visibility: hidden;
  height: 0;
  width: 0;
  overflow: hidden;
}
/* AutoPager */
#autoPagerBorderPaging {
  position: fixed !important;
  right: 300px !important;
  bottom: 0px;
}
/* Appchan x options */
#options ul {
  margin: 0;
  margin-bottom: 6px;
  padding: 3px;
}
#stats,
#navlinks {
  left: auto !important;
  bottom: auto !important;
  text-align: right;
  padding: 0;
  border: 0;
  border-radius: 0;
}
#stats {
  """ + (if sidebarLocation[0] == "left" then "left: 26px" else "right: 97px") + """ !important;
  """ + sidebarLocation[1] + """: auto !important;
  width: """ + (122 + sidebarOffsetW) + """px !important;
  font-size: 12px;
  position: fixed;
  cursor: default;
}
#navlinks {
  top: 0 !important;
  """ + (if sidebarLocation[0] == "left" then "left: " + (175 + sidebarOffsetW) + "px" else "right: 64px") + """ !important;
  """ + sidebarLocation[1] + """: auto !important;
}
#updater {
  """ + (if sidebarLocation[0] == "left" then "left: " + (186 + sidebarOffsetW) + "px" else "right: 4px") + """ !important;
  top: """ + (if Conf["Updater Position"] == "top" then "0" else "auto") + """ !important;
  bottom: """ + (if Conf["Updater Position"] == "bottom" then "2px" else "auto") + """ !important;
  """ + sidebarLocation[1] + """: auto !important;
  width: 58px !important;
  border: 0;
  font-size: 12px;
  overflow: hidden;
  padding-bottom: 2px;
}
#updater {
  background: none;
  """ + (if sidebarLocation[0] == "left" then "left: " + (244 + sidebarOffsetW) + "px" else "right: 4px") + """;
}
#count.new {
  background-color: transparent;
}
#updater:hover {
  width: 150px !important;
}
#watcher {
  padding: 1px 0;
  border-radius: 0;
}
#options .move,
#updater .move,
#watcher .move,
#stats .move {
  cursor: default !important;
}
/* 4sight */
body > a[style="cursor: pointer; float: right;"] {
  visibility: hidden;
  width: 0;
  height: 0;
  overflow: hidden;
}
body > a[style="cursor: pointer; float: right;"] ~ div[style^="width: 100%;"] {
  display: block;
  position: fixed;
  top: 17px;
  bottom: 17px;
  """ + sidebarLocation[1] + """: 4px;
  """ + sidebarLocation[0] + """: """ + (252 + sidebarOffsetW) + """px;
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
[alt="sticky"] + a::before {
  content: "Sticky | ";
}
[alt="closed"] + a::before {
  content: "Closed | ";
}
[alt="closed"] + a {
  text-decoration: line-through;
}
/* Youtube Link Title */
.chanlinkify.YTLT-link.YTLT-text {
  font-family: monospace;
  font-size: 11px;
}
.fileText+br+a[target="_blank"]:hover {
  background: none;
}
.inline,
#qp {
  background-color: transparent;
  border: none;
}
input[type="submit"]:hover {
  cursor: pointer;
}
/* 4chan Sounds */
.ys_playerContainer.reply {
  position: fixed;
  bottom: 252px;
  margin: 0;
  """ + sidebarLocation[0] + """: 3px;
  padding-right: 0;
  padding-left: 0;
  padding-top: 0;
}
#qr input:focus:""" + agent + """placeholder,
#qr textarea:focus:""" + agent + """placeholder {
  color: transparent;
}
img[md5] {
  image-rendering: optimizeSpeed;
}
input,
textarea {
  text-rendering: geometricPrecision;
}
#boardNavDesktop .current {
  font-weight: bold;
  font-size: 13px;
}
#postPassword {
  position: relative;
  bottom: 3px;
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
a.forwardlink {
  border: none;
}
.exif td {
  color: #999;
}
.callToAction.callToAction-big {
  font-size: 18px;
  color: rgb(255,255,255);
}
body > table[cellpadding="30"] h1,
body > table[cellpadding="30"] h3 {
  position: static;
}
.focused.entry {
  background-color: transparent;
}
#menu.reply.dialog,
html .subMenu {
  padding: 0px;
}
#qr #charCount {
  background: none;
  position: absolute;
  right: 2px;
  top: auto;
  bottom: 110px;
  color: """ + (if theme["Dark Theme"] == "1" then "rgba(255,255,255,0.7)" else "rgba(0,0,0,0.7)") + """;
  font-size: 10px;
  height: 20px;
  text-align: right;
  vertical-align: middle;
  padding-top: 2px;
}
#qr #charCount.warning {
  color: rgb(255,0,0);
  position: absolute;
  top: auto;
  right: 2px;
  bottom: 110px;
  height: 20px;
  max-height: 20px;
  border: none;
  background: none;
}
textarea.field {
  resize: none;
}
/* Position and Dimensions of the #qr */
#qr {
  overflow: visible;
  position: fixed;
  top: auto !important;
  bottom: 2px !important;
  width: """ + (248 + sidebarOffsetW) + """px;
  margin: 0;
  padding: 0;
  z-index: 5 !important;
  background-color: transparent !important;
}
/* Width and height of all #qr elements (excluding some captcha elements) */
#qr.captcha textarea,
#qr textarea {
  min-height: 0 !important;
}
body > .postingMode ~ #delform .reply a > img[src^="//images"] {
  position: relative;
  z-index: 96;
}
#qr img {
  height: 47px;
  width: """ + (248 + sidebarOffsetW) + """px;
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
#dump:hover {
  background: none;
}
#threadselect {
  position: absolute;
  top: -20px;
  right: 0;
  font-size: 12px;
  text-align: right;
}
.dump > form > label {
  display: block;
  visibility: hidden;
}
#spoilerLabel {
  position: absolute;
  bottom: 0;
  right: 2px;
}
#qr .warning {
  position: absolute;
  bottom: -20px;
  right: 0;
  height: 19px;
  text-align: right;
  vertical-align: middle;
  text-align: center;
  box-sizing: border-box;
  """ + agent + """box-sizing: border-box;
}
input[title="Verification"],
.captchaimg img {
  margin-top: 1px;
}
#qr textarea.field,
#qr div {
  min-width: 0;
}
html body span[style="left: 5px; position: absolute;"] a {
  height: 14px;
  padding-top: 3px;
  width: 56px;
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
.prettyprint {
  white-space: pre-wrap;
  border-radius: 2px;
  font-size: 11px;
}
#themeConf {
  position: fixed;
  """ + sidebarLocation[1] + """: 2px;
  """ + sidebarLocation[0] + """: auto;
  top: 0;
  bottom: 0;
  width: 248px;
}
#themebar input {
  width: 30%;
}
body {
  background: """ + theme["Background Color"] + """;
  background-image: """ + theme["Background Image"] + """;
  background-repeat: """ + theme["Background Repeat"] + """;
  background-attachment: """ + theme["Background Attachment"] + """;
  background-position: """ + theme["Background Position"] + """;
}
#content,
#themecontent,
#mascotcontent {
  background: """ + theme["Background Color"] + """;
  border: 1px solid """ + theme["Reply Border"]  + """;
  padding: 5px;
}
.suboptions {
  padding: 5px;
}
.boardTitle {
  text-shadow:
    1px 1px 0 """ + theme["Background Color"] + """,
    -1px 1px 0 """ + theme["Background Color"] + """,
    1px -1px 0 """ + theme["Background Color"] + """,
    -1px -1px 0 """ + theme["Background Color"] + """,
    0px 0px 10px """ + theme["Text"] + """;
}
#browse,
#ft li,
#ft ul,
#options .dialog,
#qrtab,
#watcher,
#updater:hover,
.box-outer,
.boxbar,
.top-box,
.yuimenuitem-selected,
html body span[style="left: 5px; position: absolute;"] a,
input[type="submit"],
#options.reply.dialog,
input[value="Report"] {
  background: """ + theme["Buttons Background"] + """;
  border: 1px solid """ + theme["Buttons Border"]  + """;
}
#dump,
#file,
#options input,
#threadselect select,
input,
input.field,
select,
textarea,
textarea.field {
  background: """ + theme["Input Background"] + """;
  border: 1px solid """ + theme["Input Border"]  + """;
  color: """ + theme["Inputs"] + """;
  """ + agent + """transition: all .2s linear;
}
#browse:hover,
#file:hover,
input:hover,
input.field:hover,
input[type="submit"]:hover,
select:hover,
textarea:hover,
textarea.field:hover {
  background: """ + theme["Hovered Input Background"] + """;
  border-color: """ + theme["Hovered Input Border"]  + """;
  color: """ + theme["Inputs"] + """;
  """ + agent + """transition: all .2s linear;
}
input:focus,
input.field:focus,
input[type="submit"]:focus,
select:focus,
textarea:focus,
textarea.field:focus {
  background: """ + theme["Focused Input Background"] + """;
  border-color: """ + theme["Focused Input Border"]  + """;
  color: """ + theme["Inputs"] + """;
}
#qp div.post,
div.reply {
  background: """ + theme["Reply Background"] + """;
  border: 1px solid """ + theme["Reply Border"]  + """;
}
.reply.highlight,
.reply:target {
  background: """ + theme["Highlighted Reply Background"] + """;
  border: 1px solid """ + theme["Highlighted Reply Border"]  + """;
}
#boardNavDesktop,
.pages {
  background: """ + theme["Navigation Background"] + """;
  border: 1px solid """ + theme["Navigation Border"]  + """;
}
#delform {
  background: """ + theme["Thread Wrapper Background"] + """;
  border: 1px solid """ + theme["Thread Wrapper Border"]  + """;
}
#boardNavDesktopFoot,
#mascotConf,
#themeConf,
#watcher,
#watcher:hover,
div.subMenu,
#menu {
  background: """ + theme["Dialog Background"] + """;
  border: 1px solid """ + theme["Dialog Border"]  + """;
}
.mascotname,
.mascotoptions {
  background: """ + theme["Dialog Background"] + """;
}
.inline div.reply {
  /* Inline Quotes */
  background-color: """ + (if theme["Dark Theme"] == "1" then "rgba(255,255,255,0.03)" else "rgba(0,0,0,0.03)") + """;
  border: 1px solid """ + theme["Reply Border"] + """;
  box-shadow: 5px 5px 5px """+ theme["Shadow Color"] + """;
}
#qr .warning {
  background: """ + theme["Input Background"] + """;
  border: 1px solid """ + theme["Input Border"]  + """;
}
[style='color: red !important;'] *,
.disabledwarning,
.warning {
  color: """ + theme["Warnings"] + """ !important;
}
a,
#dump,
.entry,
div.post > blockquote a[href^="//"],
.sideArrows a,
div.postContainer span.postNum > .replylink {
  color: """ + theme["Links"] + """;
}
.postNum a {
  color: """ + theme["Post Numbers"] + """;
}
.subject {
  color: """ + theme["Subjects"] + """ !important;
  font-weight: 600;
}
.dateTime {
  color: """ + theme["Timestamps"] + """ !important;
}
#updater:not(:hover),
#updater:not(:hover) #count:not(.new)::after,
.summary,
body > form,
body,
html body span[style="left: 5px; position: absolute;"] a,
input,
textarea,
.abbr,
.boxbar,
.boxcontent,
.pages strong,
.reply,
.reply.highlight,
#boardNavDesktop .title,
#imgControls label::after,
#updater #count:not(.new)::after,
#qr > form > label::after,
span.pln {
  color: """ + theme["Text"] + """;
}
#options ul {
  border-bottom: 1px solid """ + theme["Reply Border"] + """;
  box-shadow: inset """+ theme["Shadow Color"] + """ 0 0 5px;
}
.quote {
  color: """ + theme["Greentext"] + """;
}
a.backlink {
  color: """ + theme["Backlinks"] + """;
  font-weight: 800;
}
span.quote > a.quotelink,
a.quotelink {
  color: """ + theme["Quotelinks"] + """;
}
div.subMenu,
#menu,
#qp div.post {
  box-shadow: 5px 5px 5px """+ theme["Shadow Color"] + """;
}
.rice {
  cursor: pointer;
  width: 10px;
  height: 10px;
  margin: 3px;
  display: inline-block;
  background: """ + theme["Checkbox Background"] + """;
  border: 1px solid """ + theme["Checkbox Border"]  + """;
}
#qr label input,
#updater input,
.bd {
  background: """ + theme["Buttons Background"] + """;
  border: 1px solid """ + theme["Buttons Border"]  + """;
}
.pages a,
#boardNavDesktop a {
  color: """ + theme["Navigation Links"] + """;
}
input[type=checkbox]:checked + .rice {
  background: """ + theme["Checkbox Checked Background"] + """;
  background-image: url(""" + (if theme["Dark Theme"] == "1" then "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAMAAADXT/YiAAAAWlBMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9jZLFEAAAAHXRSTlMAgVHwkF11LdsM9vm9n5x+ye0qMOfk/GzqSMC6EsZzJYoAAABBSURBVHheLcZHEoAwEMRArcHknNP8/5u4MLqo+SszcBMwFyt57cFXamjV0UtyDBotIIVFiiAJ33aijhOA67bnwwuZdAPNxckOUgAAAABJRU5ErkJggg==" else "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAMAAADXT/YiAAAAWlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACLSV5RAAAAHXRSTlMAgVHwkF11LdsM9vm9n5x+ye0qMOfk/GzqSMC6EsZzJYoAAABBSURBVHheLcZHEoAwEMRArcHknNP8/5u4MLqo+SszcBMwFyt57cFXamjV0UtyDBotIIVFiiAJ33aijhOA67bnwwuZdAPNxckOUgAAAABJRU5ErkJggg==") + """);
  background-attachment: scroll;
  background-repeat: no-repeat;
  background-position: bottom right;
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
  color: """ + theme["Hovered Links"] + """;
}
.boardBanner a:hover,
#boardNavDesktop a:hover {
  color: """ + theme["Hovered Navigation Links"] + """;
}
.boardBanner {
  color: """ + theme["Board Title"] + """;
}
.name {
  color: """ + theme["Names"] + """ !important;
}
.postertrip,
.trip {
  color: """ + theme["Tripcodes"] + """ !important;
}
.nameBlock > .useremail > .postertrip,
.nameBlock > .useremail > .name {
  color: """ + theme["Emails"] + """;
}
.nameBlock > .useremail > .name,
.name {
  font-weight: 600;
}
a.forwardlink {
  border-bottom: 1px dashed;
}
.qphl {
  outline-color: """ + theme["Backlinked Reply Outline"] + """;
}
#qr input:""" + agent + """placeholder,
#qr textarea:""" + agent + """placeholder {
  color: """ + (if theme["Dark Theme"] == "1" then "rgba(255,255,255,0.2)" else "rgba(0,0,0,0.3)") + """ !important;
}
.boxcontent dd,
#options ul {
  border-color: """ + (if theme["Dark Theme"] == "1" then "rgba(255,255,255,0.1)" else "rgba(0,0,0,0.1)") + """;
}
#options .styleoption {
  border-top: 1px solid """ + (if theme["Dark Theme"] == "1" then "rgba(255,255,255,0.05)" else "rgba(0,0,0,0.05)") + """;
}
#mascot img {
  """ + agent + """transform: scaleX(""" + (if sidebarLocation[0] == "left" then "-" else "") + """1);
}
""" + theme["Custom CSS"]
      if theme["Dark Theme"] == "1"
        css += """
.prettyprint {
  background-color: rgba(255,255,255,.1);
  border: 1px solid rgba(0,0,0,0.5);
}
span.tag {
  color: #96562c;
}
span.pun {
  color: #5b6f2a;
}
span.com {
  color: #a34443;
}
span.str,
span.atv {
  color: #8ba446;
}
span.kwd {
  color: #987d3e;
}
span.typ,
span.atn {
  color: #897399;
}
span.lit {
  color: #558773;
}
/* 4chan X options */
#navtopright .settingsWindowLink::after {
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAIVJREFUGNOFkVENwCAMRE8CUiYBCZOAM6Rg4CWTMAlIuH0AG9mS0f7Q67W9FmkyMoWstxGIEgljTJKIhCd59IQp9+voBHaMOUmdnqgYs41qcxLYKZhCJFCxbrZJvUfz2LCm1liappoiYUxu8AiHVw2cPIXf6sXsl/L6Vb7c++9qi5v//dgFtjLxtKnNCFwAAAAASUVORK5CYII=");
}
/* Return button */
div.navLinks > a:first-of-type::after {
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
"""
      else
        css += """
.prettyprint {
  background-color: #e7e7e7;
  border: 1px solid #dcdcdc;
}
span.com {
  color: #d00;
}
span.str,
span.atv {
  color: #7fa61b;
}
span.pun {
  color: #61663a;
}
span.tag {
  color: #117743;
}
span.kwd {
  color: #5a6F9e;
}
span.typ,
span.atn {
  color: #9474bd;
}
span.lit {
  color: #368c72;
}
/* 4chan X options */
#navtopright .settingsWindowLink::after {
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAIVJREFUGNOFkVERwCAMQyMBKZOAhEng69lCChImYRKQkH0AG7fdjfaHpmmbFmkyMoWstxGIEgljTJKIhCd59IQp9+voBHaMOUmdnqgYs41qcxLYKZhCJFCxbrZJvUfz2LCm1liappoiYUxu8AiHVw2cPIXf6sXsl/L6Vb7c++9qi5v//dgFAGGyWuspVmQAAAAASUVORK5CYII=");
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
"""
      switch Conf["4chan Banner"]
        when "at sidebar top" or "in sidebar"
          logoOffset = 83 + sidebarOffsetH
          css += """
.boardBanner img {
  position: fixed;
  width: """ + (248 + sidebarOffsetW) + """px;
  """ + sidebarLocation[0] + """: 19px;
  right: 2px;
}
"""
        when "at sidebar bottom"
          logoOffset = 0
          css += """
.boardBanner img {
  position: fixed;
  width: """ + (248 + sidebarOffsetW) + """px;
  bottom: 280px;
  """ + sidebarLocation[0] + """: 2px;
}
"""
        when "at top"
          logoOffset = 0
        when "hide"
          logoOffset = 0
          css += """
.boardBanner img {
  display: none;
}
"""

      css += """
.globalMessage,
#boardNavDesktopFoot,
#watcher {
  position: fixed;
  top: """ + (36 + logoOffset) + """px;
}
#boardNavDesktopFoot::after,
#navtopright .settingsWindowLink::after,
#stats,
#watcher::before,
.globalMessage::before ,
div.navLinks > a:first-of-type::after,
body > a[style="cursor: pointer; float: right;"]::after {
  top: """ + (21 + logoOffset) + """px !important;
}
"""

      switch Conf["Board Logo"]
        when "at sidebar top" or "in sidebar"
          css += """
.boardTitle {
  position: fixed;
  """ + sidebarLocation[0] + """: 2px;
  top: """ + (45 + logoOffset) + """px;
  z-index: 1;
  width: """ + (248 + sidebarOffsetW) + """px;
}
.boardSubtitle {
  display: none;
}
"""
        when "at sidebar bottom"
          css += """
.boardTitle {
  position: fixed;
  """ + sidebarLocation[0] + """: 2px;
  bottom: 400px;
  z-index: 1;
  width: """ + (248 + sidebarOffsetW) + """px;
}
.boardSubtitle {
  display: none;
}
"""
        when "hide"
          css += """
.boardTitle,
.boardSubtitle {
  display: none;
}
"""

      switch Conf["Reply Padding"]
        when "phat"
          css += """
form .postContainer blockquotee {
  margin: 24px 60px 24px 50px
}
"""
        when "normal"
          css += """
form .postContainer blockquote {
  margin: 12px 40px 12px 30px
}
"""
        when "slim"
          css += """
form .postContainer blockquote {
  margin: 6px 20px 6px 15px
}
"""
        when "super slim"
          css += """
form .postContainer blockquote {
  margin: 3px 10px 3px 7px
}
"""
        when "anorexia"
          css += """
form .postContainer blockquote {
  margin: 1px 5px 1px 3px
}
"""

      switch Conf["Post Form Style"]
        when "fixed"
          css += """
#qrtab {
  display: none;
}
#qr {
  """ + sidebarLocation[0] + """: 2px !important;
  """ + sidebarLocation[1] + """: auto !important;
}
"""
        when "slideout"
          css += """
#qrtab {
  display: none;
}
#qr {
  """ + sidebarLocation[0] + """: -""" + (233 + sidebarOffsetW) + """px !important;
  """ + sidebarLocation[1] + """: auto !important;
  """ + agent + """transition: right .3s ease-in-out 1s, left .3s ease-in-out 1s;
}
#qr:hover,
#qr.focus,
#qr.dump {
  """ + sidebarLocation[0] + """: 2px !important;
  """ + sidebarLocation[1] + """: auto !important;
  """ + agent + """transition: right .3s linear, left .3s linear;
}
"""
        when "tabbed slideout"
          css += """
#qr {
  """ + sidebarLocation[0] + """: -""" + (249 + sidebarOffsetW) + """px !important;
  """ + sidebarLocation[1] + """: auto !important;
  """ + agent + """transition: """ + sidebarLocation[0] + """ .3s ease-in-out 1s;
}
#qr:hover,
#qr.focus,
#qr.dump {
  """ + sidebarLocation[0] + """: 2px !important;
  """ + sidebarLocation[1] + """: auto !important;
  """ + agent + """transition: """ + sidebarLocation[0] + """ .3s linear;
}
#qrtab {
  z-index: -1;
  """ + agent + """transform: rotate(""" + (if sidebarLocation[0] == "left" then "" else "-") + """90deg);
  """ + agent + """transform-origin: bottom """ + sidebarLocation[0] + """;
  position: fixed;
  bottom: 250px;
  """ + sidebarLocation[0] + """: 0;
  width: 210px;
  display: inline-block;
  font-size: 12px;
  opacity: 1;
  height: 18px;
  text-align: center;
  padding-top: 3px;
  vertical-align: middle;
  color: """ + theme["Text"] + """;
  """ + agent + """transition: opacity .3s ease-in-out 1s, """ + sidebarLocation[0] + """ .3s ease-in-out 1s;
}
#qr:hover #qrtab,
#qr.focus #qrtab,
#qr.dump #qrtab {
  opacity: 0;
  """ + sidebarLocation[0] + """: """ + (252 + sidebarOffsetW) + """px;
  """ + agent + """transition: opacity .3s linear, """ + sidebarLocation[0] + """ .3s linear;
}
"""
        when "transparent fade"
          css += """
#qrtab {
  display: none;
}
#qr {
  """ + sidebarLocation[0] + """: 2px !important;
  """ + sidebarLocation[1] + """: auto !important;
  opacity: 0.2;
  """ + agent + """transition: opacity .3s ease-in-out 1s;
}
#qr:hover,
#qr.focus,
#qr.dump {
  opacity: 1;
  """ + agent + """transition: opacity .3s linear;
}
"""
      if Conf["Fit Width Replies"]
        css += """
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
  padding-top: 1px;
}
div.postInfo {
  margin: 1px 0 0;
  position: relative;
  width: 100%;
}
.sideArrows a,
.sideArrows span {
  position: static;
  font-size: 9px;
  height: 10px;
  width: 20px;
}
.sideArrows,
div.reply .report_button,
div.reply .menu_button {
  opacity: 0;
}
form .replyContainer:not(:hover) div.reply .report_button,
form .replyContainer:not(:hover) div.reply .menu_button,
form .replyContainer:not(:hover) .sideArrows {
  """ + agent + """transition: opacity .3s ease-out 0s;
}
form .replyContainer:hover div.reply .report_button,
form .replyContainer:hover div.reply .menu_button,
form .replyContainer:hover .sideArrows {
  opacity: 1;
  """ + agent + """transition: opacity .3s ease-in 0s;
}
div.reply {
  padding-top: 6px;
  padding-left: 10px;
}
div.reply .report_button,
div.reply .menu_button {
  position: absolute;
  right: 6px;
  top: -1px;
  font-size: 9px;
}
.sideArrows a {
  position: absolute;
  right: 20px;
  top: 7px;
}
div.reply .inline .menu_button,
div.reply .inline .sideArrows,
div.reply .inline .sideArrows a,
div.reply .inline .rice {
  position: static;
  opacity: 1;
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
"""
      else
        css += """
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
  float: left;
}
.sideArrows a {
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
div.reply {
  padding-top: 6px;
  padding-left: 8px;
}
.sideArrows {
  margin-right: 2px;
}
"""

      switch Conf["Page Margin"]
        when "none"
          pagemargin = "2px"
        when "small"
          pagemargin = "50px"
        when "medium"
          pagemargin = "150px"
        when "fully centered"
          pagemargin = (252 + sidebarOffsetW) + "px"
        when "large"
          pagemargin = "350px"

      if editMode == "theme"
        pagemargin = "300px"

      if Conf["Sidebar"] != "hide"
        css += """
body {
  margin-top: 1px;
  margin-bottom: 0;
  margin-""" + sidebarLocation[0] + ": " +(252 + sidebarOffsetW) + """px;
  margin-""" + sidebarLocation[1] + ": " + pagemargin + """;
}
#boardNavDesktop,
.pages {
  """ + sidebarLocation[0] + ": " + (252 + sidebarOffsetW) + """px;
  """ + sidebarLocation[1] + ": " + pagemargin + """;
}
"""
      else
        css += """
body {
  margin: 1px """ + pagemargin + " 0 " + pagemargin + """;
}
#boardNavDesktop,
.pages {
  """ + sidebarLocation[0] + ": " + pagemargin + """;
  """ + sidebarLocation[1] + ": " + pagemargin + """;
}
"""

      if Conf["Compact Post Form Inputs"]
        css += """
#qr textarea.field {
  height: 161px !important;
}
#qr.captcha textarea.field {
  height: 114px !important;
}
.textarea {
  height: 162px;
}
#qr.captcha .textarea {
  height: 115px;
}
#qr .field[name="name"],
#qr .field[name="email"],
#qr .field[name="sub"] {
  width: """ + (75 + (sidebarOffsetW / 3)) + """px !important;
  margin-left: 1px !important;
}
"""
      else
        css += """
#qr textarea.field {
  height: 135px !important;
}
#qr.captcha textarea.field {
  height: 88px !important;
}
#qr .textarea {
  height: 89px;
}
#qr.captcha .textarea {
  height: 136px;
}
#qr .field[name="email"],
#qr .field[name="sub"] {
  width: """ + (248 + sidebarOffsetW) + """px !important;
}
#qr .field[name="name"] {
  width: """ + (227 + sidebarOffsetW) + """px !important;
  margin-left: 1px !important;
}
#qr .field[name="email"],
#qr .field[name="sub"] {
  margin-top: 1px;
}
"""

      if Conf["Expand Post Form Textarea"]
        css += """
#qr textarea {
  display: block;
  """ + agent + """transition: all 0.25s ease 0s, width .3s ease-in-out .3s;
  float: """ + sidebarLocation[0] + """;
}
#qr textarea:focus {
  width: 400px;
}
"""

      if Conf["Filtered Backlinks"]
        css += """
.filtered.backlink {
  display: none;
}
"""

      if Conf["Rounded Edges"]
        css += """
.rice {
  border-radius: 2px;
}
#boardNavDesktopFoot,
#content,
#options ul,
#options,
#qp,
#watcher,
.globalMessage,
.inline div.reply,
div.reply,
div.reply.highlight,
div.reply > tr > div.reply,
h2,
td[style="border: 1px dashed;"] {
  border-radius: 3px;
}
#qrtab {
  border-radius: 6px 6px 0 0;
}
.qphl {
  """ + agent + """outline-radius: 3px;
}
"""

      if Conf["Slideout Watcher"]
        css += """
#watcher:not(:hover) {
  border: 0 none;
  padding: 0;
}
#watcher {
  position: fixed;
  z-index: 98 !important;
  top: """ + (34 + logoOffset) + """px !important;
  """ + sidebarLocation[0] + """: 2px !important;
  """ + sidebarLocation[1] + """: auto !important;
  bottom: auto !important;
  height: 0;
  width: """ + (248 + sidebarOffsetW) + """px !important;
  overflow: hidden;
  """ + agent + """transition: height .5s linear;
  """ + agent + """box-sizing: border-box;
  box-sizing: border-box;
}
#watcher:hover {
  z-index: 99 !important;
  height: 400px;
  padding-bottom: 4px;
}
"""
      else
        css += """
#watcher::before {
  display: none;
}
#watcher {
  """ + sidebarLocation[0] + """: 2px !important;
  """ + sidebarLocation[1] + """: auto !important;
  width: """ + (246 + sidebarOffsetW) + """px;
  padding-bottom: 4px;
  z-index: 96;
  top: """ + ( 100 + logoOffset) + """px !important;
}
"""
      if Conf["Underline Links"]
        css += """
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
"""

      switch Conf["Slideout Navigation"]
        when "compact"
          css += """
#boardNavDesktopFoot:not(:hover) {
  border: 0 none !important;
}
#boardNavDesktopFoot:hover {
  z-index: 99 !important;
  height: 84px;
  word-spacing: 3px;
}
#navbotright {
  display: none;
}
"""
        when "list"
          css += """
#boardNavDesktopFoot:not(:hover) {
  border: 0 none !important;
}
#boardNavDesktopFoot a {
  z-index: 1;
  display: block;
}
#boardNavDesktopFoot:hover {
  z-index: 99 !important;
  height: 300px;
  overflow-y: scroll;
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
#navbotright {
  display: none;
}
"""
        when "hide"
          css += """
#boardNavDesktopFoot {
  display: none;
}
"""

      switch Conf["Reply Spacing"]
        when "none"
          css += """
.replyContainer {
  margin-bottom: 0px;
}
#delform {
  margin-bottom: 12px;
}
"""
        when "small"
          css += """
.replyContainer {
  margin-bottom: 2px;
}
#delform {
  margin-bottom: 10px;
}
"""
        when "medium"
          css += """
.replyContainer {
  margin-bottom: 4px;
}
#delform {
  margin-bottom: 8px;
}
"""
        when "large"
          css += """
.replyContainer {
  margin-bottom: 6px;
}
#delform {
  margin-bottom: 6px;
}
"""

      switch Conf["Sage Highlighting"]
        when "text"
          css += """
a.useremail[href*="sage"]:last-of-type::after,
a.useremail[href*="Sage"]:last-of-type::after,
a.useremail[href*="SAGE"]:last-of-type::after {
  content: " (sage) ";
  color: """ + theme["Sage"] + """;
}
"""
        when "image"
          css += """
a.useremail[href*="sage"]:last-of-type::after,
a.useremail[href*="Sage"]:last-of-type::after,
a.useremail[href*="SAGE"]:last-of-type::after {
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAABa1BMVEUAAACqrKiCgYIAAAAAAAAAAACHmX5pgl5NUEx/hnx4hXRSUVMiIyKwrbFzn19SbkZ1d3OvtqtpaWhcX1ooMyRsd2aWkZddkEV8vWGcpZl+kHd7jHNdYFuRmI4bHRthaV5WhUFsfGZReUBFZjdJazpGVUBnamYfHB9TeUMzSSpHgS1cY1k1NDUyOC8yWiFywVBoh1lDSEAZHBpucW0ICQgUHhBjfFhCRUA+QTtEQUUBAQFyo1praWspKigWFRZHU0F6j3E9Oz5VWFN0j2hncWONk4sAAABASDxJWkJKTUgAAAAvNC0fJR0DAwMAAAA9QzoWGhQAAAA8YytvrFOJsnlqyT9oqExqtkdrsExpsUsqQx9rpVJDbzBBbi5utk9jiFRuk11iqUR64k5Wf0JIZTpadk5om1BkyjmF1GRNY0FheFdXpjVXhz86XSp2yFJwslR3w1NbxitbtDWW5nNnilhFXTtYqDRwp1dSijiJ7H99AAAAUnRSTlMAJTgNGQml71ypu3cPEN/RDh8HBbOwQN7wVg4CAQZ28vs9EDluXjo58Ge8xwMy0P3+rV8cT73sawEdTv63NAa3rQwo4cUdAl3hWQSWvS8qqYsjEDiCzAAAAIVJREFUeNpFx7GKAQAYAOD/A7GbZVAWZTBZFGQw6LyCF/MIkiTdcOmWSzYbJVE2u1KX0J1v+8QDv/EkyS0yXF/NgeEILiHfyc74mICTQltqYXBeAWU9HGxU09YqqEvAElGjyZYjPyLqitjzHSEiGkrsfMWr0VLe+oy/djGP//YwfbeP8bN3Or0bkqEVblAAAAAASUVORK5CYII=") "  ";
}
"""

      switch Conf["Announcements"]
        when "4chan default"
          css += """
.globalMessage {
  position: static;
  background: none;
  border: none;
  margin-top: 0px;
}
.globalMessage::before {
  display: none;
}
"""
        when "slideout"
          css += """
.globalMessage:not(:hover) {
  border: 0 none;
}
.globalMessage {
  bottom: auto;
  position: fixed;
  """ + sidebarLocation[0] + """: 2px;
  """ + sidebarLocation[1] + """: auto;
  width: """ + (248 + sidebarOffsetW) + """px;
  background: """ + theme["Dialog Background"] + """;
  border: 1px solid """ + theme["Dialog Border"]  + """;
  z-index: 98;
  height: 0px;
  overflow: hidden;
  """ + agent + """transition: height .5s linear;
  """ + agent + """box-sizing: border-box;
  box-sizing: border-box;
}
.globalMessage:hover {
  height: 500px;
  z-index: 99 !important;
}
"""
        when "hide"
          css += """
.globalMessage {
  display: none;
}
.globalMessage::before {
  display: none;
}
"""

      switch Conf["Boards Navigation"]
        when "sticky top"
          css += """
#boardNavDesktop {
  position: fixed;
  top: 0;
}
"""
        when "sticky bottom"
          css += """
#boardNavDesktop {
  position: fixed;
  bottom: 0;
}
"""
        when "top"
          css += """
#boardNavDesktop {
  position: absolute;
  top: 0;
}
"""
        when "hide"
          css += """
#boardNavDesktop {
  position: absolute;
  top: -100px;
}
"""

      switch Conf["Pagination"]
        when "sticky top"
          css += """
.pages {
  position: fixed;
  top: 0;
  z-index: 101;
}
"""
        when "sticky bottom"
          css += """
.pages {
  position: fixed;
  bottom: 0;
  z-index: 101;
}
"""
        when "top"
          css += """
.pages {
  position: absolute;
  top: 0;
}
"""
        when "on side"
         css += """
.pages {
  padding: 0;
  visibility: hidden;
  top: auto;
  bottom: 175px;
  width: 290px;
  """ + sidebarLocation[1] + """: auto;
  """ + (if sidebarLocation[0] == "left" then "left: -1px" else "right: " + (251 + sidebarOffsetW) + "px") + """;
  position: fixed;
  """ + agent + """transform: rotate(90deg);
  """ + agent + """transform-origin: bottom right;
  letter-spacing: -1px;
  word-spacing: -6px;
  z-index: 6;
  margin: 0;
  height: 15px;
}
.pages a,
.pages strong {
  visibility: visible;
  min-width: 0;
}
"""
        when "hide"
          css += """
.pages {
  display: none;
}
"""
      switch Conf["Checkboxes"]
        when "show"
          css += """
input[type=checkbox] {
  display: none;
}
"""
        when "make checkboxes circular"
          css += """
input[type=checkbox] {
  display: none;
}
.rice {
  border-radius: 6px;
}
"""
        when "do not style checkboxes"
          css += """
.rice {
  display: none;
}
"""
        when "hide"
          css += """
input[type=checkbox] {
  display: none;
}
.rice {
  display: none;
}
"""

      if Conf["Mascots"]
        css += MascotTools.init()

      if Conf["Block Ads"]
        css += """
/* AdBlock Minus */
a[href*="jlist"],
img[src^="//static.4chan.org/support/"] {
  display: none;
}
"""
      unless Conf["Emoji"] == "disable"
        css += Style.emoji Conf["Emoji Position"]

    return css