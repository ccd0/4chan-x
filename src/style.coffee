  css: (theme) ->

    position =
      if Conf["Sidebar Location"] is "right"
        switch Conf["Sidebar"]
          when "hide"
            switch Conf["Page Margin"]
              when "none", "minimal", "small"
                "right"
              else
                "left"
          when "minimal"
            "right"
          else
            "left"
      else
        switch Conf["Page Margin"]
          when "none", "minimal", "small"
            "right"
          else
            "left"

    icons =
      Icons.header.png + Icons.themes[Conf["Icons"]][if theme["Dark Theme"] then "dark" else "light"]

    if Conf["Sidebar"] is "large"
      Style.sidebarOffsetW = 51
      Style.sidebarOffsetH = 17
    else
      Style.sidebarOffsetW = 0
      Style.sidebarOffsetH = 0
    
    Style.logoOffset = if Conf["4chan Banner"] is "at sidebar top" then 83 + Style.sidebarOffsetH else 0

    if Conf["Sidebar Location"] is "left"
      Style.sidebarLocation = ["left",  "right"]
    else
      Style.sidebarLocation = ["right", "left" ]

    if Conf['editMode'] is "theme"
      pagemargin = 300
    else
      switch Conf["Page Margin"]
        when "none"
          pagemargin = 2
        when "minimal"
          pagemargin = 20
        when "small"
          pagemargin = 50
        when "medium"
          pagemargin = 150
        when "fully centered"
          pagemargin = 252 + Style.sidebarOffsetW
        when "large"
          pagemargin = 350

    if Conf["Sidebar"]  is "minimal"
      sidebar = 20

    else if Conf["Sidebar"] != "hide"
      sidebar = (252 + Style.sidebarOffsetW)

    else
      sidebar = pagemargin

    switch Conf["Reply Spacing"]
      when "none"
        Style.replyMargin = 0

      when "minimal"
        Style.replyMargin = 1

      when "small"
        Style.replyMargin = 2

      when "medium"
        Style.replyMargin = 4

      when "large"
        Style.replyMargin = 8

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
.hide_thread_button:not(.hidden_thread) {
  padding: 0 5px;
  float: left;
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
  background-color: #{theme["Links"]};
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
  border-bottom: 1px solid;
  display: block;
  clear: both;
  text-decoration: none;
}
#menu {
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
div.subMenu.reply {
  padding: 0;
  position: absolute;
  #{position}: 100%;
  top: -1px;
}
#boardTitle,
#main_tab + div,
#mascotConf input,
#style_tab + div .suboptions,
.center,
h1 {
  text-align: center;
}
#mascotConf input::#{Style.agent}placeholder {
  text-align: center;
}
#mascotConf input:#{Style.agent}placeholder {
  text-align: center;
}
#boardNavDesktopFoot,
#qr .warning,
#qr > .move,
#threadselect select,
.field,
.file,
.postInfo,
.thumbnail,
div.post,
div.post.highlight,
input,
input[type="submit"] {
  #{Style.agent}box-sizing: border-box;
  box-sizing: border-box;
}
#updater .move,
#qr > .move {
  overflow: hidden;
  padding: 0 2px;
}
#credits,
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
  height: 90px; width: 90px;
  margin: 5px; padding: 2px;
  opacity: .5;
  outline: none;
  overflow: hidden;
  position: relative;
  text-shadow: 0 1px 1px #000;
  #{Style.agent}transition: opacity .25s ease-in-out;
  vertical-align: top;
}
.thumbnail:hover,
.thumbnail:focus {
  opacity: .9;
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
.fitwidth img[data-md5] + img {
  max-width: 100%;
}
#style_tab + div select,
.fitwidth img[data-md5] + img,
.themevar .field,
.themevar textarea {
  width: 100%;
}
.themevar .colorfield {
  width: 90%;
  border-right-width: 0px;
}
.themevar .color {
  width: 10%;
  color: transparent;
  border-left-width: 0px;
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
  padding: 5px;
  width: auto;
  left: 15%;
  right: 15%;
  top: 15%;
  bottom: 15%;
}
#options h3 {
  margin: 0;
}
#theme_tab + div h1 {
  opacity: 0;
}
#theme_tab + div div.selectedtheme h1 {
  right: 11px;
  opacity: 1;
}
#theme_tab + div > div h1 {
  position: absolute;
  right: 300px;
  bottom: 10px;
  margin: 0;
  #{Style.agent}transition: all .2s ease-in-out;
}
#theme_tab + div > div:not(.stylesettings) {
  margin-bottom: 3px;
}
#options ul li {
  overflow: auto;
  padding: 0 5px 0 7px;
}
#options ul li:nth-of-type(2n+1) {
  background-color: rgba(0, 0, 0, 0.05)
}
#rice_tab + div input {
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
#options .option {
  width: 50%;
  display: inline-block;
}
#options .option .optionlabel {
  padding-left: 18px;
}
#options .mascots {
  padding: 0;
  text-align: center;
}
#options .mascot,
#options .mascot > div:first-child {
  overflow: hidden;
  display: inline-block;

}
#options .mascot {
  position: relative;
  width: 200px;
  padding: 3px;
  height: 250px;
  margin: 5px;
  text-align: left;
  border: 1px solid transparent;
}
#options .mascot > div:first-child {
  border: 0;
  margin: 0;
  max-height: 250px;
  cursor: pointer;
  position: absolute;
  bottom: 0;
}
#options .mascot img {
  max-width: 200px;
  image-rendering: optimizeQuality;
  vertical-align: top;
}
#options ul li.mascot {
  background-color: transparent;
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
#content {
  overflow: auto;
  position: absolute;
  top:    1.7em;
  right:  5px;
  bottom: 5px;
  left:   5px;
}
#style_tab + div .suboptions ul,
#main_tab + div ul {
  display: inline-block;
  vertical-align: top;
  margin: 0 3px 6px;
}
#style_tab + div .suboptions ul li,
#main_tab + div ul li {
  text-align: left;
}
#style_tab + div .suboptions ul {
  width: 370px;
}
#main_tab + div ul {
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
.suboptions {
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
#upload {
  position: absolute;
  width: 100px;
  left: 50%;
  margin-left: -50px;
  text-align: center;
  bottom: 0;
}
#content textarea {
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
}
#watcher:not(:hover) {
  max-height: 200px;
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
div.opContainer {
  display: block;
}
.opContainer.filter_highlight {
  box-shadow: inset 5px 0 #{theme["Backlinked Reply Outline"]};
}
.filter_highlight > .reply {
  box-shadow: -5px 0 #{theme["Backlinked Reply Outline"]};
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
::#{Style.agent}selection {
  background: #{theme["Text"]};
  color: #{theme["Background Color"]};
}
#copyright,
#boardNavDesktop a,
#options ul,
#qr,
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
  margin-#{Style.sidebarLocation[0]}: #{sidebar}px;
  margin-#{Style.sidebarLocation[1]}: #{pagemargin}px;
}
#exlinks-options > *,
html,
body,
a,
body,
input,
select,
textarea {
  font-family: '#{Conf["Font"]}';
}
#qr .captchaimg {
  opacity: #{Conf["Captcha Opacity"]};
  background-color: #fff;
}
#boardNavDesktopFoot a[href*="//boards.4chan.org/"]::after,
#boardNavDesktopFoot a[href*="//boards.4chan.org/"]::before,
#boardNavDesktopFoot a,
.container::before,
.fileText span:not([class])::after,
a,
body,
input,
select,
textarea {
  font-size: #{parseInt(Conf["Font Size"], 10)}px;
}
.boardSubtitle,
.boardSubtitle a {
  font-size: #{parseInt(Conf["Font Size"], 10) - 1}px;
}
/* Cleanup */
#absbot,
#autohide,
#content > [name=tab]:not(:checked) + div,
#delform > hr,
#imgControls label:first-of-type input,
#imgControls .rice,
#logo,
#navbotright,
#postForm,
#postPassword + span,
#qr:not(.dump) #replies,
#qp .rice
#qp input,
#{unless Conf["Hide Show QR"] then "#showQR," else ""}
#updater:not(:hover) > :not(.move),
#{unless Conf["Board Subtitle"] then ".boardSubtitle," else ""}
.deleteform,
.dump > form > label,
.fileText:hover .fntrunc,
.fileText:not(:hover) .fnfull,
.forwarded,
.hasSubMenu:not(.focused) > .subMenu,
.hidden_thread > .summary,
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
.sideArrows:not(.hide_reply_button),
.stub ~ *,
.stylechanger,
.thread > .hidden_thread ~ *,
.warnicon,
.warning:empty,
[hidden],
body > .postingMode ~ #delform hr,
body > br,
body > div[style^="text-align"],
body > hr,
body > script + hr + div,
div.reply[hidden],
html body > span[style="left: 5px; position: absolute;"]:nth-of-type(0),
table[style="text-align:center;width:100%;height:300px;"] {
  display: none !important;
}
#mascot img,
#replies,
#spoilerLabel,
.captchaimg,
.sideArrows,
.sideArrows a,
.menu_button,
.move {
  user-select: none;
  #{Style.agent}user-select: none;
}
div.post > blockquote .prettyprint span {
  font-family: monospace;
}
div.post div.file .fileThumb {
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
.quotelink.deadlink,
.sideArrows a {
  text-decoration: none;
}
#watcher > .move,
.backlink:not(.filtered),
a,
span.postNum > .replylink {
  text-decoration: #{if Conf["Underline Links"] then "underline" else "none"};
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
#options.reply.dialog,
#themeConf {
  z-index: 998;
}
#qp {
  z-index: 104;
}
#ihover,
#overlay,
#updater:hover,
.exPopup,
html .subMenu {
  z-index: 102;
}
#navtopright .exlinksOptionsLink::after,
#navtopright .settingsWindowLink::after {
  z-index: 101;
}
#imgControls {
  z-index: 100;
}
#autoPagerBorderPaging,
#boardNavDesktop,
#menu.reply.dialog,
#navlinks,
body > a[style="cursor: pointer; float: right;"]::after {
  z-index: 94;
}
.fileThumb img + img {
  position: relative;
  z-index: #{(if Conf["Images Overlap Post Form"] then "90" else "1")};
}
#stats,
#updater {
  z-index: 10;
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
.sideArrows a {
  z-index: 4;
}
#globalMessage::after,
.boardBanner,
.replyhider a {
  z-index: 1;
}
div.post,
div.post.highlight {
  z-index: 0;
}
#navtopright .exlinksOptionsLink::after,
#navtopright .settingsWindowLink::after,
div.navLinks > a:first-of-type::after,
#watcher::after,
#globalMessage::after,
#boardNavDesktopFoot::after,
body > a[style="cursor: pointer; float: right;"]::after,
#imgControls label:first-of-type::after {
  position: fixed;
  display: block;
  width: 15px;
  height: 15px;
  content: " ";
  overflow: hidden;
  background-image: url('#{icons}');
  opacity: 0.5;
}
#navtopright .settingsWindowLink::after {
  background-position: 0 0;
}
div.navLinks > a:first-of-type::after {
  background-position: 0 -15px;
}
#watcher::after {
  background-position: 0 -30px;
}
#globalMessage::after {
  background-position: 0 -45px;
}
#boardNavDesktopFoot::after {
  background-position: 0 -60px;
}
body > a[style="cursor: pointer; float: right;"]::after {
  background-position: 0 -75px;
}
#imgControls label:first-of-type::after {
  position: static;
  background-position: 0 -90px;
}
#navtopright .exlinksOptionsLink::after {
  background-position: 0 -105px;
}
#boardNavDesktopFoot:hover::after,
#globalMessage:hover::after,
#imgControls label:hover:first-of-type::after,
#navlinks a:hover,
#navtopright .settingsWindowLink:hover::after,
#navtopright .exlinksOptionsLink:hover::after,
#qr #qrtab,
#watcher:hover::after,
.thumbnail#selected,
body > a[style="cursor: pointer; float: right;"]:hover::after,
div.navLinks > a:first-of-type:hover::after {
  opacity: 1;
}
#boardTitle,
.boardTitle > a {
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
  border-bottom: 1px solid #{theme["Reply Border"]};
}
.boxcontent > hr,
.entry:last-child,
a.forwardlink,
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
#{(if Conf["Custom Navigation"] then "" else "#boardNavDesktop")} {
  font-size: 0;
  color: transparent;
  word-spacing: 2px;
}
.pages {
  text-align: #{Conf["Pagination Alignment"]};
}
#boardNavDesktop {
  text-align: #{Conf["Navigation Alignment"]};
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
  width: #{(248 + Style.sidebarOffsetW)}px !important;
  overflow: hidden;
}
img.topad,
img.middlead,
img.bottomad {
  opacity: 0.3;
}
img.topad:hover,
img.middlead:hover,
img.bottomad:hover {
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
  font-size: #{parseInt(Conf["Font Size"], 10) + 3}px;
}
.pages strong,
a,
.new {
  #{Style.agent}transition: background .1s linear;
}
/* Post Form */
#qr div.captchainput,
#file {
  overflow: hidden;
}
/* Formatting for all postarea elements */
#file {
  line-height: 17px;
}
#file,
#threadselect select {
  cursor: pointer;
  display: inline-block;
}
#threadselect select,
input:not([type=radio]),
.field,
input[type="submit"] {
  height: 20px;
}
#qr .warning {
  min-height: 20px;
}
#qr .warning,
#threadselect select,
input,
.field,
input[type="submit"] {
  vertical-align: bottom;
  padding: 1px;
}
input[type="submit"] {
  height: 20px;
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
div.post div.postInfo {
  padding: 3px 0 0 8px;
  display: block !important;
  width: auto;
}
div.file {
  padding-left: 8px;
}
.postContainer blockquote {
  min-height: #{parseInt(Conf["Font Size"], 10) + 3}px;
}
.fileText ~ a > img + img {
  margin: 0 0 25px;
  position: relative;
  top: 0px;
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
/* Fixes text spoilers */
.spoiler:not(:hover),
.spoiler:not(:hover) * {
  color: rgb(0,0,0) !important;
  background-color: rgb(0,0,0) !important;
  text-shadow: none !important;
}
div.thread {
  padding: 0;
  position: relative;
  #{(unless Conf['Images Overlap Post Form'] then "z-index: 0;" else "")}
}
div.post {
  margin: 0;
}
/* Remove default "inherit" background declaration */
.span.subject,
.subject,
.name,
.postertrip {
  background: transparent;
}
#showQR,
.name {
  font-weight: 700;
}
#navtopright {
  position: fixed;
  bottom: -1000px;
  left: -1000px;
}
/* Expand Images */
#imgControls {
  width: 15px;
  height: 20px;
  overflow: hidden;
}
#imgContainer {
  width: 110px;
  float: #{Style.sidebarLocation[0]};
}
#imgControls:hover {
  width: 110px;
}
#imgControls label {
  font-size: 0;
  color: transparent;
  float: #{Style.sidebarLocation[0]};
}
#imgControls select {
  float: #{Style.sidebarLocation[1]};
}
#imgControls select > option {
  font-size: 80%;
}
/* Reply Previews */
#mouseover,
#qp {
  max-width: 70%;
}
#qp .replyContainer,
#qp .opContainer {
  visibility: visible;
}
#qp div.op {
  display: table;
}
#qp div.post img {
  max-width: 300px;
  height: auto;
}
.inline div.post,
#qp div.post {
  padding-bottom: 0 !important;
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
#prefetch {
  position: fixed;
}
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
#options .move,
#updater .move,
#watcher .move,
#stats .move {
  cursor: default !important;
}
/* 4sight */
body > a[style="cursor: pointer; float: right;"] {
  position: fixed;
  top: -1000px;
  left: -1000px;
}
body > a[style="cursor: pointer; float: right;"] + div[style^="width: 100%;"] {
  display: block;
  position: fixed !important;
  top: 117px !important;
  #{Style.sidebarLocation[1]}: 4px !important;
  #{Style.sidebarLocation[0]}: #{(252 + Style.sidebarOffsetW)}px !important;
  width: auto !important;
  margin: 0 !important;
  z-index: 2;
}
body > a[style="cursor: pointer; float: right;"] + div[style^="width: 100%;"] > table > tbody > tr > td {
  background: #{theme["Background Color"]} !important;
  border: 1px solid #{theme["Reply Border"]} !important;
  vertical-align: top;
}
body > a[style="cursor: pointer; float: right;"] + div[style^="width: 100%;"] {
  height: 95% !important;
  margin-top: 5px !important;
  margin-bottom: 5px !important;
}
#fs_status {
  width: auto !important;
  height: auto !important;
  background: #{theme["Dialog Background"]} !important;
  padding: 10px !important;
  white-space: normal !important;
}
#fs_data tr[style="background-color: #EA8;"] {
  background: #{theme["Reply Background"]} !important;
}
#fs_data,
#fs_data * {
  border-color: #{theme["Reply Border"]} !important;
}
#fs_status a {
  color: #{theme["Text"]} !important;
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
input[type="submit"]:hover {
  cursor: pointer;
}
#qr input:focus::#{Style.agent}placeholder,
#qr textarea:focus::#{Style.agent}placeholder {
  color: transparent;
}
#qr input:focus:#{Style.agent}placeholder,
#qr textarea:focus:#{Style.agent}placeholder {
  color: transparent;
}
#boardNavDesktop .current {
  font-weight: bold;
}
.focused.entry {
  background-color: transparent;
}
#menu.reply.dialog,
html .subMenu {
  padding: 0px;
}
.textarea {
  position: relative;
}
#qr #charCount {
  color: #{(if theme["Dark Theme"] then "rgba(255,255,255,0.7)" else "rgba(0,0,0,0.7)")};
  background: none;
  font-size: 10px;
  pointer-events: none;
  position: absolute;
  right: 2px;
  top: auto;
  bottom: 0;
  height: 20px;
}
#qr #charCount.warning {
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
  width: #{(248 + Style.sidebarOffsetW)}px;
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
  font-size: 14px;
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
html {
  background: #{theme["Background Color"] or ''};
  background-image: #{theme["Background Image"] or ''};
  background-repeat: #{theme["Background Repeat"] or ''};
  background-attachment: #{theme["Background Attachment"] or ''};
  background-position: #{theme["Background Position"] or ''};
}
#content,
#exlinks-options-content,
#mascotcontent,
#themecontent {
  background: #{theme["Background Color"]};
  border: 1px solid #{theme["Reply Border"]};
  padding: 5px;
}
.suboptions {
  padding: 5px;
}
#boardTitle,
#prefetch,
#showQR,
#spoilerLabel,
#stats,
#updater:not(:hover) .move {
  text-shadow:
     1px  1px 0 #{theme["Background Color"]},
    -1px -1px 0 #{theme["Background Color"]},
     1px -1px 0 #{theme["Background Color"]},
    -1px  1px 0 #{theme["Background Color"]},
     0px  1px 0 #{theme["Background Color"]},
     0px -1px 0 #{theme["Background Color"]},
     1px  0px 0 #{theme["Background Color"]},
    -1px  0px 0 #{theme["Background Color"]}#{if Conf["Sidebar Glow"] then "\n, 1px 0 5px #{theme['Text']};" else ";"}
}
#options .dialog,
#exlinks-options,
#qrtab,
#updater:hover,
html body span[style="left: 5px; position: absolute;"] a,
input[type="submit"],
#options.reply.dialog,
input[value="Report"] {
  background: #{theme["Buttons Background"]};
  border: 1px solid #{theme["Buttons Border"]};
}
#options ul li.mascot.enabled {
  background: #{theme["Buttons Background"]};
  border-color: #{theme["Buttons Border"]};
}
#dump,
#file,
#options input,
#threadselect select,
.dump #dump:not(:hover):not(:focus),
input,
input.field,
select,
textarea,
textarea.field {
  background: #{theme["Input Background"]};
  border: 1px solid #{theme["Input Border"]};
  color: #{theme["Inputs"]};
  #{Style.agent}transition: all .2s linear;
}
#dump:hover,
#file:hover,
input:hover,
input.field:hover,
input[type="submit"]:hover,
select:hover,
textarea:hover,
textarea.field:hover {
  background: #{theme["Hovered Input Background"]};
  border-color: #{theme["Hovered Input Border"]};
  color: #{theme["Inputs"]};
}
#dump:active,
#dump:focus,
input:focus,
input.field:focus,
input[type="submit"]:focus,
select:focus,
textarea:focus,
textarea.field:focus {
  background: #{theme["Focused Input Background"]};
  border-color: #{theme["Focused Input Border"]};
  color: #{theme["Inputs"]};
}
#mouseover,
#qp div.post,
#xupdater,
div.reply.post {
  border: 1px solid #{theme["Reply Border"]};
  background: #{theme["Reply Background"]};
}
.exblock.reply,
div.reply.post.highlight,
div.reply.post:target {
  background: #{theme["Highlighted Reply Background"]};
  border: 1px solid #{theme["Highlighted Reply Border"]};
}
#boardNavDesktop,
.pagelist {
  background: #{theme["Navigation Background"]};
  border: 1px solid #{theme["Navigation Border"]};
  #{Style.sidebarLocation[0]}: #{sidebar}px;
  #{Style.sidebarLocation[1]}: #{pagemargin}px;
}
#delform {
  background: #{theme["Thread Wrapper Background"]};
  border: 1px solid #{theme["Thread Wrapper Border"]};
}
#boardNavDesktopFoot,
#mascotConf,
#mascot_hide,
#menu,
#themeConf,
#watcher,
#watcher:hover,
div.subMenu,
body > a[style="cursor: pointer; float: right;"] ~ div[style^="width: 100%;"] > table {
  background: #{theme["Dialog Background"]};
  border: 1px solid #{theme["Dialog Border"]};
}
#boardNavDesktopFoot:not(:hover) {
  border-color: transparent;
  background-color: transparent;
}
.mascotname,
.mascotoptions {
  background: #{theme["Dialog Background"]};
}
.inline .post {
  box-shadow: #{if Conf['Quote Shadows'] then "5px 5px 5px #{theme['Shadow Color']}" else  ""};
  padding-bottom: 2px;
}
#qr .warning {
  background: #{theme["Input Background"]};
  border: 1px solid #{theme["Input Border"]};
}
[style='color: red !important;'] *,
.disabledwarning,
.warning {
  color: #{theme["Warnings"]};
}
a,
#dump,
.entry,
div.post > blockquote a[href^="//"],
.sideArrows a,
span.postNum > .replylink {
  color: #{theme["Links"]};
}
#navlinks a {
  color: rgb(#{if theme["Dark Theme"] then "230,230,230" else "130,130,130"});
  opacity: 0.5;
  display: inline-block;
  font-size: 15px;
  height: 15px;
  text-align: center;
  width: 15px;
}
.postNum a {
  color: #{theme["Post Numbers"]};
}
.subject {
  color: #{theme["Subjects"]} !important;
  font-weight: 600;
}
.dateTime {
  color: #{theme["Timestamps"]} !important;
}
#updater,
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
  color: #{theme["Text"]};
}
#exlinks-options-content > table,
#options ul {
  border-bottom: 1px solid #{theme["Reply Border"]};
  box-shadow: inset #{theme["Shadow Color"]} 0 0 5px;
}
.quote + .spoiler:hover,
.quote {
  color: #{theme["Greentext"]};
}
a.backlink {
  color: #{theme["Backlinks"]};
}
span.quote > a.quotelink,
a.quotelink {
  color: #{theme["Quotelinks"]};
}
div.subMenu,
#menu,
#qp .opContainer,
#qp .replyContainer {
  box-shadow: #{if Conf['Quote Shadows'] then "5px 5px 5px #{theme['Shadow Color']}" else ""};
}
.rice {
  cursor: pointer;
  width: 10px;
  height: 10px;
  margin: 2px 3px;
  display: inline-block;
  background: #{theme["Checkbox Background"]};
  border: 1px solid #{theme["Checkbox Border"]};
  vertical-align: bottom;
}
#qr label input,
#updater input,
.bd {
  background: #{theme["Buttons Background"]};
  border: 1px solid #{theme["Buttons Border"]};
}
.pages a,
#boardNavDesktop a {
  color: #{theme["Navigation Links"]};
}
input[type=checkbox]:checked + .rice {
  background: #{theme["Checkbox Checked Background"]};
  background-image: url(#{(if theme["Dark Theme"] then Icons.header.png + "AkAAAAJCAMAAADXT/YiAAAAWlBMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9jZLFEAAAAHXRSTlMAgVHwkF11LdsM9vm9n5x+ye0qMOfk/GzqSMC6EsZzJYoAAABBSURBVHheLcZHEoAwEMRArcHknNP8/5u4MLqo+SszcBMwFyt57cFXamjV0UtyDBotIIVFiiAJ33aijhOA67bnwwuZdAPNxckOUgAAAABJRU5ErkJggg==" else Icons.header.png + "AkAAAAJCAMAAADXT/YiAAAAWlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACLSV5RAAAAHXRSTlMAgVHwkF11LdsM9vm9n5x+ye0qMOfk/GzqSMC6EsZzJYoAAABBSURBVHheLcZHEoAwEMRArcHknNP8/5u4MLqo+SszcBMwFyt57cFXamjV0UtyDBotIIVFiiAJ33aijhOA67bnwwuZdAPNxckOUgAAAABJRU5ErkJggg==")});
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
span.postNum > .replylink:hover,
.nameBlock > .useremail > .name:hover,
.nameBlock > .useremail > .postertrip:hover {
  color: #{theme["Hovered Links"]};
}
#boardNavDesktop a:hover,
#boardTitle a:hover {
  color: #{theme["Hovered Navigation Links"]};
}
#boardTitle {
  color: #{theme["Board Title"]};
}
.name {
  color: #{theme["Names"]} !important;
}
.postertrip,
.trip {
  color: #{theme["Tripcodes"]} !important;
}
.nameBlock > .useremail > .postertrip,
.nameBlock > .useremail > .name {
  color: #{theme["Emails"]};
}
.nameBlock > .useremail > .name,
.name {
  font-weight: 600;
}
a.forwardlink {
  border-bottom: 1px dashed;
}
div.post.qphl {
  border-color: #{theme["Backlinked Reply Outline"]};
}
.placeholder,
#qr input::#{Style.agent}placeholder,
#qr textarea::#{Style.agent}placeholder {
  color: #{(if theme["Dark Theme"] then "rgba(255,255,255,0.2)" else "rgba(0,0,0,0.3)")} !important;
}
.placeholder,
#qr input:#{Style.agent}placeholder,
#qr textarea:#{Style.agent}placeholder {
  color: #{(if theme["Dark Theme"] then "rgba(255,255,255,0.2)" else "rgba(0,0,0,0.3)")} !important;
}
.boxcontent dd,
#options ul {
  border-color: #{(if theme["Dark Theme"] then "rgba(255,255,255,0.1)" else "rgba(0,0,0,0.1)")};
}
#options li {
  border-top: 1px solid #{(if theme["Dark Theme"] then "rgba(255,255,255,0.025)" else "rgba(0,0,0,0.05)")};
}
#mascot img {
  #{Style.agent}transform: scaleX(#{(if Style.sidebarLocation[0] is "left" then "-" else "")}1);
}
#{theme["Custom CSS"]}\n
""" + (
      if Conf["Image Expansion"]
        """
