  iconPositions: ->
    css = '';
    i = 0
    align = Style.sidebarLocation[0]

    aligner = (first, offset, checks) ->
      first += offset
      # Create a position to hold values
      position = [first]
      spacer = if align is "left" then -19 else 19

      # Check which elements we actually have. Some are easy, because the script creates them so we'd know they're here
      # Some are hard, like 4sight, which we have no way of knowing if available without looking for it.
      for enabled in checks
        if enabled
          position[position.length] = first += spacer
        else
          position[position.length] = first

      return position

    if Conf["Icon Orientation"] is "horizontal"

      position = aligner((if align is 'left' then 231 else 2), offset = (if align is "left" then Style.sidebarOffsetW else 0), [
        true
        (if Conf['Slideout Navigation'] isnt 'hide' then true else false)
        (if Conf['Announcements'] is 'slideout' and $('#globalMessage', d.body)? then true else false)
        (if Conf['Slideout Watcher'] and Conf['Thread Watcher'] then true else false)
        $('#navtopright .exlinksOptionsLink', d.body)?
        $('body > a[style="cursor: pointer; float: right;"]', d.body)?
        Conf['Image Expansion']
        true
        navlinks = (Conf['Index Navigation'] or (g.REPLY and Conf['Reply Navigation']))
        navlinks
      ])

      css = """
div.navLinks > a:first-of-type::after {
  z-index: 99 !important;
}
#prefetch {
  z-index: 9;
}
/* 4chan X Options */
#navtopright .settingsWindowLink::after {
  #{align}: #{position[i]}px;
}
/* Slideout Navigation */
#boardNavDesktopFoot::after {
  #{align}: #{position[++i]}px;
}
/* Global Message */
#globalMessage::after {
  #{align}: #{position[++i]}px;
}
/* Watcher */
#watcher::after {
  #{align}: #{position[++i]}px;
}
/* ExLinks */
#navtopright .exlinksOptionsLink::after {
  #{align}: #{position[++i]}px;
}
/* 4sight */
body > a[style="cursor: pointer; float: right;"]::after {
  #{align}: #{position[++i]}px;
}
/* Expand Images */
#imgControls {
  #{align}: #{position[++i]}px;
}
/* Back / 4chan Catalog */
.cataloglink a::after,
div.navLinks > a:first-of-type::after {
  #{align}: #{position[++i]}px;
}
/* Thread Navigation Links */
#navlinks a {
  margin: 2px;
  top: 2px;
}
#navlinks a:last-of-type {
  #{align}: #{position[++i]}px;
}
#navlinks a:first-of-type {
  #{align}: #{position[++i]}px;
}
/* Updater + Stats */
#updater,
#stats {
  #{align}: 2px !important;
  #{Style.sidebarLocation[1]}: auto !important;
  top: #{if Conf["Updater Position"] == "top" then "1.6em" else "auto"} !important;
  bottom: #{if Conf["Updater Position"] == "bottom" then "1.6em" else "auto"} !important;
}
#prefetch {
  width: #{248 + Style.sidebarOffsetW}px;
  #{align}: 2px;
  top: 20px;
  text-align: #{Style.sidebarLocation[1]};
}
#boardNavDesktopFoot::after,
#navtopright .exlinksOptionsLink::after,
#navtopright .settingsWindowLink::after,
#watcher::after,
#globalMessage::after,
#imgControls,
div.navLinks > a:first-of-type::after,
.cataloglink a::after,
body > a[style="cursor: pointer; float: right;"]::after {
  top: 2px !important;
}
#{if Conf["Announcements"] is "slideout" then "#globalMessage," else ""}
#{if Conf["Slideout Watcher"] then "#watcher," else ""}
#boardNavDesktopFoot {
  top: 16px !important;
  z-index: 98 !important;
}
#globalMessage:hover,
#{if Conf["Slideout Watcher"] then "#watcher:hover," else ""}
#boardNavDesktopFoot:hover {
  z-index: 99 !important;
}

"""
    else

      position = aligner(2, offset = (if Conf["4chan Banner"] is "at sidebar top" then (Style.logoOffset + 19) else 0), [
        Conf['Image Expansion']
        true
        (if Conf['Slideout Navigation'] isnt 'hide' then true else false)
        (if Conf['Announcements'] is 'slideout' then true else false)
        (if Conf['Slideout Watcher'] and Conf['Thread Watcher'] then true else false)
        $('body > a[style="cursor: pointer; float: right;"]', d.body)?
        $('#navtopright .exlinksOptionsLink', d.body)?
        true
        navlinks = (Conf['Index Navigation'] or (g.REPLY and Conf['Reply Navigation']))
        navlinks
      ])

      css = """
div.navLinks > a:first-of-type::after {
  z-index: 89 !important;
}
#prefetch {
  z-index: 95;
}
/* Image Expansion */
#imgControls {
  top: #{position[i]}px;
}
/* 4chan X Options */
#navtopright .settingsWindowLink::after {
  top: #{position[++i]}px;
}
/* Slideout Navigation */
#boardNavDesktopFoot,
#boardNavDesktopFoot::after {
  top: #{position[++i]}px;
}
/* Global Message */
#globalMessage,
#globalMessage::after {
  top: #{position[++i]}px;
}
/* Watcher */
#{if Conf["Slideout Watcher"] then "#watcher, #watcher::after" else ""} {
  top: #{position[++i]}px !important;
}
/* 4sight */
body > a[style="cursor: pointer; float: right;"]::after {
  top: #{position[++i]}px;
}
/* ExLinks */
#navtopright .exlinksOptionsLink::after {
  top: #{position[++i]}px;
}
/* Back / 4chan Catalog */
.cataloglink a::after,
div.navLinks > a:first-of-type::after {
  top: #{position[++i]}px;
}
/* Thread Navigation Links */
#navlinks a:first-of-type {
  top: #{position[++i]}px !important;
}
#navlinks a:last-of-type {
  top: #{position[++i]}px !important;
}
/* Updater + Stats */
#updater,
#stats {
  #{align}: #{if Conf["Updater Position"] is "top" then "24" else "2"}px !important;
  #{Style.sidebarLocation[1]}: auto !important;
  top: #{if Conf["Updater Position"] == "top" then "1px" else "auto"} !important;
  bottom: #{if Conf["Updater Position"] == "bottom" then "2px" else "auto"} !important;
  #{if Conf["Updater Position"] == "top" then "z-index: 96 !important;"}
}
#prefetch {
  width: #{248 + Style.sidebarOffsetW}px;
  #{align}: 2px;
  top: 1px;
  text-align: #{Style.sidebarLocation[1]};
}
#navlinks a,
#navtopright .exlinksOptionsLink::after,
#navtopright .settingsWindowLink::after,
#boardNavDesktopFoot::after,
#globalMessage::after,
#imgControls,
#{if Conf["Slideout Watcher"] then "#watcher::after," else ""}
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
  z-index: #{if Conf["Slideout Watcher"] then "99" else "10"} !important;
}
#boardNavDesktopFoot,
#globalMessage,
#watcher {
  width: #{233 + Style.sidebarOffsetW}px !important;
  #{align}: 18px !important;
}
"""

    Style.icons.textContent = css