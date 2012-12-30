  iconPositions: ->
    css = """
#navtopright .exlinksOptionsLink::after,
#settingsWindowLink,
div.navLinks > a:first-of-type::after,
#watcher::after,
#globalMessage::after,
#boardNavDesktopFoot::after,
body > a[style="cursor: pointer; float: right;"]::after,
#imgControls label:first-of-type::after,
.cataloglink a::after,
#fappeTyme {
  position: fixed;
  display: block;
  width: 15px;
  height: 15px;
  content: " ";
  overflow: hidden;
  opacity: 0.5;
}
#imgControls {
  position: fixed;
}
#settingsWindowLink {
  visibility: visible;
  background-position: 0 0;
}
div.navLinks > a:first-of-type::after {
  visibility: visible;
  cursor: pointer;
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
  visibility: visible;
  cursor: pointer;
  background-position: 0 -75px;
}
#imgControls label:first-of-type::after {
  position: static;
  background-position: 0 -90px;
}
#navtopright .exlinksOptionsLink::after {
  background-position: 0 -105px;
}
.cataloglink a::after {
  background-position: 0 -120px;
}
#fappeTyme {
  background-position: 0 -135px;
}
#boardNavDesktopFoot:hover::after,
#globalMessage:hover::after,
#imgControls label:hover:first-of-type::after,
#navlinks a:hover,
#settingsWindowLink:hover,
#navtopright .exlinksOptionsLink:hover::after,
#qr #qrtab,
#watcher:hover::after,
.thumbnail#selected,
body > a[style="cursor: pointer; float: right;"]:hover::after,
div.navLinks > a:first-of-type:hover::after,
.cataloglink a:hover::after,
#fappeTyme:hover {
  opacity: 1;
}
"""
    i = 0
    align = Style.sidebarLocation[0]
    
    _conf = Conf
    notCatalog = !g.CATALOG
    notEither  = notCatalog and g.BOARD isnt 'f'

    aligner = (first, spacer, checks) ->
      # Create a position to hold values
      position = [first]

      # Check which elements we actually have. Some are easy, because the script creates them so we'd know they're here
      # Some are hard, like 4sight, which we have no way of knowing if available without looking for it.
      for enabled in checks
        position[position.length] = 
          if enabled
            first += spacer
          else
            first

      position

    if _conf["Icon Orientation"] is "horizontal"
      if align is 'left'
        first  = 231 + Style.sidebarOffset.W
        spacer = -19

      else
        first  = 2
        spacer = 19

      position = aligner(
        first
        spacer
        [
          true
          _conf['Slideout Navigation'] isnt 'hide'
          _conf['Announcements'] is 'slideout' and $ '#globalMessage', d.body
          notCatalog and _conf['Slideout Watcher'] and _conf['Thread Watcher']
          $ '#navtopright .exlinksOptionsLink', d.body
          notCatalog and $ 'body > a[style="cursor: pointer; float: right;"]', d.body
          notEither and _conf['Image Expansion']
          notEither
          notEither and _conf['Fappe Tyme']
          navlinks = ((!g.REPLY and _conf['Index Navigation']) or (g.REPLY and _conf['Reply Navigation'])) and notCatalog
          navlinks
        ]
      )

      iconOffset = 
        if align is 'left'
          250 - Style.sidebar
        else
          position[position.length - 1] - Style.sidebar - parseInt(_conf["Right Thread Padding"], 10)
      if iconOffset < 0 then iconOffset = 0

      css += """
div.navLinks > a:first-of-type::after {
  z-index: 99 !important;
}
#prefetch {
  z-index: 9;
}
/* 4chan X Options */
#settingsWindowLink {
  #{align}: #{position[i]}px;
}
/* Slideout Navigation */
#boardNavDesktopFoot::after {
  #{align}: #{position[i++]}px;
}
/* Global Message */
#globalMessage::after {
  #{align}: #{position[i++]}px;
}
/* Watcher */
#watcher::after {
  #{align}: #{position[i++]}px;
}
/* ExLinks */
#navtopright .exlinksOptionsLink::after {
  #{align}: #{position[i++]}px;
}
/* 4sight */
body > a[style="cursor: pointer; float: right;"]::after {
  #{align}: #{position[i++]}px;
}
/* Expand Images */
#imgControls {
  #{align}: #{position[i++]}px;
}
/* Back / 4chan Catalog */
.cataloglink a::after,
div.navLinks > a:first-of-type::after {
  #{align}: #{position[i++]}px;
}
/* Fappe Tyme */
#fappeTyme {
  #{align}: #{position[i++]}px;
}
/* Thread Navigation Links */
#navlinks a {
  margin: 2px;
  top: 2px;
}
#navlinks a:last-of-type {
  #{align}: #{position[i++]}px;
}
#navlinks a:first-of-type {
  #{align}: #{position[i++]}px;
}
#prefetch {
  width: #{248 + Style.sidebarOffset.W}px;
  #{align}: 2px;
  top: 20px;
  text-align: #{Style.sidebarLocation[1]};
}
#boardNavDesktopFoot::after,
#navtopright .exlinksOptionsLink::after,
#settingsWindowLink,
#watcher::after,
#globalMessage::after,
#imgControls,
#fappeTyme,
div.navLinks > a:first-of-type::after,
.cataloglink a::after,
body > a[style="cursor: pointer; float: right;"]::after {
  top: 2px !important;
}
#{if _conf["Announcements"] is "slideout" then "#globalMessage," else ""}
#{if _conf["Slideout Watcher"] then "#watcher," else ""}
#boardNavDesktopFoot {
  top: 16px !important;
  z-index: 98 !important;
}
#globalMessage:hover,
#{if _conf["Slideout Watcher"] then "#watcher:hover," else ""}
#boardNavDesktopFoot:hover {
  z-index: 99 !important;
}
#{if _conf['Boards Navigation'] is 'top' or _conf['Boards Navigation'] is 'sticky top' then '#boardNavDesktop' else if _conf['Pagination'] is 'top' or _conf['Pagination'] is 'sticky top' then '.pagelist'} {
  padding-#{align}: #{iconOffset}px;
}\n
"""

      if _conf["Updater Position"] isnt 'moveable'
        css += """
/* Updater + Stats */
#updater,
#stats {
  #{align}: 2px !important;
  #{Style.sidebarLocation[1]}: auto !important;
  top: auto !important;
  bottom: auto !important;
  #{_conf["Updater Position"]}: 1.6em !important;
}
"""
    else

      position = aligner(
        2 + (if _conf["4chan Banner"] is "at sidebar top" then (Style.logoOffset + 19) else 0)
        19
        [
          notEither and _conf['Image Expansion']
          true
          _conf['Slideout Navigation'] isnt 'hide'
          _conf['Announcements'] is 'slideout' and $ '#globalMessage', d.body
          notCatalog and _conf['Slideout Watcher'] and _conf['Thread Watcher']
          notCatalog and $ 'body > a[style="cursor: pointer; float: right;"]', d.body
          $ '#navtopright .exlinksOptionsLink', d.body
          notEither
          notEither and _conf['Fappe Tyme']
          navlinks = ((!g.REPLY and _conf['Index Navigation']) or (g.REPLY and _conf['Reply Navigation'])) and notCatalog
          navlinks
        ]
      )

      iconOffset = 20 - Style.sidebar - parseInt _conf[align.capitalize() + " Thread Padding"], 10

      css += """
div.navLinks > a:first-of-type::after {
  z-index: 89 !important;
}
#prefetch {
  z-index: 95;
}
/* Image Expansion */
#imgControls {
  top: #{position[i++]}px;
}
/* 4chan X Options */
#settingsWindowLink {
  top: #{position[i++]}px;
}
/* Slideout Navigation */
#boardNavDesktopFoot,
#boardNavDesktopFoot::after {
  top: #{position[i++]}px;
}
/* Global Message */
#globalMessage,
#globalMessage::after {
  top: #{position[i++]}px;
}
/* Watcher */
#{if _conf["Slideout Watcher"] then "#watcher, #watcher::after" else ""} {
  top: #{position[i++]}px !important;
}
/* 4sight */
body > a[style="cursor: pointer; float: right;"]::after {
  top: #{position[i++]}px;
}
/* ExLinks */
#navtopright .exlinksOptionsLink::after {
  top: #{position[i++]}px;
}
/* Back / 4chan Catalog */
.cataloglink a::after,
div.navLinks > a:first-of-type::after {
  top: #{position[i++]}px;
}
/* Fappe Tyme */
#fappeTyme {
  top: #{position[i++]}px;
}
/* Thread Navigation Links */
#navlinks a:first-of-type {
  top: #{position[i++]}px !important;
}
#navlinks a:last-of-type {
  top: #{position[i++]}px !important;
}
#prefetch {
  width: #{248 + Style.sidebarOffset.W}px;
  #{align}: 2px;
  top: 1px;
  text-align: #{Style.sidebarLocation[1]};
}
#navlinks a,
#navtopright .exlinksOptionsLink::after,
#settingsWindowLink,
#boardNavDesktopFoot::after,
#globalMessage::after,
#imgControls,
#fappeTyme,
#{if _conf["Slideout Watcher"] then "#watcher::after," else ""}
body > a[style="cursor: pointer; float: right;"]::after,
.cataloglink a::after,
div.navLinks > a:first-of-type::after {
  #{align}: 3px !important;
}
#boardNavDesktopFoot {
  z-index: 97 !important;
}
#globalMessage {
  z-index: 98 !important;
}
#watcher {
  z-index: #{if _conf["Slideout Watcher"] then "99" else "10"} !important;
}
#{if _conf["Slideout Watcher"] then "#watcher:hover," else ""}
#boardNavDesktopFoot:hover,
#globalMessage:hover {
  z-index: 100 !important;
}
#boardNavDesktopFoot,
#globalMessage,
#watcher {
  width: #{233 + Style.sidebarOffset.W}px !important;
  #{align}: 18px !important;
}
#{if _conf['Boards Navigation'] is 'top' or _conf['Boards Navigation'] is 'sticky top' then '#boardNavDesktop' else if _conf['Pagination'] is 'top' or _conf['Pagination'] is 'sticky top' then '.pagelist'} {
  padding-#{align}: #{iconOffset}px;
}
"""

      if _conf["Updater Position"] isnt 'moveable'
        css += """
/* Updater + Stats */
#updater,
#stats {
  #{align}: #{if _conf["Updater Position"] is "top" then "24" else "2"}px !important;
  #{Style.sidebarLocation[1]}: auto !important;
  top: #{if _conf["Updater Position"] == "top" then "1px" else "auto"} !important;
  bottom: #{if _conf["Updater Position"] == "bottom" then "2px" else "auto"} !important;
  #{if _conf["Updater Position"] == "top" then "z-index: 96 !important;"}
}
"""

    Style.icons.textContent = css