.fileThumb img {
  cursor: #{Style.agent}zoom-in;
}
.fileThumb img + img {
  cursor: #{Style.agent}zoom-out;
}\n
"""
      else ""
    ) + (
      if Conf["Recursive Filtering"]
        """
.hidden + .threadContainer {
  display: none;
}\n
"""
      else ""
    ) + (
      if Conf["Reply Spacing"] is "none"
        """
.thread > .replyContainer:not(:last-of-type) .post.reply:not(:target) {
  border-bottom-width: 0;
}\n
"""
      else ""
    ) + (
      if theme["Dark Theme"]
        """
.prettyprint {
  background-color: rgba(0,0,0,.1);
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
}\n
"""
      else
        """
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
}\n
"""
    ) + (
      if Conf["Faded 4chan Banner"]
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
      if Conf["4chan Banner Reflection"]
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
      if Conf["Slideout Transitions"]
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
}
#imgControls {
  #{Style.agent}transition: width .2s linear;
}\n
"""
      else ""
    ) + (
      if Conf["Hide Horizontal Rules"]
        """
hr {
  visibility: hidden;
}\n
"""
      else ""
    ) + (
      unless Conf["Post Form Style"] is "float"
        """
#qr img {
  height: 47px;
  width: #{(248 + Style.sidebarOffsetW)}px;
}
#threadselect {
  position: absolute;
  bottom: 100%;
  left: 0;
}
#spoilerLabel {
  position: absolute;
  bottom: 100%;
  right: 0;
}
#threadselect select {
  margin-top: 0;
}
input[title="Verification"] {
  width: 100%;
}
textarea.field,
#qr > form > div {
  width: #{(248 + Style.sidebarOffsetW)}px;
}
#qr {
  overflow: visible;
  top: auto !important;
  bottom: 22px !important;
  width: #{(248 + Style.sidebarOffsetW)}px;
  margin: 0;
  z-index: 5 !important;
  background-color: transparent !important;
}
input[title="Verification"],
.captchaimg img {
  margin-top: 1px;
}
#qr .warning,
#threadselect select,
input,
.field {
  margin: 1px 0 0;
}
#file {
  width: #{(177 + Style.sidebarOffsetW)}px;
}
#buttons input {
  width: 70px;
  margin: 1px 0 0 1px;
}""" + (
          if Conf["Compact Post Form Inputs"] then """
#qr textarea.field {
  height: 184px;
  min-height: 184px;
  min-width: #{248 + Style.sidebarOffsetW}px;
}
#qr.captcha textarea.field {
  height: 114px;
  min-height: 114px;
}
#qr .field[name="name"],
#qr .field[name="email"],
#qr .field[name="sub"] {
  width: #{(75 + (Style.sidebarOffsetW / 3))}px !important;
  margin-left: 1px !important;
}\n
"""
          else
            """
#qr textarea.field {
  height: 158px;
  min-height: 158px;
  min-width: #{248 + Style.sidebarOffsetW}px
}
#qr.captcha textarea.field {
  height: 88px;
  min-height: 88px;
}
#qr .field[name="email"],
#qr .field[name="sub"] {
  width: #{(248 + Style.sidebarOffsetW)}px !important;
}
#qr .field[name="name"] {
  width: #{(227 + Style.sidebarOffsetW)}px !important;
  margin-left: 1px !important;
}
#qr .field[name="email"],
#qr .field[name="sub"] {
  margin-top: 1px;
}\n
"""
        ) + (
          if Conf["Textarea Resize"] is "auto-expand"
            """
#qr textarea {
  display: block;
  #{Style.agent}transition:
    color 0.25s linear,
    background-color 0.25s linear,
    background-image 0.25s linear,
    height step-end,
    width #{if Conf["Slideout Transitions"] then ".3s ease-in-out .3s" else "step-end"};
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
  resize: #{Conf["Textarea Resize"]}
}\n
"""
        )
      else ""  
    ) + (
      if Conf["Fit Width Replies"]
        """
.thread .replyContainer {
  position: relative;
  clear: both;
  display: table;
  width: 100%;
}
.replyContainer div.reply.post {
  display: table;
  width: 100%;
  height: 100%
}
.sideArrows a,
.menu_button {
  position: absolute;
  right: 6px;
  top: 2px;
  font-size: 9px;
}
.sideArrows a {
  #{if Conf["Menu"] then "right: 27px;" else ""}
}
.summary {
  padding-left: 20px;
  clear: both;
}
.sideArrows {
  width: 0;
}
.sideArrows a,
.menu_button {
  opacity: 0;
  #{Style.agent}transition: opacity .3s ease-out 0s;
}
div.op:hover .menu_button,
.replyContainer:hover div.reply .menu_button,
.replyContainer:hover .sideArrows a {
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
.sideArrows {
  padding: 3px;
  float: left;
}
div.reply.post {
  position: relative;
  overflow: visible;
  display: table;
  
}\n
"""
    ) + (
      if Conf['Force Reply Break']
        """
.summary,
.replyContainer {
  clear: both;
}\n
"""
      else ""
    ) + (
      if Conf["Alternate Post Colors"]
        """
div.replyContainer:not(.hidden):nth-of-type(2n+1) div.post {
  background-image: #{Style.agent}linear-gradient(#{(if theme["Dark Theme"] then "rgba(255,255,255,0.02), rgba(255,255,255,0.02)" else "rgba(0,0,0,0.05), rgba(0,0,0,0.05)")});
}\n
"""
      else ""
    ) + (
      if Conf["Color Reply Headings"]
        """
.postInfo {
  background: #{if (replyHeading = new Style.color Style.colorToHex theme["Reply Background"]) then "rgb(" + (replyHeading.shiftRGB 16, true) + ")" else (if theme["Dark Theme"] then "rgba(255,255,255,0.05)" else "rgba(0,0,0,0.1)")};
}\n"""
      else ""
    ) + (
      if Conf["Color File Info"]
        """
.file {
  background: #{if (fileHeading = new Style.color Style.colorToHex theme["Reply Background"]) then "rgb(" + (fileHeading.shiftRGB 8, true) + ")" else (if theme["Dark Theme"] then "rgba(255,255,255,0.05)" else "rgba(0,0,0,0.1)")};
}\n"""
      else ""
    ) + (
      if Conf["Filtered Backlinks"]
       """
.filtered.backlink {
  display: none;
}\n
"""
      else ""
    ) + (
      if Conf["Slideout Watcher"]
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
  width: #{(248 + Style.sidebarOffsetW)}px !important;
  overflow: hidden;
  #{Style.agent}box-sizing: border-box;
  box-sizing: border-box;
  padding: 0 10px;
}
#watcher:hover {
  height: 250px;
  padding-bottom: 4px;
}\n
"""
      else
        """
