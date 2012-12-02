  iconPositions: ->
    css = '';

    aligner = (start, checks) ->
      # Create a positioner to hold values
      positioner = [start]

      # Check which elements we actually have. Some are easy, because the script creates them so we'd know they're here
      # Some are hard, like 4sight, which we have no way of knowing if available without looking for it.
      for enabled, count in checks
        if enabled
          positioner[count + 1] = positioner[count] + 19
        else
          positioner[count + 1] = positioner[count]

      return positioner

    if Conf["Icon Orientation"] is "horizontal"

      # Lets autoposition stuff!
      if Conf['Icon Positions'] is 'auto-align'

        positioner = aligner(0, [
          true
          (if Conf['Slideout Navigation'] isnt 'hide' then true else false)
          (if Conf['Announcements'] is 'slideout' and $('#globalMessage', d.body)? then true else false)
          (if Conf['Slideout Watcher'] and Conf['Thread Watcher'] then true else false)
          $('#navtopright .exlinksOptionsLink', d.body)?
          $('body > a[style="cursor: pointer; float: right;"]', d.body)?
          Conf['Image Expansion']
          g.REPLY
          Conf['Index Navigation'] or (g.REPLY and Conf['Reply Navigation'])
        ])

      else

        positioner = [0, 19, 38, 57, 76, 95, 114, 229, 191]

      leftStart  = 231
      rightStart = 2
      css = """
div.navLinks > a:first-of-type::after {
  z-index: 99 !important;
}
#prefetch {
  z-index: 9;
}
/* 4chan X Options */
#navtopright .settingsWindowLink::after {
  visibility: visible;
  #{if Style.sidebarLocation[0] == "left" then "left: #{leftStart + Style.sidebarOffsetW}px" else "right:  #{rightStart}px"};
}
/* Slideout Navigation */
#boardNavDesktopFoot::after {
  #{if Style.sidebarLocation[0] == "left" then "left: #{leftStart + Style.sidebarOffsetW - positioner[1]}px" else "right:  #{rightStart + positioner[1]}px"};
}
/* Global Message */
#globalMessage::after {
  #{if Style.sidebarLocation[0] == "left" then "left: #{leftStart + Style.sidebarOffsetW - positioner[2]}px" else "right:  #{rightStart + positioner[2]}px"};
}
/* Watcher */
#watcher::after {
  #{if Style.sidebarLocation[0] == "left" then "left: #{leftStart + Style.sidebarOffsetW - positioner[3]}px" else "right:  #{rightStart + positioner[3]}px"};
  cursor: pointer;
}
/* ExLinks */
#navtopright .exlinksOptionsLink::after {
  visibility: visible;
  #{if Style.sidebarLocation[0] == "left" then "left: #{leftStart + Style.sidebarOffsetW - positioner[4]}px" else "right:  #{rightStart + positioner[4]}px"};
}
/* 4sight */
body > a[style="cursor: pointer; float: right;"]::after {
  #{if Style.sidebarLocation[0] == "left" then "left: #{leftStart + Style.sidebarOffsetW - positioner[5]}px" else "right:  #{rightStart + positioner[5]}px"};
}
/* Expand Images */
#imgControls {
  position: fixed;
  #{if Style.sidebarLocation[0] == "left" then "left: #{leftStart + Style.sidebarOffsetW - positioner[6]}px" else "right:  #{rightStart + positioner[6]}px"};
}
/* Back */
div.navLinks > a:first-of-type::after {
  visibility: visible;
  cursor: pointer;
  #{if Style.sidebarLocation[0] == "left" then "left: #{leftStart + Style.sidebarOffsetW - positioner[7]}px" else "right:  #{rightStart + positioner[7]}px"};
}
/* Thread Navigation Links */
#navlinks {
  #{if Style.sidebarLocation[0] == "left" then "left: #{leftStart + Style.sidebarOffsetW - positioner[8]}px" else "right:  #{rightStart + positioner[8]}px"};
  #{Style.sidebarLocation[1]}: auto !important;
  top: 0 !important;
  font-size: 0;
  width: 40px;
}
#navlinks a {
  margin-left: 4px;
}
/* Updater + Stats */
#updater,
#stats {
  #{Style.sidebarLocation[0]}: 2px !important;
  #{Style.sidebarLocation[1]}: auto !important;
  top: #{if Conf["Updater Position"] == "top" then "1.6em" else "auto"} !important;
  bottom: #{if Conf["Updater Position"] == "bottom" then "1.6em" else "auto"} !important;
}
#prefetch {
  width: #{248 + Style.sidebarOffsetW}px;
  #{Style.sidebarLocation[0]}: 2px;
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

      if Conf['Icon Positions'] is 'auto-align'
        positioner = aligner(2, [
          Conf['Image Expansion']
          true
          (if Conf['Slideout Navigation'] isnt 'hide' then true else false)
          (if Conf['Announcements'] is 'slideout' then true else false)
          (if Conf['Slideout Watcher'] and Conf['Thread Watcher'] then true else false)
          $('body > a[style="cursor: pointer; float: right;"]', d.body)?
          $('#navtopright .exlinksOptionsLink', d.body)?
          g.REPLY
          Conf['Index Navigation'] or (g.REPLY and Conf['Reply Navigation'])
        ])
      else
        positioner = [2, 21, 40, 59, 78, 97, 116, 135, 156]

      if Conf["4chan Banner"] is "at sidebar top"
        iLogoOffset = Style.logoOffset + 19
      else
        iLogoOffset = 0

      css = """
