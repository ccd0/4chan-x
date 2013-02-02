  theme: (theme) ->
    _conf = Conf

    bgColor = new Style.color Style.colorToHex backgroundC = theme["Background Color"]

    Style.lightTheme = bgColor.isLight()

    icons = Icons.header.png + Icons.themes[_conf["Icons"]][if Style.lightTheme then "light" else "dark"]

    css = """
.hide_thread_button span > span,
.hide_reply_button span > span {
  background-color: #{theme["Links"]};
}
#mascot_hide label {
  border-bottom: 1px solid #{theme["Reply Border"]};
}
#content .thumb {
  box-shadow: 0 0 5px #{theme["Reply Border"]};
}
.mascotname,
.mascotoptions {
  background: #{theme["Dialog Background"]};
  border: 1px solid #{theme["Buttons Border"]};
}
.opContainer.filter_highlight {
  box-shadow: inset 5px 0 #{theme["Backlinked Reply Outline"]};
}
.filter_highlight > .reply {
  box-shadow: -5px 0 #{theme["Backlinked Reply Outline"]};
}
::#{Style.agent}selection {
  background: #{theme["Text"]};
  color: #{backgroundC};
}
hr {
  border-bottom: 1px solid #{theme["Reply Border"]};
}
a[style="cursor: pointer; float: right;"] + div[style^="width: 100%;"] > table > tbody > tr > td {
  background: #{backgroundC} !important;
  border: 1px solid #{theme["Reply Border"]} !important;
}
#fs_status {
  background: #{theme["Dialog Background"]} !important;
}
#fs_data tr[style="background-color: #EA8;"] {
  background: #{theme["Reply Background"]} !important;
}
#fs_data,
#fs_data * {
  border-color: #{theme["Reply Border"]} !important;
}
html {
  background: #{backgroundC or ''};
  background-image: #{theme["Background Image"] or ''};
  background-repeat: #{theme["Background Repeat"] or ''};
  background-attachment: #{theme["Background Attachment"] or ''};
  background-position: #{theme["Background Position"] or ''};
}
#optionsContent,
#exlinks-options-content,
#mascotcontent,
#themecontent {
  background: #{backgroundC};
  border: 1px solid #{theme["Reply Border"]};
  padding: 5px;
}
#selected_tab {
  background: #{backgroundC};
  border-color: #{theme["Reply Border"]};
  border-style: solid;
}
#boardTitle,
#prefetch,
#showQR,
#{unless _conf["Post Form Decorations"] then '#spoilerLabel,' else ''}
#stats,
#updater:not(:hover) .move {
  text-shadow:
     1px  1px 0 #{backgroundC},
    -1px -1px 0 #{backgroundC},
     1px -1px 0 #{backgroundC},
    -1px  1px 0 #{backgroundC},
     0    1px 0 #{backgroundC},
     0   -1px 0 #{backgroundC},
     1px  0   0 #{backgroundC},
    -1px  0   0 #{backgroundC}
    #{if _conf["Sidebar Glow"] then ", 0 2px 5px #{theme['Text']};" else ";"}
}
/* Fixes text spoilers */
.spoiler:not(:hover) *,
s:not(:hover) * {
  color: rgb(0,0,0) !important;
  text-shadow: none !important;
}
.spoiler,
s {
  color: rgb(0,0,0);
  background-color: rgb(0,0,0);
}
.spoiler:hover,
s:hover {
  color: #{theme["Text"]};
  background-color: transparent;
}
#exlinks-options,
#options,
#qrtab,
#{if _conf["Post Form Decorations"] then "#qr," else ""}
#updater:hover,
input[type="submit"],
input[value="Report"],
span[style="left: 5px; position: absolute;"] a {
  background: #{theme["Buttons Background"]};
  border: 1px solid #{theme["Buttons Border"]};
}
.enabled .mascotcontainer {
  background: #{theme["Buttons Background"]};
  border-color: #{theme["Buttons Border"]};
}
#dump,
#file,
#options input,
.dump #dump:not(:hover):not(:focus),
.selectrice,
button,
input,
textarea {
  background: #{theme["Input Background"]};
  border: 1px solid #{theme["Input Border"]};
  color: #{theme["Inputs"]};
}
#dump:hover,
#file:hover,
#options .selectrice li:nth-of-type(2n+1):hover,
.selectrice:hover,
.selectrice li:hover,
input:hover,
textarea:hover {
  background: #{theme["Hovered Input Background"]};
  border-color: #{theme["Hovered Input Border"]};
  color: #{theme["Inputs"]};
}
#dump:active,
#dump:focus,
.selectrice:focus,
.selectrice li:focus,
input:focus,
textarea:focus,
textarea.field:focus {
  background: #{theme["Focused Input Background"]};
  border-color: #{theme["Focused Input Border"]};
  color: #{theme["Inputs"]};
}
#mouseover,
#post-preview,
#qp .post,
#xupdater,
.reply.post {
  border: 1px solid #{theme["Reply Border"]};
  background: #{theme["Reply Background"]};
}
.exblock.reply,
.reply.post.highlight,
.reply.post:target {
  background: #{theme["Highlighted Reply Background"]};
  border: 1px solid #{theme["Highlighted Reply Border"]};
}
#boardNavDesktop,
.pagelist {
  background: #{theme["Navigation Background"]};
  border: 1px solid #{theme["Navigation Border"]};
}
#delform {
  background: #{theme["Thread Wrapper Background"]};
  border: 1px solid #{theme["Thread Wrapper Border"]};
}
#boardNavDesktopFoot,
#mascotConf,
#mascot_hide,
#menu,
#selectrice,
#themeConf,
#watcher,
#watcher:hover,
.subMenu,
a[style="cursor: pointer; float: right;"] ~ div[style^="width: 100%;"] > table {
  background: #{theme["Dialog Background"]};
  border: 1px solid #{theme["Dialog Border"]};
}
#qr .warning {
  background: #{theme["Input Background"]};
  border: 1px solid #{theme["Input Border"]};
}
.captcha img {
  border: 1px solid #{theme["Input Border"]};
}
.disabledwarning,
.warning {
  color: #{theme["Warnings"]};
}
#navlinks a:first-of-type {
  border-bottom: 11px solid rgb(#{if Style.lightTheme then "130,130,130" else "230,230,230"});
}
#navlinks a:last-of-type {
  border-top: 11px solid rgb(#{if Style.lightTheme then "130,130,130" else "230,230,230"});
}
#charCount {
  color: #{(if Style.lightTheme then "rgba(0,0,0,0.7)" else "rgba(255,255,255,0.7)")};
}
.postNum a {
  color: #{theme["Post Numbers"]};
}
.subject {
  color: #{theme["Subjects"]} !important;
  font-weight: 600;
}
.dateTime,
.post-ago {
  color: #{theme["Timestamps"]} !important;
}
#fs_status a,
#imgControls label::after,
#updater #count:not(.new)::after,
#showQR,
#updater,
.abbr,
.boxbar,
.boxcontent,
.pages strong,
.pln,
.reply,
.reply.highlight,
.summary,
body,
button,
span[style="left: 5px; position: absolute;"] a,
input,
textarea {
  color: #{theme["Text"]};
}
#exlinks-options-content > table,
#options ul,
.selectrice ul {
  border-bottom: 1px solid #{theme["Reply Border"]};
  box-shadow: inset #{theme["Shadow Color"]} 0 0 5px;
}
.quote + .spoiler:hover,
.quote {
  color: #{theme["Greentext"]};
}
.forwardlink {
  text-decoration: none;
  border-bottom: 1px dashed #{theme["Backlinks"]};
}
.container::before {
  color: #{theme["Timestamps"]};
}
#menu,
#post-preview,
#qp .opContainer,
#qp .replyContainer,
.subMenu {
  box-shadow: #{if _conf['Quote Shadows'] then "5px 5px 5px #{theme['Shadow Color']}" else ""};
}
.rice {
  background: #{theme["Checkbox Background"]};
  border: 1px solid #{theme["Checkbox Border"]};
}
.selectrice::before {
  border-left: 1px solid #{theme["Input Border"]};
}
.selectrice::after {
  border-top: .45em solid #{theme["Inputs"]};
}
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
  background-image: url(#{Icons.header.png + (if Style.lightTheme then "AkAAAAJCAMAAADXT/YiAAAAWlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACLSV5RAAAAHXRSTlMAgVHwkF11LdsM9vm9n5x+ye0qMOfk/GzqSMC6EsZzJYoAAABBSURBVHheLcZHEoAwEMRArcHknNP8/5u4MLqo+SszcBMwFyt57cFXamjV0UtyDBotIIVFiiAJ33aijhOA67bnwwuZdAPNxckOUgAAAABJRU5ErkJggg==" else "AkAAAAJCAMAAADXT/YiAAAAWlBMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9jZLFEAAAAHXRSTlMAgVHwkF11LdsM9vm9n5x+ye0qMOfk/GzqSMC6EsZzJYoAAABBSURBVHheLcZHEoAwEMRArcHknNP8/5u4MLqo+SszcBMwFyt57cFXamjV0UtyDBotIIVFiiAJ33aijhOA67bnwwuZdAPNxckOUgAAAABJRU5ErkJggg==")});
}
#dump,
.button,
.entry,
.replylink,
a {
  color: #{theme["Links"]};
}
.backlink {
  color: #{theme["Backlinks"]};
}
.quotelink {
  color: #{theme["Quotelinks"]};
}
#dump:hover,
.entry:hover,
.sideArrows a:hover,
.replylink:hover,
.quotelink:hover,
a .name:hover,
a .postertrip:hover,
a:hover {
  color: #{theme["Hovered Links"]};
}
#boardNavDesktop a:hover,
#boardTitle a:hover {
  color: #{theme["Hovered Navigation Links"]};
}
#boardTitle {
  color: #{theme["Board Title"]};
}
.name,
.post-author {
  color: #{theme["Names"]} !important;
}
.post-tripcode,
.postertrip,
.trip {
  color: #{theme["Tripcodes"]} !important;
}
a .postertrip,
a .name {
  color: #{theme["Emails"]};
}
.post.reply.qphl,
.post.op.qphl {
  border-color: #{theme["Backlinked Reply Outline"]};
  background: #{theme["Highlighted Reply Background"]};
}
.inline .post {
  box-shadow: #{if _conf['Quote Shadows'] then "5px 5px 5px #{theme['Shadow Color']}" else  ""};
}
.placeholder,
#qr input::#{Style.agent}placeholder,
#qr textarea::#{Style.agent}placeholder {
  color: #{if Style.lightTheme then "rgba(0,0,0,0.3)" else "rgba(255,255,255,0.2)"} !important;
}
#qr input:#{Style.agent}placeholder,
#qr textarea:#{Style.agent}placeholder,
.placeholder {
  color: #{if Style.lightTheme then "rgba(0,0,0,0.3)" else "rgba(255,255,255,0.2)"} !important;
}
#options ul,
.boxcontent dd,
.selectrice ul {
  border-color: #{if Style.lightTheme then "rgba(0,0,0,0.1)" else "rgba(255,255,255,0.1)"};
}
#options li,
.selectrice li:not(:first-of-type) {
  border-top: 1px solid #{if Style.lightTheme then "rgba(0,0,0,0.05)" else "rgba(255,255,255,0.025)"};
}
#mascot img {
  #{Style.agent}transform: scaleX(#{(if Style.sidebarLocation[0] is "left" then "-" else "")}1);
}

#navtopright .exlinksOptionsLink::after,
#settingsWindowLink,
.navLinks > a:first-of-type::after,
#watcher::after,
#globalMessage::after,
#boardNavDesktopFoot::after,
a[style="cursor: pointer; float: right;"]::after,
#imgControls label:first-of-type::after,
#catalog::after,
#fappeTyme {
  background-image: url('#{icons}');
}
#{theme["Custom CSS"]}\n
"""

    css += (if Style.lightTheme then """
.prettyprint {
  background-color: #e7e7e7;
  border: 1px solid #dcdcdc;
}
.com {
  color: #dd0000;
}
.str,
.atv {
  color: #7fa61b;
}
.pun {
  color: #61663a;
}
.tag {
  color: #117743;
}
.kwd {
  color: #5a6F9e;
}
.typ,
.atn {
  color: #9474bd;
}
.lit {
  color: #368c72;
}\n
""" else """
.prettyprint {
  background-color: rgba(0,0,0,.1);
  border: 1px solid rgba(0,0,0,0.5);
}
.tag {
  color: #96562c;
}
.pun {
  color: #5b6f2a;
}
.com {
  color: #a34443;
}
.str,
.atv {
  color: #8ba446;
}
.kwd {
  color: #987d3e;
}
.typ,
.atn {
  color: #897399;
}
.lit {
  color: #558773;
}\n
""")

    if _conf["Alternate Post Colors"]
      css += """
.replyContainer:not(.hidden):nth-of-type(2n+1) .post {
  background-image: #{Style.agent}linear-gradient(#{if Style.lightTheme then "rgba(0,0,0,0.05), rgba(0,0,0,0.05)" else "rgba(255,255,255,0.02), rgba(255,255,255,0.02)"});
}\n
"""

    if _conf["Color Reply Headings"]
      css += """
.postInfo {
  background: #{if (replyHeading = new Style.color Style.colorToHex theme["Reply Background"]) then "rgb(" + (replyHeading.shiftRGB 16, true) + ")" else "rgba(0,0,0,0.1)"};
}\n"""

    if _conf["Color File Info"]
      css += """
.file {
  background: #{if (fileHeading = new Style.color Style.colorToHex theme["Reply Background"]) then "rgb(" + (fileHeading.shiftRGB 8, true) + ")" else "rgba(0,0,0,0.1)"};
}\n
"""
    if _conf["OP Background"]
      css += """
.op.post {
  background: #{theme["Reply Background"]};
  border: 1px solid #{theme["Reply Border"]};
}
.op.post:target
.op.post.highlight {
  background: #{theme["Highlighted Reply Background"]};
  border: 1px solid #{theme["Highlighted Reply Border"]};
}\n
"""
    if _conf["4chan SS Sidebar"]
      background = new Style.color Style.colorToHex backgroundC
      css += """
body::before {
  background: none repeat scroll 0% 0% rgba(#{background.shiftRGB -18}, 0.8);
  border-#{Style.sidebarLocation[1]}: 2px solid #{backgroundC};
  box-shadow:
    #{if _conf["Sidebar Location"] is "right" then "inset" else ""}  1px 0 0 #{theme["Thread Wrapper Border"]},
    #{if _conf["Sidebar Location"] is "left"  then "inset" else ""} -1px 0 0 #{theme["Thread Wrapper Border"]};
}\n
"""

    css += {
      text: """
a.useremail[href*="sage"]:last-of-type::#{_conf["Sage Highlight Position"]},
a.useremail[href*="Sage"]:last-of-type::#{_conf["Sage Highlight Position"]},
a.useremail[href*="SAGE"]:last-of-type::#{_conf["Sage Highlight Position"]} {
  content: " (sage) ";
  color: #{theme["Sage"]};
}\n
"""
      image: """
a.useremail[href*="sage"]:last-of-type::#{_conf["Sage Highlight Position"]},
a.useremail[href*="Sage"]:last-of-type::#{_conf["Sage Highlight Position"]},
a.useremail[href*="SAGE"]:last-of-type::#{_conf["Sage Highlight Position"]} {
  content: url("#{Icons.header.png}A4AAAAOCAMAAAAolt3jAAABa1BMVEUAAACqrKiCgYIAAAAAAAAAAACHmX5pgl5NUEx/hnx4hXRSUVMiIyKwrbFzn19SbkZ1d3OvtqtpaWhcX1ooMyRsd2aWkZddkEV8vWGcpZl+kHd7jHNdYFuRmI4bHRthaV5WhUFsfGZReUBFZjdJazpGVUBnamYfHB9TeUMzSSpHgS1cY1k1NDUyOC8yWiFywVBoh1lDSEAZHBpucW0ICQgUHhBjfFhCRUA+QTtEQUUBAQFyo1praWspKigWFRZHU0F6j3E9Oz5VWFN0j2hncWONk4sAAABASDxJWkJKTUgAAAAvNC0fJR0DAwMAAAA9QzoWGhQAAAA8YytvrFOJsnlqyT9oqExqtkdrsExpsUsqQx9rpVJDbzBBbi5utk9jiFRuk11iqUR64k5Wf0JIZTpadk5om1BkyjmF1GRNY0FheFdXpjVXhz86XSp2yFJwslR3w1NbxitbtDWW5nNnilhFXTtYqDRwp1dSijiJ7H99AAAAUnRSTlMAJTgNGQml71ypu3cPEN/RDh8HBbOwQN7wVg4CAQZ28vs9EDluXjo58Ge8xwMy0P3+rV8cT73sawEdTv63NAa3rQwo4cUdAl3hWQSWvS8qqYsjEDiCzAAAAIVJREFUeNpFx7GKAQAYAOD/A7GbZVAWZTBZFGQw6LyCF/MIkiTdcOmWSzYbJVE2u1KX0J1v+8QDv/EkyS0yXF/NgeEILiHfyc74mICTQltqYXBeAWU9HGxU09YqqEvAElGjyZYjPyLqitjzHSEiGkrsfMWr0VLe+oy/djGP//YwfbeP8bN3Or0bkqEVblAAAAAASUVORK5CYII=");
  vertical-align: top;
  margin-#{if _conf["Sage Highlight Position"] is "before" then "right" else "left"}: #{parseInt _conf['Emoji Spacing']}px;
}\n
"""
      none: ""
    }[_conf["Sage Highlighting"]]
    if _conf["Announcements"] is "slideout"
      css += """
#globalMessage {
  background: #{theme["Dialog Background"]};
  border: 1px solid #{theme["Dialog Border"]};
}\n
"""
    if _conf["Post Form Style"] is "float" or _conf["Post Form Decorations"]
      css += """
#qr {
  border: 1px solid #{theme["Buttons Border"]};
  background: #{backgroundC};
  box-shadow: #{if _conf['Quote Shadows'] then "5px 5px 5px #{theme['Shadow Color']}" else  ""};
}\n
"""
    css