#watcher::after {
  display: none;
}
#watcher {
  width: #{(246 + Style.sidebarOffsetW)}px;
  padding-bottom: 4px;
  z-index: 96;
}
#watcher > .move {
  cursor: pointer !important;
}\n
"""
    ) + (
      if Conf["OP Background"]
        """
.opContainer div.post {
  background: #{theme["Reply Background"]};
  border: 1px solid #{theme["Reply Border"]};
  padding: 5px;
  #{Style.agent}box-sizing: border-box;
  box-sizing: border-box;
}
.opContainer div.post:target
.opContainer div.post.highlight {
  background: #{theme["Highlighted Reply Background"]};
  border: 1px solid #{theme["Highlighted Reply Border"]};
}\n
"""
      else ""
    ) + (
      if Conf["Tripcode Hider"]
        """
input.field.tripped:not(:hover):not(:focus) {
  color: transparent !important;
  text-shadow: none !important;
}\n
"""
      else ""
    ) + (
      if Conf["Block Ads"]
        """
/* AdBlock Minus */
a[href*="jlist"],
img[src^="//static.4chan.org/support/"] {
  display: none;
}\n
"""
      else ""
    ) + (
      unless Conf["Emoji"] is "disable"
        Style.emoji Conf["Emoji Position"]
      else ""
    ) + (
      if Conf["4chan SS Emulation"]
        background = new Style.color Style.colorToHex theme["Background Color"]
        """
