Style =
  init: ->
    @agent = {
      'gecko':  '-moz-'
      'webkit': '-webkit-'
      'presto': '-o-'
    }[$.engine]

    if d.head
      return @wrapper()
    @observe()

  cleanup: ->
    delete Style.init
    delete Style.observe
    delete Style.wrapper
    delete Style.cleanup

  observe: ->
    if MutationObserver
      Style.observer = new MutationObserver onMutationObserver = @wrapper
      Style.observer.observe d,
        childList: true
        subtree:   true
    else
      $.on d, 'DOMNodeInserted', @wrapper

  wrapper: ->
    if d.head
      Style.addStyle()

      if Style.observer
        Style.observer.disconnect()
      else
        $.off d, 'DOMNodeInserted', Style.wrapper

      Style.cleanup()

  emoji: (position) ->
    _conf = Conf
    css = []
    margin = "margin-#{if position is "before" then "right" else "left"}: 5px;"

    for icon in Emoji.icons
      name = icon[0]
      css[css.length] = """
a.useremail[href*='#{name}']:last-of-type::#{position},
a.useremail[href*='#{name.toLowerCase()}']:last-of-type::#{position},
a.useremail[href*='#{name.toUpperCase()}']:last-of-type::#{position} {
content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA#{icon[1]}');
vertical-align: top;
#{margin}
}\n
"""
    css.join ""

  addStyle: ->
    agent = Style.agent
    Style.css = $.addStyle """
/* dialog styling */
hr.abovePostForm {
  width: 100% !important;
}
.dialog.reply {
  display: block;
  border: 1px solid rgba(0,0,0,.25);
  padding: 0;
}
.move {
  cursor: move;
}
label, .favicon, .export, .import {
  cursor: pointer;
}
a[href="javascript:;"] {
  text-decoration: none;
}
.warning:not(:empty) {
  color: rgb(185, 74, 72);
  background: rgb(242, 222, 222);
  border: 1px solid rgba(238, 50, 50,0.3);
  padding: 3px;
  text-align: center;
}

#options .warning {
  width: 98%;
  border-radius: 4px;
}

.warning>code {
  border: 1px solid #E5D3D3;
}

.hide_thread_button:not(.hidden_thread) {
  float: left;
}

.thread > .hidden_thread ~ *,
.hidden .sideArrows,
[hidden],
#globalMessage.hidden,
#content > [name=tab]:not(:checked) + div,
#updater:not(:hover) > :not(.move),
.autohide:not(:hover) > form,
#qp input, .forwarded,
.fappeTyme > #delform .noFile {
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
  border-bottom: 1px solid rgba(0, 0, 0, .25);
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
  background: rgba(255, 255, 255, .33);
}
.entry.hasSubMenu {
  padding-right: 1.5em;
}
.hasSubMenu::after {
  content: "";
  border-left:   .5em solid;
  border-top:    .3em solid transparent;
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
h2 {
  text-align: center;
}
#qr > .move {
  min-width: 300px;
  overflow: hidden;
  box-sizing: border-box;
  #{agent}box-sizing: border-box;
  padding: 0 2px;
}
#threadselect,
#qr > .move > span {
  float: right;
  padding: 0 2px;
}
#autohide, .close, #qr select, #dump, .remove, .captchaimg, #qr div.warning {
  cursor: pointer;
}
#qr select,
#qr > form {
  margin: 0;
}
#dump {
  background: #{agent}linear-gradient(#EEE, #CCC);
  background: linear-gradient(#EEE, #CCC);
  width: 10%;
}
.gecko #dump {
  padding: 1px 0 2px;
}
#dump:hover, #dump:focus {
  background: #{agent}linear-gradient(#FFF, #DDD);
  background: linear-gradient(#FFF, #DDD);
}
#dump:active, .dump #dump:not(:hover):not(:focus) {
  background: #{agent}linear-gradient(#CCC, #DDD);
  background: linear-gradient(#CCC, #DDD);
}
#qp:empty,
#qr:not(.dump) #replies, .dump > form > label {
  display: none;
}
#replies {
  display: block;
  height: 100px;
  position: relative;
  #{agent}user-select: none;
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
  #{agent}box-sizing: border-box;
  cursor: move;
  display: inline-block;
  height: 90px; width: 90px;
  margin: 5px; padding: 2px;
  opacity: .5;
  outline: none;
  overflow: hidden;
  position: relative;
  text-shadow: 0 1px 1px #000;
  #{agent}transition: opacity .25s ease-in-out;
  transition: opacity .25s ease-in-out;
  vertical-align: top;
}
.thumbnail:hover, .thumbnail:focus {
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
#addReply:hover, #addReply:focus {
  color: #000;
}
.field {
  border: 1px solid #CCC;
  box-sizing: border-box;
  #{agent}box-sizing: border-box;
  color: #333;
  font: 13px sans-serif;
  margin: 0;
  padding: 2px 4px 3px;
  #{agent}transition: color .25s, border .25s;
  transition: color .25s, border .25s;
}
.field:#{agent}placeholder,
.field:hover:#{agent}placeholder {
  color: #AAA;
}
.field:hover, .field:focus {
  border-color: #999;
  color: #000;
  outline: none;
}
.userInfo > .field:not(#dump) {
  width: 95px;
  min-width: 30%;
  max-width: 30%;
}
#qr textarea.field {
  display: #{agent}box;
  min-height: 160px;
  min-width: 100%;
}
#qr.captcha textarea.field {
  min-height: 120px;
}
.textarea {
  position: relative;
}
#charCount {
  color: #000;
  background: hsla(0, 0%, 100%, .5);
  font-size: 8pt;
  margin: 1px;
  position: absolute;
  bottom: 0;
  right: 0;
  pointer-events: none;
}
#charCount.warning {
  color: red;
}
.captchainput > .field {
  min-width: 100%;
}
.captchaimg {
  background: #FFF;
  outline: 1px solid #CCC;
  outline-offset: -1px;
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
#spoilerLabel:not([hidden]) {
  display: block;
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
#qr, #qp, #updater, #stats, #ihover, #overlay, #navlinks, #mouseover {
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
body {
  box-sizing: border-box;
  #{agent}box-sizing: border-box;
}
body.unscroll {
  overflow: hidden;
}
#mouseover {
  z-index: 2;
}
#overlay {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  background: none repeat scroll 0% 0% rgba(25, 25, 25, 0.6);
  z-index: 1;
}
#overlay::after {
  content: "";
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
#options {
  box-sizing: border-box;
  #{agent}box-sizing: border-box;
  display: inline-block;
  padding: 5px;
  position: relative;
  text-align: left;
  vertical-align: middle;
  width: 900px;
  max-width: 100%;
  height: 600px;
  max-height: 100%;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.4); 
  border-radius: 4px;
}

#credits {
  float: right;
}
#options ul {
  padding: 0;
}
#options fieldset {
  border: 1px solid rgb(150,150,150);
  border-radius: 3px;
}
#options legend {
  font-weight: 700;
}
#options article li {
  margin: 10px 0 10px 2em;
}
#options code {
  background: hsla(0, 0%, 100%, .5);
  color: #000;
  padding: 0 2px;
}
#selected_tab {
  font-weight: 700;
}
.rice_tab, .main_tab {
  margin-right: 5px;
}
.rice_tab {
  margin-top: -15px;
}
#content {
  overflow: auto;
  position: absolute;
  top: 2.5em;
  right: 5px;
  bottom: 5px;
  left: 5px;
}
#content textarea {
  font-family: monospace;
  min-height: 350px;
  resize: vertical;
  width: 100%;
}
.imp-exp .placeholder:not(:empty) {
  position: absolute;
  top:5px;
  right:0px;
  left:0px;
  text-align:center;
  width: 200px;
  margin: auto;
}
.imp-exp-result:empty {
  display: none;
}
.imp-exp-result {
  position: absolute;
  top:5px;
  right:0px;
  left:0px;
  width:200px;
  margin:auto;
  text-align: center;
  color:red;
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
  box-shadow: 0 0 0 2px rgba(216, 94, 49, .7);
}
.quotelink.deadlink {
  text-decoration: underline !important;
}
.deadlink:not(.quotelink) {
  text-decoration: none !important;
}
.inlined {
  opacity: .5;
}
.inline {
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(128, 128, 128, 0.5);
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
  box-shadow: inset 5px 0 rgba(255, 0, 0, .5);
}
.opContainer.filter_highlight.qphl {
  box-shadow: inset 5px 0 rgba(255, 0, 0, .5),
              0 0 0 2px rgba(216, 94, 49, .7);
}
.filter_highlight > .reply {
  box-shadow: -5px 0 rgba(255, 0, 0, .5);
}
.filter_highlight > .reply.qphl {
  box-shadow: -5px 0 rgba(255, 0, 0, .5),
              0 0 0 2px rgba(216, 94, 49, .7)
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
.postContainer iframe {
  display: block !important;
}
#toggleMsgButton {
    width: 200px;
    display: block;
    text-align: center;
    margin: 0 auto 0;
}
.redButton {
    background-color: rgb(255, 173, 173);
    background-image: url("http://static.4chan.org/image/buttonfade-red.png");
    border: 1px solid rgb(196, 88, 88);
    color: rgb(136, 0, 0) !important;
    border-radius: 3px 3px 3px 3px;
    padding: 6px 10px 5px;
    font-weight: bold;
    background-repeat: repeat-x;
    text-decoration: none;
}
#{if Conf["Announcement Hiding"] then '#globalMessage.hidden { display: none; }' else ''}
#{if Conf["Custom CSS"] then Conf["customCSS"] else ""}
#{if Conf['Emoji'] then Style.emoji Conf['emojiPos'] else ''} 
#{if Conf['Quick Reply'] and Conf['Hide Original Post Form'] then '#postForm { display: none; }' else ''}"""