div.navLinks > a:first-of-type::after {
  z-index: 89 !important;
}
#prefetch {
  z-index: 95;
}
/* Image Expansion */
#imgControls {
  position: fixed;
  top: #{positioner[0] + iLogoOffset}px !important;
}
/* 4chan X Options */
#navtopright .settingsWindowLink::after {
  visibility: visible;
  top: #{positioner[1] + iLogoOffset}px !important;
}
/* Slideout Navigation */
#boardNavDesktopFoot,
#boardNavDesktopFoot::after {
  border: none;
  top: #{positioner[2] + iLogoOffset}px !important;
}
/* Global Message */
#globalMessage,
#globalMessage::after {
  top: #{positioner[3] + iLogoOffset}px !important;
}
/* Watcher */
#{if Conf["Slideout Watcher"] then "#watcher, #watcher::after" else ""} {
  top: #{positioner[4] + iLogoOffset}px !important;
  cursor: pointer;
}
/* 4sight */
body > a[style="cursor: pointer; float: right;"]::after {
  top: #{positioner[5] + iLogoOffset}px !important;
}
/* ExLinks */
#navtopright .exlinksOptionsLink::after {
  visibility: visible;
  top: #{positioner[6] + iLogoOffset}px !important;
}
/* Back */
div.navLinks > a:first-of-type::after {
  visibility: visible;
  position: fixed;
  cursor: pointer;
  top: #{positioner[7] + iLogoOffset}px !important;
}
#navlinks {
  top: #{positioner[8] + iLogoOffset}px !important;
  #{Style.sidebarLocation[1]}: auto !important;
}
/* Updater + Stats */
#updater,
#stats {
  #{Style.sidebarLocation[0]}: #{if Conf["Updater Position"] is "top" then "24" else "2"}px !important;
  #{Style.sidebarLocation[1]}: auto !important;
  top: #{if Conf["Updater Position"] == "top" then "1px" else "auto"} !important;
  bottom: #{if Conf["Updater Position"] == "bottom" then "2px" else "auto"} !important;
  #{if Conf["Updater Position"] == "top" then "z-index: 96 !important;"}
}
#prefetch {
  width: #{248 + Style.sidebarOffsetW}px;
  #{Style.sidebarLocation[0]}: 2px;
  top: 1px;
  text-align: #{Style.sidebarLocation[1]};
}
#navlinks a {
  display: block;
  clear: both;
}
#navlinks,
#navtopright .exlinksOptionsLink::after,
#navtopright .settingsWindowLink::after,
#boardNavDesktopFoot,
#boardNavDesktopFoot::after,
#{if Conf["Slideout Watcher"] then "#watcher, #watcher::after," else ""}
#globalMessage,
#globalMessage::after,
#imgControls,
body > a[style="cursor: pointer; float: right;"]::after,
div.navLinks > a:first-of-type::after {
  #{Style.sidebarLocation[0]}: 3px !important;
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
"""

    return css