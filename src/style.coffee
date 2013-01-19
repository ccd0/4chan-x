  layout: ->

    _conf = Conf

    # Position of submenus in relation to the post menu.
    position = {
      right:
        {
          hide:
            if parseInt(_conf['Right Thread Padding'], 10) < 100
              "right"
            else
              "left"
          minimal: "right"
        }[_conf["Sidebar"]] or "left"
      left:
        if parseInt(_conf['Right Thread Padding'], 10) < 100
          "right"
        else
          "left"
    }[_conf["Sidebar Location"]]

    # Offsets various UI of the sidebar depending on the sidebar's width.
    # Only really used for the board banner or right sidebar.
    Style['sidebarOffset'] = if _conf["Sidebar"] is "large"
      {
        W: 51
        H: 17
      }
    else
      {
        W: 0
        H: 0
      }

    Style.logoOffset =
      if _conf["4chan Banner"] is "at sidebar top"
        83 + Style.sidebarOffset.H
      else
        0

    Style.sidebarLocation = if _conf["Sidebar Location"] is "left"
      ["left",  "right"]
    else
      ["right", "left" ]

    if _conf['editMode'] is "theme"
      editSpace = {}
      editSpace[Style.sidebarLocation[1]] = 300
      editSpace[Style.sidebarLocation[0]] = 0
    else
      editSpace =
        left:   0
        right:  0

    Style.sidebar = {
      minimal:  20
      hide:     2
    }[_conf.Sidebar] or (252 + Style.sidebarOffset.W)

    Style.replyMargin = {
      none:     0
      minimal:  1
      small:    2
      medium:   4
      large:    8
    }[_conf["Reply Spacing"]]

    css = """
/* dialog styling */
.dialog.reply {
  display: block;
}
.move {
  cursor: move;
}
label,
.favicon {
  cursor: pointer;
}
.hide_thread_button {
  padding: 0 5px;
  float: left;
}
.hide_thead_button.hidden_thread {
  padding: 0;
  float: none;
}
.menu_button {
  display: inline-block;
}
.menu_button > span,
#mascot_hide > span,
.hide_thread_button span > span,
.hide_reply_button span > span {
  display: inline-block;
  margin: 2px 2px 3px;
  vertical-align: middle;
}
.menu_button > span,
#mascot_hide > span {
  border-top:   .5em solid;
  border-right: .3em solid transparent;
  border-left:  .3em solid transparent;
}
.hide_thread_button span > span,
.hide_reply_button span > span {
  width: .4em;
  height: 1px;
}
#mascot_hide {
  padding: 3px;
  position: absolute;
  top: 2px;
  right: 18px;
}
#mascot_hide input,
#mascot_hide .rice {
  float: left;
}
#mascot_hide > div {
  height: 0;
  text-align: right;
  overflow: hidden;
}
#mascot_hide:hover > div {
  height: auto;
}
#mascot_hide label {
  width: 100%;
  display: block;
  clear: both;
  text-decoration: none;
}
#menu,
#post-preview {
  position: absolute;
  outline: none;
}
.themevar textarea {
  height: 300px;
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
.focused.entry {
  background: rgba(255,255,255,.33);
}
.hasSubMenu::after {
  content: "";
  border-#{position}: .5em solid;
  border-top: .3em solid transparent;
  border-bottom: .3em solid transparent;
  display: inline-block;
  margin: .3em;
  position: absolute;
  right: 3px;
}
.subMenu.reply {
  padding: 0;
  position: absolute;
  #{position}: 100%;
  top: -1px;
}
#banmessage,
#boardTitle,
#mascotConf input,
.keybinds_tab > div,
.main_tab,
.style_tab .suboptions,
.center,
h1 {
  text-align: center;
}
.rice_tab .selectrice {
  width: 150px;
  display: inline-block;
}
.keybinds_tab > table {
  margin: auto;
}
#mascotConf input::#{Style.agent}placeholder {
  text-align: center;
}
#mascotConf input:#{Style.agent}placeholder {
  text-align: center;
}
#qr input:focus::#{Style.agent}placeholder,
#qr textarea:focus::#{Style.agent}placeholder {
  color: transparent;
}
#qr input:focus:#{Style.agent}placeholder,
#qr textarea:focus:#{Style.agent}placeholder {
  color: transparent;
}
#boardNavDesktopFoot,
#selectrice,
#selectrice *,
#qr .warning,
#qr .move,
#threadselect .selectrice,
#watcher,
.captchaimg img,
.field,
.file,
.mascotname,
.mascotoptions,
.post,
.postInfo,
.selectrice,
.thumbnail,
button,
input {
  #{Style.agent}box-sizing: border-box;
  box-sizing: border-box;
}
#updater .move,
#qr .move {
  overflow: hidden;
  padding: 0 2px;
}
#credits,
#qr .move > span {
  float: right;
}
#autohide,
#dump,
#qr .selectrice,
.close,
.remove,
.captchaimg,
#qr .warning {
  cursor: pointer;
}
#qr .selectrice,
#qr > form {
  margin: 0;
}
#replies {
  display: block;
  height: 100px;
  position: relative;
}
#replies > div {
  counter-reset: thumbnails;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: absolute;
  white-space: pre;
}
#replies > div:hover {
  bottom: -10px;
  overflow-x: auto;
}
.thumbnail {
  background-color: rgba(0,0,0,.2);
  background-position: 50% 20%;
  background-size: cover;
  border: 1px solid #666;
  cursor: move;
  display: inline-block;
  height: 90px;
  width: 90px;
  margin: 5px;
  padding: 2px;
  opacity: .5;
  outline: none;
  overflow: hidden;
  position: relative;
  text-shadow: 0 1px 1px #000;
  #{Style.agent}transition: opacity .25s ease-in-out;
  vertical-align: top;
}
/* Catalog */
#content .navLinks,
#info .navLinks,
.btn-wrap {
  display: block;
}
.navLinks > .btn-wrap:not(:first-of-type)::before {
  content: ' - ';
}
.button {
  cursor: pointer;
}
#content .btn-wrap,
#info .btn-wrap {
  display: inline-block;
}
#settings .selectrice {
  width: 100px;
  display: inline-block;
}
#settings,
#threads,
#info .navLinks,
#content .navLinks {
  text-align: center;
}
#threads .thread {
  vertical-align: top;
  display: inline-block;
  word-wrap: break-word;
  overflow: hidden;
  margin-top: 5px;
  padding: 5px 0 3px;
  text-align: center;
}
.extended-small .thread,
.small .thread {
  width: 165px;
  max-height: 320px;
}
.extended-large .thread,
.large .thread {
  width: 270px;
  max-height: 410px;
}
.extended-small .thumb,
.small .thumb {
  max-width: 150px;
  max-height: 150px;
}
.thumbnail:hover,
.thumbnail:focus {
  opacity: .9;
}
.thumbnail::before {
  counter-increment: thumbnails;
  content: counter(thumbnails);
  color: #fff;
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
  border-color: #fff;
}
.thumbnail > span {
  color: #fff;
}
.remove {
  background: none;
  color: #e00;
  font-weight: 700;
  padding: 3px;
}
.remove:hover::after {
  content: " Remove";
}
.thumbnail > label {
  background: rgba(0,0,0,.5);
  color: #fff;
  right: 0; bottom: 0; left: 0;
  position: absolute;
  text-align: center;
}
.thumbnail > label > input {
  margin: 0;
}
#addReply {
  font-size: 3.5em;
  line-height: 100px;
}
#addReply:hover,
#addReply:focus {
  color: #000;
}
.field {
  #{Style.agent}transition: color .25s, border .25s;
}
.field:hover,
.field:focus {
  outline: none;
}
.fitwidth .fullSize {
  max-width: 100%;
}
.style_tab .selectrice,
.fitwidth .fullSize,
.themevar .field,
.themevar textarea {
  width: 100%;
}
.themevar .colorfield {
  width: 90%;
  border-right: none;
}
.themevar .color {
  width: 10%;
  color: transparent;
  border-left: none;
}
#ihover,
#mouseover,
#navlinks,
#overlay,
#qr,
#qp,
#stats,
#updater {
  position: fixed;
}
#ihover {
  max-height: 97%;
  max-width: 75%;
  padding-bottom: 18px;
}
#overlay {
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0,0,0,.5);
}
#options {
  position: fixed;
  padding: .3em;
  width: auto;
  left: 15%;
  right: 15%;
  top: 15%;
  bottom: 15%;
}
#options h3 {
  margin: 0;
}
#optionsbar {
  padding: 0 3px;
}
.tabs label {
  position: relative;
  padding: 0 4px;
  z-index: 1;
  height: 1.4em;
  display: inline-block;
  border-width: 1px 1px 0 1px;
  border-color: transparent;
  border-style: solid;
}
.theme_tab h1 {
  position: absolute;
  right: 300px;
  bottom: 10px;
  margin: 0;
  #{Style.agent}transition: all .2s ease-in-out;
  opacity: 0;
}
.theme_tab .selectedtheme h1 {
  right: 11px;
  opacity: 1;
}
#themeContainer {
  margin-bottom: 3px;
}
#options li {
  overflow: visible;
  padding: 0 5px 0 7px;
  list-style-type: none;
}
#options tr:nth-of-type(2n+1),
#options li:nth-of-type(2n+1),
.selectrice li:nth-of-type(2n+1) {
  background-color: rgba(0, 0, 0, 0.05);
}
.rice_tab input {
  margin: 1px;
}
article li {
  margin: 10px 0 10px 2em;
}
#options code {
  background: hsla(0, 0%, 100%, .5);
  color: #000;
  padding: 0 1px;
}
.option {
  width: 50%;
  display: inline-block;
}
.optionlabel {
  padding-left: 18px;
}
.rice + .optionlabel {
  padding-left: 0;
}
.mascots {
  padding: 0;
  text-align: center;
}
.mascot,
.mascotcontainer {
  overflow: hidden;
}
.mascot {
  position: relative;
  border: none;
  margin: 5px;
  padding: 0;
  width: 200px;
  display: inline-block;
  background-color: transparent;
}
.mascotcontainer {
  height: 250px;
  border: 0;
  margin: 0;
  max-height: 250px;
  cursor: pointer;
  bottom: 0;
  border-width: 0 1px 1px;
  border-style: solid;
  border-color: transparent;
  overflow: hidden;
}
.mascot img {
  max-width: 200px;
  image-rendering: optimizeQuality;
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
#mascotConf h2 {
  margin: 10px 0 0;
  font-size: 14px;
}
#optionsContent {
  overflow: auto;
  position: absolute;
  top:    1.7em;
  right:  5px;
  bottom: 5px;
  left:   5px;
}
.style_tab .suboptions ul,
.main_tab ul {
  vertical-align: top;
  #{if _conf["Single Column Mode"] then "margin: 0 auto 6px;" else "margin: 0 3px 6px;\n  display: inline-block;"}
}
.main_tab li,
.styleoption {
  text-align: left;
}
.style_tab .suboptions ul {
  width: 370px;
}
.main_tab ul {
  width: 200px;
}
.suboptions,
#mascotcontent,
#themecontent {
  overflow: auto;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 1.5em;
  left: 0;
}
.mAlign {
  height: 250px;
  vertical-align: middle;
  display: table-cell;
}
.style_tab .suboptions {
  bottom: 0;
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
  padding: 0;
  width: 100%;
}
.mascot .mascotoptions {
  opacity: 0;
  #{Style.agent}transition: opacity .3s linear;
}
.mascot:hover .mascotoptions {
  opacity: 1;
}
.mascotoptions {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
}
.mascotoptions a {
  display: inline-block;
  width: 33%;
}
#close,
#mascots_batch {
  position: absolute;
  left: 10px;
  bottom: 0;
}
#upload {
  position: absolute;
  width: 100px;
  left: 50%;
  margin-left: -50px;
  text-align: center;
  bottom: 0;
}
#optionsContent textarea {
  font-family: monospace;
  min-height: 350px;
  resize: vertical;
  width: 100%;
}
#updater:not(:hover) {
  border-color: transparent;
}
#updater input[type=number] {
  width: 4em;
}
#watcher {
  padding-bottom: 5px;
  position: fixed;
  overflow: hidden;
  white-space: nowrap;
  max-height: 200px;
}
#watcher:hover {
  max-height: none;
}
#watcher > div {
  max-width: 200px;
  overflow: hidden;
  padding-left: 5px;
  padding-right: 5px;
  text-overflow: ellipsis;
}
#qp .post {
  border: none;
  margin: 0;
  padding: 0;
}
#mouseover,
#qp img {
  max-height: 300px;
  max-width: 500px;
}
.center,
.replyContainer.image_expanded {
  clear: both;
}
.inline {
  display: table;
}
.opContainer {
  display: block;
}
#copyright,
#boardNavDesktop a,
#options ul,
.menubutton a,
body {
  padding: 0;
}
html,
body {
  min-height: 100%;
}
body {
  margin-top: 1px;
  margin-bottom: 1px;
  margin-#{Style.sidebarLocation[0]}: #{Style.sidebar}px;
  margin-#{Style.sidebarLocation[1]}: 2px;
  padding-left: #{parseInt(_conf["Left Thread Padding"], 10) + editSpace["left"]}px;
  padding-right: #{parseInt(_conf["Right Thread Padding"], 10) + editSpace["right"]}px;
}
#exlinks-options > *,
.selectrice,
html,
body,
a,
body,
button,
input,
textarea {
  font-family: '#{_conf["Font"]}';
}
#qr .captchaimg {
  opacity: #{_conf["Captcha Opacity"]};
  background-color: #fff;
}
#boardNavDesktopFoot a[href*="//boards.4chan.org/"]::after,
#boardNavDesktopFoot a[href*="//boards.4chan.org/"]::before,
#boardNavDesktopFoot a,
.container::before,
.fileText span:not([class])::after,
.pages strong,
.selectrice,
a,
body,
button,
input,
textarea {
  font-size: #{parseInt(_conf["Font Size"], 10)}px;
}
.boardSubtitle,
.boardSubtitle a {
  font-size: #{parseInt(_conf["Font Size"], 10) - 1}px;
}
h2,
h2 a {
  font-size: #{parseInt(_conf["Font Size"], 10) + 4}px;
}
/* Cleanup */
#absbot,
#autohide,
#optionsContent > [name=tab]:not(:checked) + div,
#delform > hr,
#filters-ctrl,
#imgControls .rice,
#logo,
#navbotright,
#postForm,
#postPassword,
#qr:not(.dump) #replies,
#qp .rice
#qp input,
#settingsMenu,
#{if _conf["Hide Show Post Form"] then "#showQR," else ""}
#styleSwitcher,
#threadselect:empty,
#updater:not(:hover) > :not(.move),
#{unless _conf["Board Subtitle"] then ".boardSubtitle," else ""}
.deleteform,
.dump > form > label,
.fappeTyme .noFile,
.fileText:hover .fntrunc,
.fileText:not(:hover) .fnfull,
.forwarded,
.hasSubMenu:not(.focused) > .subMenu,
.hidden_thread > .summary,
.inline input,
.large .teaser,
.mobile,
.navLinksBot,
.panel,
.postInfo input,
.postInfo .rice,
.postingMode,
.postingMode ~ #delform hr,
.qrHeader,
.replyContainer > .hide_reply_button.stub ~ .reply,
.replymode,
.riced,
.sideArrows,
.small .teaser,
.stub ~ *,
.stylechanger,
.thread > .hidden_thread ~ *,
.warnicon,
.warning:empty,
[hidden],
body > br,
body > div[style^="text-align"],
body > hr,
body > script + hr + div,
.post[hidden],
span[style="left: 5px; position: absolute;"]:nth-of-type(0),
table[style="text-align:center;width:100%;height:300px;"] {
  display: none !important;
}
#mascot img,
#replies,
#spoilerLabel,
.captchaimg,
.hide_reply_button,
.menu_button,
.move {
  user-select: none;
  #{Style.agent}user-select: none;
}
.prettyprint span {
  font-family: monospace;
}
.fileThumb {
  float: left;
  margin: 3px 20px 0;
}
.exthumbnail {
  image-rendering: optimizeQuality;
}
a {
  outline: none;
}
.board > hr:last-of-type {
  margin: 0;
  border-bottom-color: transparent;
}
#boardNavDesktop a,
#boardNavDesktopFoot a,
#navlinks a,
.pages a,
.deadlink,
.hide_reply_button a,
s {
  text-decoration: none;
}
.inlined {
  font-style: italic;
  font-weight: 800;
}
#watcher > .move,
.backlink:not(.filtered),
a,
span.postNum > .replylink {
  text-decoration: #{if _conf["Underline Links"] then "underline" else "none"};
}
.filtered,
.quotelink.filtered,
[alt="closed"] + a {
  text-decoration: line-through;
}
/* Z-INDEXES */
#mouseover {
  z-index: 999;
}
#mascotConf,
#options,
#themeConf {
  z-index: 998;
}
#qp {
  z-index: 104;
}
#ihover,
#overlay,
#stats,
#updater,
.exPopup,
.subMenu {
  z-index: 102;
}
.exlinksOptionsLink::after,
#settingsWindowLink,
.cataloglink a::after {
  z-index: 101;
}
#imgControls {
  z-index: 100;
}
#autoPagerBorderPaging,
#boardNavDesktop,
#menu,
#navlinks,
a[style="cursor: pointer; float: right;"]::after {
  z-index: 94;
}
.fileThumb .fullSize {
  position: relative;
  z-index: #{(if _conf["Images Overlap Post Form"] then "90" else "1")};
}
#navtopright,
#showQR {
  z-index: 6;
}
#boardTitle,
#watcher,
#watcher::after,
.boardBanner,
.menu_button,
.hide_reply_button a {
  z-index: 4;
}
#globalMessage::after,
.boardBanner,
.replyhider a {
  z-index: 1;
}
.post {
  z-index: 0;
}
.boardTitle,
.boardTitle a {
  font-size: 22px;
  font-weight: 400;
}
.boardBanner {
  line-height: 0;
}
hr {
  padding: 0;
  height: 0;
  width: 100%;
  clear: both;
  border: none;
}
.boxcontent > hr,
.entry:last-child,
h3,
img {
  border: none;
}
.boxcontent input {
  height: 18px;
  vertical-align: bottom;
  margin-right: 1px;
}
/* Navigation */
.pagelist {
  text-align: #{_conf["Pagination Alignment"]};
}
.next,
.pages,
.prev {
  display: inline-block;
  margin: 0 3px;
}
#boardNavDesktop {
  text-align: #{_conf["Navigation Alignment"]};
}
#boardNavDesktopFoot {
  visibility: visible;
  position: fixed;
  #{Style.sidebarLocation[0]}: 2px;
  bottom: auto;
  color: transparent;
  font-size: 0;
  border-width: 1px;
  text-align: center;
  height: 0;
  width: #{width = 248 + Style.sidebarOffset.W}px !important;
  overflow: hidden;
}
.topad,
.middlead,
.bottomad {
  opacity: 0.3;
}
.topad:hover,
.middlead:hover,
.bottomad:hover {
  opacity: 1;
  #{Style.agent}transition: opacity .3s linear;
}
/* moots announcements */
#globalMessage {
  text-align: center;
  font-weight: 200;
}
#xupdater {
  padding: 2px;
  text-align: center;
  margin: 1px;
}
#xupdater a {
  font-size: #{parseInt(_conf["Font Size"], 10) + 3}px;
}
.pages strong,
a,
.new {
  #{Style.agent}transition: background .1s linear;
}
/* Post Form */
.captchainput,
#file {
  overflow: hidden;
}
/* Formatting for all postarea elements */
#file {
  line-height: 17px;
}
#file,
#threadselect .selectrice {
  cursor: default;
  display: inline-block;
}
#threadselect .selectrice,
input:not([type=radio]),
.field,
input[type="submit"] {
  height: 1.5em;
}
#qr .warning {
  min-height: 1.7em;
}
#qr .warning,
.field,
.selectrice,
button,
input {
  vertical-align: bottom;
  padding: 0 1px;
}
input[type="submit"] {
  padding: 0;
}
#qr input[type="file"] {
  position: absolute;
  opacity: 0;
  z-index: -1;
}
/* Image Hover and Image Expansion */
#ihover {
  max-width: 85%;
  max-height: 85%;
}
#imageType {
  border: none;
  width: 90px;
  position: relative;
  bottom: 1px;
  margin: 0;
  height: 17px;
}
/* Posts */
.postInfo {
  padding: 3px 0 0 8px;
  display: block !important;
  width: auto;
}
.file {
  padding-left: 8px;
}
blockquote {
  min-height: #{parseInt(_conf["Font Size"], 10) + 3}px;
}
.fullSize {
  margin: 0 0 25px;
  position: relative;
  top: 0;
}
.fileText {
  margin-top: 17px;
}
.summary,
.postContainer {
  margin-bottom: #{Style.replyMargin}px;
}
.summary {
  display: table;
}
.thread {
  padding: 0;
  position: relative;
  #{(unless _conf['Images Overlap Post Form'] then "z-index: 0;" else "")}
}
#selectrice {
  margin: 0 !important;
}
.post {
  margin: 0;
}
.cataloglink,
#navtopright {
  position: fixed;
  bottom: -1000px;
  left: -1000px;
}
/* Expand Images */
#imgControls {
  width: 15px;
  overflow-x: hidden;
  overflow-y: visible;
}
#imgContainer {
  float: #{Style.sidebarLocation[0]};
}
#imgContainer,
#imgControls:hover {
  width: 110px;
}
#imgControls label {
  float: #{Style.sidebarLocation[0]};
}
#imgControls .selectrice {
  float: #{Style.sidebarLocation[1]};
  width: 90px;
}
/* Reply Previews */
#mouseover,
#qp {
  max-width: 70%;
}
#post-preview {
  max-width: 400px;
}
#qp .replyContainer,
#qp .opContainer {
  visibility: visible;
}
#post-preview,
#qp .op {
  display: table;
}
#qp .post img {
  max-width: 300px;
  height: auto;
}
.inline .post,
#qp .post {
  padding-bottom: 0 !important;
}
.navLinks {
  visibility: hidden;
  height: 0;
  width: 0;
  overflow: hidden;
}
/* AutoPager */
#autoPagerBorderPaging {
  position: fixed !important;
  right: 300px !important;
  bottom: 0;
}
#options ul {
  margin: 3px;
  margin-bottom: 6px;
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
#prefetch,
#stats {
  position: fixed;
  cursor: default;
}
#updater {
  overflow: hidden;
  background: none;
  text-align: right;
}
#watcher {
  padding: 1px 0;
  border-radius: 0;
}
#{unless _conf['Updater Position'] is 'moveable' then '#updater .move,' else ''}
#options .move,
#watcher .move,
#stats .move {
  cursor: default;
}
/* 4sight */
a[style="cursor: pointer; float: right;"] {
  position: fixed;
  top: -1000px;
  left: -1000px;
}
a[style="cursor: pointer; float: right;"] + div[style^="width: 100%;"] {
  display: block;
  position: fixed !important;
  top: 117px !important;
  #{Style.sidebarLocation[1]}: 4px !important;
  #{Style.sidebarLocation[0]}: #{(252 + Style.sidebarOffset.W)}px !important;
  width: auto !important;
  margin: 0 !important;
  z-index: 2;
}
a[style="cursor: pointer; float: right;"] + div[style^="width: 100%;"] > table > tbody > tr > td {
  vertical-align: top;
}
a[style="cursor: pointer; float: right;"] + div[style^="width: 100%;"] {
  height: 95% !important;
  margin: 0 5px !important;
}
#fs_status {
  width: auto !important;
  height: auto !important;
  padding: 10px !important;
  white-space: normal !important;
}
.identityIcon,
img[alt="Sticky"],
img[alt="Closed"] {
  vertical-align: top;
}
.inline,
#qp {
  background-color: transparent;
  border: none;
}
.mascotname,
input[type="submit"]:hover {
  cursor: pointer;
}
#boardNavDesktop .current {
  font-weight: 800;
}
.focused.entry {
  background-color: transparent;
}
#menu.reply.dialog,
.subMenu {
  padding: 0;
}
.textarea {
  position: relative;
}
#charCount {
  background: none;
  font-size: 10px;
  pointer-events: none;
  position: absolute;
  right: 2px;
  top: auto;
  bottom: 0;
  height: 1.7em;
}
#charCount.warning {
  color: rgb(255,0,0);
  padding: 0;
  margin: 0;
  border: none;
  background: none;
}
/* Position and Dimensions of the #qr */
#showQR {
  display: block;
  #{Style.sidebarLocation[0]}: 2px;
  width: #{width}px;
  background-color: transparent;
  text-align: center;
  position: fixed;
  top: auto;
  bottom: 2px !important;
}
/* Width and height of all #qr elements (excluding some captcha elements) */
#dump {
  width: 20px;
  margin: 0;
  outline: none;
  padding: 0 0 3px;
}
.captchaimg {
  line-height: 0;
}
#qr div {
  min-width: 0;
}
#updater input,
#options input,
#qr {
  border: none;
}
.prettyprint {
  display: table;
  clear: right;
  white-space: pre-wrap;
  border-radius: 2px;
  overflow-x: auto;
  padding: 3px;
}
#themeConf {
  position: fixed;
  #{Style.sidebarLocation[1]}: 2px;
  #{Style.sidebarLocation[0]}: auto;
  top: 0;
  bottom: 0;
  width: 296px;
}
#themebar input {
  width: 30%;
}
.suboptions {
  padding: 5px;
}
#dump,
#file,
#options input,
#dump,
.selectrice,
button,
input,
textarea {
  #{Style.agent}transition: all .2s linear;
}
#boardNavDesktop,
.pagelist {
  #{Style.sidebarLocation[0]}: #{Style.sidebar + parseInt(_conf["Right Thread Padding"], 10) + editSpace["right"]}px;
  #{Style.sidebarLocation[1]}: #{parseInt(_conf["Left Thread Padding"], 10) + editSpace["left"] + 2}px;
}
.inline .post {
  padding-bottom: 2px;
}
#boardNavDesktopFoot:not(:hover) {
  border-color: transparent;
  background-color: transparent;
}
#navlinks a {
  position: fixed;
  color: transparent;
  opacity: 0.5;
  display: inline-block;
  font-size: 0;
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  margin: 1.5px;
}
.selectrice li {
  list-style-type: none;
}
.rice {
  cursor: pointer;
  width: 9px;
  height: 9px;
  margin: 2px 3px;
  display: inline-block;
  vertical-align: bottom;
}
.selectrice {
  position: relative;
  cursor: default;
  overflow: hidden;
  text-align: left;
}
.selectrice::after {
  display: block;
  content: "";
  border-right: .25em solid transparent;
  border-left: .25em solid transparent;
  position: absolute;
  right: .4em;
  top: .5em;
}
.selectrice::before {
  display: block;
  content: "";
  height: 1.5em;
  position: absolute;
  right: 1.3em;
  top: 0;
}
.selectrice ul {
  padding: 0;
  position: fixed;
  max-height: 120px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 99999;
}
input[type=checkbox]:checked + .rice {
  background-attachment: scroll;
  background-repeat: no-repeat;
  background-position: bottom right;
}
.name,
.post-author {
  font-weight: 600;
}
.post-author .post-tripcode {
  font-weight: 400;
}\n
""" + (
      if _conf["Hide Navigation Decorations"]
         """
#boardNavDesktop,
.pages {
  font-size: 0;
  color: transparent;
  word-spacing: 2px;
}
.pages {
  word-spacing: 0;
}
.pages a {
  margin: 1px;
}\n
"""
      else ""
    ) + (
      if _conf["Circle Checkboxes"]
          """
.riced {
  display: none;
}
.rice {
  border-radius: 6px;
}\n
"""
      else ""
    ) + (
      if _conf['Color user IDs']
        """
.posteruid .hand {
  padding: 0 5px;
  border-radius: 6px;
  font-size: 0.8em;
}\n
"""
      else ""
    ) + (
      if _conf["Recursive Filtering"]
        """
.hidden + .threadContainer {
  display: none;
}\n
"""
      else ""
    ) + (
      if _conf["Reply Spacing"] is "none"
        """
.thread > .replyContainer:not(:last-of-type) .post.reply:not(:target) {
  border-bottom-width: 0;
}\n
"""
      else ""
    ) + (
      if _conf["Faded 4chan Banner"]
        """
.boardBanner {
  opacity: 0.5;
  #{Style.agent}transition: opacity 0.3s ease-in-out .5s;
}
.boardBanner:hover {
  opacity: 1;
  #{Style.agent}transition: opacity 0.3s ease-in;
}\n
"""
      else ""
    ) + (
      if _conf["4chan Banner Reflection"]
        """
/* From 4chan SS / OneeChan */
.gecko .boardBanner::after {
  background-image: -moz-element(#Banner);
  bottom: -100%;
  content: '';
  left: 0;
  mask: url("data:image/svg+xml,<svg version='1.1' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient gradientUnits='objectBoundingBox' id='gradient' x2='0' y2='1'><stop stop-offset='0'/><stop stop-color='white' offset='1'/></linearGradient><mask id='mask' maskUnits='objectBoundingBox' maskContentUnits='objectBoundingBox' x='0' y='0' width='100%' height='100%'> <rect fill='url(%23gradient)' width='1' height='1' /></mask></defs></svg>#mask");
  opacity: 0.3;
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 1;
  -moz-transform: scaleY(-1);
}
.webkit #Banner {
  -webkit-box-reflect: below 0 -webkit-linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0) 10%, rgba(255,255,255,.5));
}\n
"""
      else ""
    ) + (
      if _conf["Slideout Transitions"]
        """
#globalMessage,
#watcher,
#boardNavDesktopFoot {
  #{Style.agent}transition: height .3s linear, border .3s linear, background-color .3s step-end;
}
#globalMessage:hover,
#watcher:hover,
#boardNavDesktopFoot:hover {
  #{Style.agent}transition: height .3s linear, border .3s linear, background-color .3s step-start;
}
img.topad,
img.middlead,
img.bottomad {
  #{Style.agent}transition: opacity .3s linear;
}
#imgControls {
  #{Style.agent}transition: width .2s linear;
}\n
"""
      else ""
    ) + (
      if _conf["Post Form Slideout Transitions"]
        """
#qr {
  #{Style.agent}transition: #{Style.sidebarLocation[0]} .3s ease-in-out 1s;
}
#qr:hover,
#qr.focus,
#qr.dump {
  #{Style.agent}transition: #{Style.sidebarLocation[0]} .3s linear;
}
#qrtab {
  #{Style.agent}transition: opacity .3s ease-in-out 1s, #{Style.sidebarLocation[0]} .3s ease-in-out 1s;
}\n
"""
      else ""
    ) + (
      if _conf["Hide Horizontal Rules"]
        """
hr {
  visibility: hidden;
}\n
"""
      else ""
    ) + (
      unless _conf["Post Form Style"] is "float"
        """
#qr img {
  height: 3.9em;
  width: #{width}px;
}
#qr > form > #threadselect,
#spoilerLabel {
  display: inline-block;
}
#spoilerLabel {
  width: 100%;
  text-align: right;
}
#qr > form > #threadselect,
#threadselect:not(:empty) + #spoilerLabel {
  width: 49%;
}
#threadselect .selectrice {
  margin-top: 0;
  width: 100%;
}
input[title="Verification"] {
  width: 100%;
}
textarea.field,
#qr > form > div {
  width: #{width}px;
}
#qr {
  border: 1px transparent solid;
  padding: 1px;
  overflow: visible;
  top: auto !important;
  bottom: 1.6em !important;
  width: #{width}px;
  margin: 0;
  z-index: 5 !important;
}
input[title="Verification"],
.captchaimg {
  margin-top: 1px;
}
#qr .warning,
#threadselect .selectrice,
input,
.field {
  margin: 1px 0 0;
}
#file {
  width: #{(177 + Style.sidebarOffset.W)}px;
}
#buttons input {
  width: 70px;
  margin: 1px 0 0 1px;
}""" + (
          if _conf["Compact Post Form Inputs"] then """
#qr textarea.field {
  height: 15em;
  min-height: 9em;
  min-width: #{width}px;
}
#qr.captcha textarea.field {
  height: 9em;
  min-height: 9em;
}
#qr .field[name="name"],
#qr .field[name="email"],
#qr .field[name="sub"] {
  width: #{(75 + (Style.sidebarOffset.W / 3))}px !important;
  margin-top: 0 !important;
  margin-left: 1px !important;
}\n
"""
          else
            """
#qr textarea.field {
  height: 12em;
  min-height: 12em;
  min-width: #{width}px
}
#qr.captcha textarea.field {
  height: 6em;
  min-height: 6em;
}
#qr .field[name="email"],
#qr .field[name="sub"] {
  width: #{width}px !important;
}
#qr .field[name="name"] {
  width: #{(227 + Style.sidebarOffset.W)}px !important;
  margin-left: 1px !important;
  margin-top: 0 !important;
}
#qr .field[name="email"],
#qr .field[name="sub"] {
  margin-top: 1px;
}\n
"""
        ) + (
          if _conf["Textarea Resize"] is "auto-expand"
            """
#qr textarea {
  display: block;
  #{Style.agent}transition:
    color 0.25s linear,
    background-color 0.25s linear,
    background-image 0.25s linear,
    height step-end,
    width #{if _conf["Slideout Transitions"] then ".3s ease-in-out .3s" else "step-end"};
  float: #{Style.sidebarLocation[0]};
  resize: vertical;
}
#qr textarea:focus {
  width: 400px;
}\n
"""
          else
            """
#qr textarea {
  display: block;
  #{Style.agent}transition:
    color 0.25s linear,
    background-color 0.25s linear,
    background-image 0.25s linear,
    border-color 0.25s linear,
    height step-end,
    width step-end;
  float: #{Style.sidebarLocation[0]};
  resize: #{_conf["Textarea Resize"]}
}\n
"""
        )
      else ""
    ) + (
      if _conf["Fit Width Replies"]
        """
.thread .replyContainer {
  position: relative;
  clear: both;
}
.replyContainer > .post {
  display: table;
  width: 100%;
}
.hide_reply_button a,
.menu_button {
  position: absolute;
  right: 6px;
  top: 4px;
  font-size: 9px;
}
.hide_reply_button a {
  #{if _conf["Menu"] then "right: 27px;" else ""}
}
.summary {
  padding-left: 20px;
  clear: both;
}
.hide_reply_button {
  width: 0;
}
.hide_reply_button.stub {
  width: auto;
}
.hide_reply_button a,
.menu_button {
  opacity: 0;
  #{Style.agent}transition: opacity .3s ease-out 0s;
}
.hide_reply_button.stub a {
  position: static;
  opacity: 1;
}
.op:hover .menu_button,
.replyContainer:hover .menu_button,
.replyContainer:hover .hide_reply_button a {
  opacity: 1;
  #{Style.agent}transition: opacity .3s ease-in 0s;
}
.inline .menu_button {
  position: static;
  opacity: 1;
}
#options.reply {
  display: inline-block;
}\n
"""
      else
        """
.hide_reply_button {
  padding: 3px;
  float: left;
}
.reply.post {
  position: relative;
  overflow: visible;
  display: table;
}\n
"""
    ) + (
      if _conf['Force Reply Break']
        """
.summary,
.replyContainer {
  clear: both;
}\n
"""
      else ""
    ) + (
      if _conf["Filtered Backlinks"]
       """
.filtered.backlink {
  display: none;
}\n
"""
      else ""
    ) + (
      if _conf["Slideout Watcher"]
        """
#watcher:not(:hover) {
  border-color: transparent;
  background-color: transparent;
}
#watcher {
  position: fixed;
  #{Style.sidebarLocation[0]}: 2px !important;
  #{Style.sidebarLocation[1]}: auto !important;
  bottom: auto !important;
  height: 0;
  width: #{width}px !important;
  overflow: hidden;
}
#watcher:hover {
  height: #{if _conf["Slideout Transitions"] then '250px' else 'auto'};
  overflow: auto;
  padding-bottom: 4px;
}\n
"""
      else
        """
#watcher::after {
  display: none;
}
#watcher {
  width: #{(246 + Style.sidebarOffset.W)}px;
  padding-bottom: 4px;
  z-index: 96;
}
#watcher > .move {
  cursor: pointer !important;
}\n
"""
    ) + (
      if _conf["OP Background"]
        """
.opContainer .post {
  padding: 5px;
  #{Style.agent}box-sizing: border-box;
  box-sizing: border-box;
}\n
"""
      else ""
    ) + (
      if _conf["Tripcode Hider"]
        """
input.field.tripped:not(:hover):not(:focus) {
  color: transparent !important;
  text-shadow: none !important;
}\n
"""
      else ""
    ) + (
      if _conf["Block Ads"]
        """
/* AdBlock Minus */
.bottomad + hr,
a[href*="jlist"],
img[src^="//static.4chan.org/support/"] {
  display: none;
}\n
"""
      else ""
    ) + (
      if _conf["Shrink Ads"]
        """
a[href*="jlist"],
img[src^="//static.4chan.org/support/"] {
  width: 500px;
  height: auto;
}\n
"""
      else ""
    ) + (
      unless _conf["Emoji"] is "disable"
        Style.emoji _conf["Emoji Position"]
      else ""
    ) + (
      if _conf["4chan SS Sidebar"]
        """
body::before {
  content: "";
  position: fixed;
  top: 0;
  bottom: 0;
  #{Style.sidebarLocation[0]}: 0;
  width: #{if _conf["Sidebar"] is "large" then 305 else if _conf["Sidebar"] is "normal" then 254 else if _conf["Sidebar"] is "minimal" then 27 else 0}px;
  z-index: 1;
  #{Style.agent}box-sizing: border-box;
  box-sizing: border-box;
  display: block;
}
"""
      else ""
    ) + (
      if _conf["4chan SS Navigation"]
        """
#{if ["sticky top", "sticky bottom"].contains(_conf["Pagination"]) then ".pagelist," else ""}
#boardNavDesktop {
  left: 0;
  right: 0;
  padding-#{_conf["Sidebar Location"]}: #{Style.sidebar}px;
  border-left: 0;
  border-right: 0;
  border-radius: 0 !important;
}
#delform {
  margin-top: -2px;
}
#delform,
.board,
.thread {
  padding-#{Style.sidebarLocation[0]}: 0 !important;
}
"""
      else ""
    ) + (
      {
        "at sidebar top": """
#boardTitle {
  position: fixed;
  #{Style.sidebarLocation[0]}: 2px;
  top: #{(if Style.logoOffset is 0 and _conf["Icon Orientation"] isnt "vertical" then 40 else 21) + Style.logoOffset}px;
  width: #{width}px;
}\n
"""
        "at sidebar bottom": """
#boardTitle {
  position: fixed;
  #{Style.sidebarLocation[0]}: 2px;
  bottom: 280px;
  width: #{width}px;
}\n
"""
        "under post form": """
#boardTitle {
  position: fixed;
  #{Style.sidebarLocation[0]}: 2px;
  bottom: 140px;
  width: #{width}px;
}\n
"""
        "at top": ""
        "hide": """
#boardTitle {
  display: none;
}\n
"""
      }[_conf["Board Title"]]
    ) + (
      """
.postContainer blockquote {
  margin: """ +
      {
        "phat":       '24px 60px 24px 58px;'
        "normal":     '12px 40px 12px 38px;'
        "slim":        '6px 20px  6px 23px;'
        "super slim":  '3px 10px  3px 15px;'
        "anorexia":    '1px  5px  1px 11px;'
      }[_conf["Reply Padding"]] + '\n}\n'
    ) + (
      if _conf["Rounded Edges"]
        (
          if _conf["Post Form Style"] is "float"
            """
#qr {
  border-radius: 6px 6px 0 0;
}\n
"""
          else ""
        ) + (
          switch _conf["Boards Navigation"]
            when "sticky top", "top"
              """
#boardNavDesktop {
  border-radius: 0 0 3px 3px;
}\n
"""
            when "sticky bottom"
              """
#boardNavDesktop {
  border-radius: 3px 3px 0 0;
}\n
"""
        ) + (
          switch _conf["Pagination"]
            when "sticky top", "top"
              """
.pagelist {
  border-radius: 0 0 3px 3px;
}\n
"""

            when "sticky bottom", "bottom"
              """
.pagelist {
  border-radius: 3px 3px 0 0;
}\n
"""
        ) + (
          """
.rice {
  border-radius: 2px;
}
#boardNavDesktopFoot,
#optionsContent,
#options .mascot,
#options ul,
#options,
#post-preview,
#qp,
#qp .post,
#{if _conf["Post Form Decorations"] then "#qr," else ""}
#stats,
#updater,
#watcher,
#globalMessage,
.inline .reply,
.opContainer,
.replyContainer,
.post,
h2,
td[style="border: 1px dashed;"] {
  border-radius: 3px;
}
#options .selectrice ul {
  border-radius: 0;
}
#optionsbar label[for] {
  border-radius: 3px 3px 0 0;
}
#qrtab {
  border-radius: 6px 6px 0 0;
}\n
"""
        )
      else ""
    ) + (
      {
        compact: """
#boardNavDesktopFoot {
  word-spacing: 1px;
}
#boardNavDesktopFoot:hover {
  height: #{if _conf["Slideout Transitions"] then '84px' else 'auto'};
}\n
"""
        list: """
#boardNavDesktopFoot a {
  display: block;
}
#boardNavDesktopFoot:hover {
  height: 300px;
  overflow-y: scroll;
}
#boardNavDesktopFoot a::after {
  content: " - " attr(title);
}
#boardNavDesktopFoot a[href*="//boards.4chan.org/"]::after,
#boardNavDesktopFoot a[href*="//rs.4chan.org/"]::after {
  content: "/ - " attr(title);
}
#boardNavDesktopFoot a[href*="//boards.4chan.org/"]::before,
#boardNavDesktopFoot a[href*="//rs.4chan.org/"]::before {
  content: "/";
}\n
"""
        hide: """
#boardNavDesktopFoot {
  display: none;
}\n
"""}[_conf["Slideout Navigation"]]
    ) + (
      {
        "4chan default": """
#globalMessage {
  position: static;
  background: none;
  border: none;
  margin: 0 auto;
}
#globalMessage::after {
  display: none;
}\n
"""
        "slideout": """
#globalMessage:not(:hover) {
  border-color: transparent;
  background-color: transparent;
}
#globalMessage {
  bottom: auto;
  position: fixed;
  #{Style.sidebarLocation[0]}: 0;
  #{Style.sidebarLocation[1]}: auto;
  width: #{width}px;
  height: 0;
  overflow: hidden;
  #{Style.agent}box-sizing: border-box;
  box-sizing: border-box;
}
#globalMessage:hover {
  height: #{if _conf["Slideout Transitions"] then '250px' else 'auto'};
  overflow: auto;
}\n
"""
        "hide": """
#globalMessage,
#globalMessage::after {
  display: none;
}\n
"""}[_conf["Announcements"]]
    ) + (
      {
        "sticky top": """
#boardNavDesktop {
  position: fixed;
  top: 0;
}\n
"""
        "sticky bottom": """
#boardNavDesktop {
  position: fixed;
  bottom: 0;
}\n
"""
        "top": """
#boardNavDesktop {
  position: absolute;
  top: 0;
}\n
"""
        "hide": """
#boardNavDesktop {
  position: absolute;
  top: -100px;
}\n
"""}[_conf["Boards Navigation"]]
    ) + (
      {
        "sticky top": """
.pagelist {
  position: fixed;
  top: 0;
  z-index: 94;
}\n
"""
        "sticky bottom": """
.pagelist {
  position: fixed;
  bottom: 0;
  z-index: 94;
}\n
"""
        "top": """
.pagelist {
  position: absolute;
  top: 0;
}\n
"""
        "bottom": ""
        "on side": """
.pagelist {
  padding: 0;
  top: auto;
  bottom: 269px;
  #{Style.sidebarLocation[1]}: auto;
  #{(if Style.sidebarLocation[0] is "left" then "left: 0" else "right: " + (250 + Style.sidebarOffset.W) + "px")};
  position: fixed;
  #{Style.agent}transform: rotate(90deg);
  #{Style.agent}transform-origin: bottom right;
  z-index: 6;
  margin: 0;
  background: none transparent;
  border: 0 none;
}\n
"""
        "hide": """
.pagelist {
  display: none;
}\n
"""}[_conf["Pagination"]]
    ) + (
      {
        "fixed": """
#qrtab {
  display: none;
}
#qr {
  #{Style.sidebarLocation[0]}: 0 !important;
  #{Style.sidebarLocation[1]}: auto !important;
}\n
"""
        "slideout": """
#qrtab {
  display: none;
}
#qr {
  #{Style.sidebarLocation[0]}: -#{233 + Style.sidebarOffset.W}px !important;
  #{Style.sidebarLocation[1]}: auto !important;
}
#qr:hover,
#qr.focus,
#qr.dump {
  #{Style.sidebarLocation[0]}: 2px !important;
  #{Style.sidebarLocation[1]}: auto !important;
}\n
"""
        "tabbed slideout": """
#qrtab input,
#qrtab .rice,
#qrtab span {
  display: none;
}
#qr {
  #{Style.sidebarLocation[0]}: -#{251 + Style.sidebarOffset.W}px !important;
  #{Style.sidebarLocation[1]}: auto !important;
}
#qr:hover,
#qr.focus,
#qr.dump {
  #{Style.sidebarLocation[0]}: 0 !important;
  #{Style.sidebarLocation[1]}: auto !important;
}
#qr #qrtab {
  #{Style.agent}transform: rotate(#{(if Style.sidebarLocation[0] is "left" then "" else "-")}90deg);
  #{Style.agent}transform-origin: bottom #{Style.sidebarLocation[0]};
  position: fixed;
  bottom: 220px;
  #{Style.sidebarLocation[0]}: 0;
  width: 110px;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  border-width: 1px 1px 0 1px;
  cursor: default;
  text-rendering: optimizeLegibility;
}
#qr:hover #qrtab,
#qr.focus #qrtab,
#qr.dump #qrtab {
  opacity: 0;
  #{Style.sidebarLocation[0]}: #{252 + Style.sidebarOffset.W}px;
  #{Style.agent}transition: opacity .3s linear, #{Style.sidebarLocation[0]} .3s linear;
}\n
"""
        "transparent fade": """
#qrtab {
  display: none;
}
#qr {
  #{Style.sidebarLocation[0]}: 2px !important;
  #{Style.sidebarLocation[1]}: auto !important;
  opacity: 0.2;
  #{Style.agent}transition: opacity .3s ease-in-out 1s;
}
#qr:hover,
#qr.focus,
#qr.dump {
  opacity: 1;
  #{Style.agent}transition: opacity .3s linear;
}\n
"""
        "float": """
#qr {
  z-index: 103;
}
#qr > .move,
#qr textarea {
  min-width: 300px;
}
#qr .captchaimg {
  max-width: 100%;
  overflow: hidden;
}
.autohide:not(:hover) > form {
  display: none !important;
}
textarea.field,
#qr input[title="Verification"] {
  width: 100%;
}
#dump {
  width: 10%;
}
#qr .userInfo .field:not(#dump) {
  width: 30%;
}
#buttons input {
  width: 25%;
}
#file {
  width: 75%;
}
#qr.captcha textarea.field {
  min-height: 120px;
}
#qr textarea.field {
  min-height: 160px;
  resize: resize;
  #{Style.agent}transition:
    color 0.25s linear,
    background-color 0.25s linear,
    background-image 0.25s linear,
    border-color 0.25s linear,
    height step-end,
    width step-end;
  margin: 0;
}\n
"""}[_conf["Post Form Style"]]
    ) + (
      {
        "at sidebar top": """
.boardBanner {
  position: fixed;
  top: 18px;
  #{Style.sidebarLocation[0]}: 2px;
}
.boardBanner img {
  width: #{width}px;
}\n
"""
        "at sidebar bottom": """
.boardBanner {
  position: fixed;
  bottom: 270px;
  #{Style.sidebarLocation[0]}: 2px;
}
.boardBanner img {
  width: #{width}px;
}\n
"""
        "under post form": """
.boardBanner {
  position: fixed;
  bottom: 130px;
  #{Style.sidebarLocation[0]}: 2px;
}
.boardBanner img {
  width: #{width}px;
}\n
"""
        "at top": """
.boardBanner {
  position: relative;
  display: table;
  margin: 0 auto;
  text-align: center;
  z-index: -1;
}\n
"""
        "hide": """
.boardBanner {
  display: none;
}\n
"""}[_conf["4chan Banner"]]
    ) + (
      {
        'lower left': """
.container {
  padding: 0 5px;
  max-width: 100%;
}
.post.quoted {
  padding-bottom: 15px;
}
.post .container {
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 0 5px;
}
.post .container::before {
  content: "REPLIES: ";
}
.inline .container {
  position: static;
  max-width: 100%;
}
.inline .container::before {
  content: "";
}\n
"""
        'lower right': """
.post.quoted {
  padding-bottom: 15px;
}
.op .container {
  float: right;
}
.post .container {
  position: absolute;
  right: 0;
  bottom: 0;
}
.container::before {
  content: "REPLIES: ";
}
.container {
  max-width: 100%;
  padding: 0 5px;
}
.inline .container {
  position: static;
  float: none;
}
.inline .container::before {
  content: "";
}\n
"""
        'default': ""
      }[_conf["Backlinks Position"]]) + (if _conf["Custom CSS"] then _conf["customCSS"] else "")