body::before {
  background: none repeat scroll 0% 0% rgba(#{background.shiftRGB -18}, 0.8);
  border-#{Style.sidebarLocation[1]}: 2px solid #{theme["Background Color"]};
  box-shadow: 
    #{if Conf["Sidebar Location"] is "right" then "inset" else ""}  1px 0px 0px #{theme["Thread Wrapper Border"]},
    #{if Conf["Sidebar Location"] is "left"  then "inset" else ""} -1px 0px 0px #{theme["Thread Wrapper Border"]};
  content: "";
  position: fixed;
  top: 0;
  bottom: 0;
  #{Style.sidebarLocation[0]}: 0;
  width: #{if Conf["Sidebar"] is "large" then 305 else if Conf["Sidebar"] is "normal" then 254 else if Conf["Sidebar"] is "minimal" then 27 else 0}px;
  z-index: 1;
  #{Style.agent}box-sizing: border-box;
  box-sizing: border-box;
  display: block;
}
#{if Conf["Pagination"] is "sticky top" or Conf["Pagination"] is "sticky bottom" then ".pagelist," else ""}
#boardNavDesktop {
  left: 0;
  right: 0;
  padding-#{Conf["Sidebar Location"]}: #{sidebar}px;
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
      switch Conf["Board Title"]
        when "at sidebar top"
          """
#boardTitle {
  position: fixed;
  #{Style.sidebarLocation[0]}: 2px;
  top: #{(if Style.logoOffset is 0 and Conf["Icon Orientation"] isnt "vertical" then 40 else 21) + Style.logoOffset}px;
  width: #{248 + Style.sidebarOffsetW}px;
}\n
"""
        when "at sidebar bottom"
          """
#boardTitle {
  position: fixed;
  #{Style.sidebarLocation[0]}: 2px;
  bottom: 280px;
  width: #{(248 + Style.sidebarOffsetW)}px;
}\n
"""
        when "under post form"
          """
#boardTitle {
  position: fixed;
  #{Style.sidebarLocation[0]}: 2px;
  bottom: 140px;
  width: #{(248 + Style.sidebarOffsetW)}px;
}\n
"""
        when "at top"
          ""
        when "hide"
          """
#boardTitle {
  display: none;
}\n
"""
    ) + (
      switch Conf["Reply Padding"]
        when "phat"
          """
.postContainer blockquote {
  margin: 24px 60px 24px 58px;
}\n
"""
        when "normal"
          """
.postContainer blockquote {
  margin: 12px 40px 12px 38px;
}\n
"""
        when "slim"
          """
.postContainer blockquote {
  margin: 6px 20px 6px 23px;
}\n
"""
        when "super slim"
          """
.postContainer blockquote {
  margin: 3px 10px 3px 15px;
}\n
"""
        when "anorexia"
          """
.postContainer blockquote {
  margin: 1px 5px 1px 11px;
}\n
"""
    ) + (
      if Conf["Rounded Edges"]
        (
          if Conf["Post Form Style"] is "float"
            """
#qr {
  border-radius: 6px 6px 0 0;
}\n
"""
          else ""
        ) + (
          switch Conf["Boards Navigation"]
            when "sticky top", "top"
              """
#boardNavDesktop {
  border-radius: 0 0 3px 3px;
}\n
"""
            when "sticky bottom", "bottom"
              """
#boardNavDesktop {
  border-radius: 3px 3px 0 0;
}\n
"""
        ) + (
          switch Conf["Pagination"]
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
#content,
#options .mascot,
#options ul,
#options,
#qp,
#qp div.post,
#stats,
#updater,
#watcher,
#globalMessage,
.inline div.reply,
div.opContainer,
div.replyContainer,
div.post,
h2,
td[style="border: 1px dashed;"] {
  border-radius: 3px;
}
.reply .postInfo {
  border-radius: 3px 3px 0 0;
}
#qrtab {
  border-radius: 6px 6px 0 0;
}
"""
        )
      else ""
    ) + (
      switch Conf["Slideout Navigation"]
        when "compact"
          """
#boardNavDesktopFoot:hover {
  height: 84px;
  word-spacing: 1px;
}\n
"""

        when "list"
          """
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
        when "hide"
          """
#boardNavDesktopFoot {
  display: none;
}\n
"""
    ) + (
      switch Conf["Sage Highlighting"]
        when "text"
          """
a.useremail[href*="sage"]:last-of-type::#{Conf["Sage Highlight Position"]},
a.useremail[href*="Sage"]:last-of-type::#{Conf["Sage Highlight Position"]},
a.useremail[href*="SAGE"]:last-of-type::#{Conf["Sage Highlight Position"]} {
  content: " (sage) ";
  color: #{theme["Sage"]};
}\n
"""
        when "image"
          """
a.useremail[href*="sage"]:last-of-type::#{Conf["Sage Highlight Position"]},
a.useremail[href*="Sage"]:last-of-type::#{Conf["Sage Highlight Position"]},
a.useremail[href*="SAGE"]:last-of-type::#{Conf["Sage Highlight Position"]} {
  content: url("#{Icons.header.png}A4AAAAOCAMAAAAolt3jAAABa1BMVEUAAACqrKiCgYIAAAAAAAAAAACHmX5pgl5NUEx/hnx4hXRSUVMiIyKwrbFzn19SbkZ1d3OvtqtpaWhcX1ooMyRsd2aWkZddkEV8vWGcpZl+kHd7jHNdYFuRmI4bHRthaV5WhUFsfGZReUBFZjdJazpGVUBnamYfHB9TeUMzSSpHgS1cY1k1NDUyOC8yWiFywVBoh1lDSEAZHBpucW0ICQgUHhBjfFhCRUA+QTtEQUUBAQFyo1praWspKigWFRZHU0F6j3E9Oz5VWFN0j2hncWONk4sAAABASDxJWkJKTUgAAAAvNC0fJR0DAwMAAAA9QzoWGhQAAAA8YytvrFOJsnlqyT9oqExqtkdrsExpsUsqQx9rpVJDbzBBbi5utk9jiFRuk11iqUR64k5Wf0JIZTpadk5om1BkyjmF1GRNY0FheFdXpjVXhz86XSp2yFJwslR3w1NbxitbtDWW5nNnilhFXTtYqDRwp1dSijiJ7H99AAAAUnRSTlMAJTgNGQml71ypu3cPEN/RDh8HBbOwQN7wVg4CAQZ28vs9EDluXjo58Ge8xwMy0P3+rV8cT73sawEdTv63NAa3rQwo4cUdAl3hWQSWvS8qqYsjEDiCzAAAAIVJREFUeNpFx7GKAQAYAOD/A7GbZVAWZTBZFGQw6LyCF/MIkiTdcOmWSzYbJVE2u1KX0J1v+8QDv/EkyS0yXF/NgeEILiHfyc74mICTQltqYXBeAWU9HGxU09YqqEvAElGjyZYjPyLqitjzHSEiGkrsfMWr0VLe+oy/djGP//YwfbeP8bN3Or0bkqEVblAAAAAASUVORK5CYII=") "  ";
  vertical-align: top;
}\n
"""
        else ""
    ) + (
      switch Conf["Announcements"]
        when "4chan default"
          """
#globalMessage {
  position: static;
  background: none;
  border: none;
  margin-top: 0px;
}
#globalMessage::after {
  display: none;
}\n
"""
        when "slideout"
          """
#globalMessage:not(:hover) {
  border-color: transparent;
  background-color: transparent;
}
#globalMessage {
  bottom: auto;
  position: fixed;
  #{Style.sidebarLocation[0]}: 2px;
  #{Style.sidebarLocation[1]}: auto;
  width: #{(248 + Style.sidebarOffsetW)}px;
  background: #{theme["Dialog Background"]};
  border: 1px solid #{theme["Dialog Border"]};
  height: 0px;
  overflow: hidden;
  #{Style.agent}box-sizing: border-box;
  box-sizing: border-box;
  padding: 0 10px;
}
#globalMessage:hover {
  height: 250px;
}\n
"""
        when "hide"
          """
#globalMessage,
#globalMessage::after {
  display: none;
}\n
"""
    ) + (
      switch Conf["Boards Navigation"]
        when "sticky top"
          """
#boardNavDesktop {
  position: fixed;
  top: 0;
}\n
"""
        when "sticky bottom"
          """
#boardNavDesktop {
  position: fixed;
  bottom: 0;
}\n
"""
        when "top"
          """
#boardNavDesktop {
  position: absolute;
  top: 0;
}\n
"""
        when "hide"
          """
#boardNavDesktop {
  position: absolute;
  top: -100px;
}\n
"""
    ) + (
      switch Conf["Pagination"]
        when "sticky top"
          """
.pagelist {
  position: fixed;
  top: 0;
  z-index: 4;
}\n
"""
        when "sticky bottom"
          """
.pagelist {
  position: fixed;
  bottom: 0;
  z-index: 4;
}\n
"""
        when "top"
          """
.pagelist {
  position: absolute;
  top: 0;
}\n
"""
        when "bottom"
          ""
        when "on side"
          """
.pagelist {
  padding: 0;
  top: auto;
  bottom: 269px;
  #{Style.sidebarLocation[1]}: auto;
  #{(if Style.sidebarLocation[0] is "left" then "left: 0" else "right: " + (250 + Style.sidebarOffsetW) + "px")};
  position: fixed;
  #{Style.agent}transform: rotate(90deg);
  #{Style.agent}transform-origin: bottom right;
  z-index: 6;
  margin: 0;
  background: none transparent;
  border: 0 none;
}\n
"""
        when "hide"
          """
.pagelist {
  display: none;
}\n
"""
    ) + (
      switch Conf["Post Form Style"]
        when "fixed"
          """
#qrtab {
  display: none;
}
#qr {
  #{Style.sidebarLocation[0]}: 2px !important;
  #{Style.sidebarLocation[1]}: auto !important;
}\n
"""

        when "slideout"
          """
#qrtab {
  display: none;
}
#qr {
  #{Style.sidebarLocation[0]}: -#{(233 + Style.sidebarOffsetW)}px !important;
  #{Style.sidebarLocation[1]}: auto !important;
}
#qr:hover,
#qr.focus,
#qr.dump {
  #{Style.sidebarLocation[0]}: 2px !important;
  #{Style.sidebarLocation[1]}: auto !important;
}\n
"""
        when "tabbed slideout"
          """
#qrtab input,
#qrtab .rice,
#qrtab span {
  display: none;
}
#qr {
  #{Style.sidebarLocation[0]}: -#{(249 + Style.sidebarOffsetW)}px !important;
  #{Style.sidebarLocation[1]}: auto !important;
}
#qr:hover,
#qr.focus,
#qr.dump {
  #{Style.sidebarLocation[0]}: 2px !important;
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
  #{Style.sidebarLocation[0]}: #{(252 + Style.sidebarOffsetW)}px;
  #{Style.agent}transition: opacity .3s linear, #{Style.sidebarLocation[0]} .3s linear;
}\n
"""
        when "transparent fade"
          """
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
        when "float"
          """
#qr {
  z-index: 103;
  border: 1px solid #{theme["Background Color"]};
  background: #{theme["Background Color"]};
  box-shadow: #{if Conf['Quote Shadows'] then "5px 5px 5px #{theme['Shadow Color']}" else  ""};
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
#qr div.userInfo .field:not(#dump) {
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
"""
    ) + (
      switch Conf["4chan Banner"]
        when "at sidebar top"
          """
.boardBanner {
  position: fixed;
  top: 18px;
  #{Style.sidebarLocation[0]}: 2px;
}
.boardBanner img {
  width: #{(248 + Style.sidebarOffsetW)}px;
}\n
"""
        when "at sidebar bottom"
          """
.boardBanner {
  position: fixed;
  bottom: 270px;
  #{Style.sidebarLocation[0]}: 2px;
}
.boardBanner img {
  width: #{(248 + Style.sidebarOffsetW)}px;
}\n
"""
        when "under post form"
          """
.boardBanner {
  position: fixed;
  bottom: 130px;
  #{Style.sidebarLocation[0]}: 2px;
}
.boardBanner img {
  width: #{(248 + Style.sidebarOffsetW)}px;
}\n
"""
        when "at top"
          """
.boardBanner {
  position: relative;
  display: table;
  margin: 0 auto;
  text-align: center;
  z-index: -1;
}\n
"""
        when "hide"
          Style.logoOffset = 0
          """
.boardBanner {
  display: none;
}\n
"""
    ) + (
      switch Conf["Backlinks Position"]
        when 'lower left'
          """
#delform .op .container {
  padding: 0 5px;
}
#delform .reply.quoted {
  padding-bottom: 15px;
}
#delform .reply .container {
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 0 5px;
}
#delform .reply .container::before {
  content: "REPLIES: ";
  color: #{theme["Timestamps"]};
}
#delform .container {
  max-width: 100%;
}
#delform .inline .container {
  position: static;
  max-width: 100%;
}
#delform .inline .container::before {
  content: "";
}\n
"""
        when 'lower right'
          """
#delform .reply.quoted {
  padding-bottom: 15px;
}
#delform .op .container {
  float: right;
  padding: 0 5px;
}
#delform .reply .container {
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 0 5px;
}
#delform .container::before {
  content: "REPLIES: ";
  color: #{theme["Timestamps"]};
}
#delform .container {
  max-width: 100%;
}
#delform .inline .container {
  position: static;
  float: none;
  max-width: 100%;
}
#delform .inline .container::before {
  content: "";
}\n
"""
        else ""
    ) + (
      switch Conf["Checkboxes"]
        when "show"
          """
input[type=checkbox] {
  display: none;
}\n
"""
        when "make checkboxes circular"
          """
input[type=checkbox] {
  display: none;
}
.rice {
  border-radius: 6px;
}\n
"""
        when "do not style checkboxes"
          """
.rice {
  display: none;
}\n
"""
        when "hide"
          """
input[type=checkbox] {
  display: none;
}\n
""" )