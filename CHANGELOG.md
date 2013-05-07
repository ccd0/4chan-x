### 1.1.14 - 2013-05-07
seaweedchan:
- Fix catalog content sometimes disappearing due to issue with 4chan's javascript
- Fix update and download urls for Greasemonkey

zixaphir:
- Re-added `Quote Hash Navigation` option

### 1.1.13 - 2013-05-06
seaweedchan:
- Disable settings removing scroll bar when opened, thus fixing the issue where it jumps up the page randomly
- Hide watcher by default, add [Watcher] shortcut.

### 1.1.12 - 2013-05-06
detharonil
- Support for %Y in time formatting
- More future-proof %y

MayhemYDG:
- Fix whitespaces not being preserved in code tags in /g/.

seaweedchan:
- Fix QR not being able to drag to the top with fixed header disabled

zixaphir:
- Fix custom CSS
- Fix [Deleted] showing up randomly after submitting a post

### 1.1.11 - 2013-05-04
seaweedchan:
- Add `Highlight Posts Quoting You` option
- Add 'catalog', 'index', or 'thread' classes to document depending on what's open
- Add `Filtered Backlinks` options that when disabled, hides filtered backlinks

### 1.1.10 - 2013-05-03
seaweedchan:
- Fix update checking

### 1.1.9 - 2013-05-02
seaweedchan
- Fix boards with previously deleted archives not switching to new archives 

ihavenoface:
- 4chan Pass link by the style selector

zixaphir:
- Make Allow False Positives option more efficient

### 1.1.8 - 2013-05-01
seaweedchan:
- Fix QR not clearing on submit with Posting Success Notifications disabled
- New archives for /h/, /v/, and /vg/

### 1.1.7 - 2013-05-01
seaweedchan:
- External image embedding
- Account for time options in youtube links for embedding
- Once again remove /v/ and /vg/ archiving... ;_;
- Add paste.installgentoo.com embedding
- Added `Posting Success Notifications` option to make "Post Successful!" and "_____ uploaded" notifications optional
- Added `Allow False Positives` option under Linkification, giving the user more control over what's linkified.

### 1.1.6 - 2013-05-01
seaweedchan:
- Fix Gist links if no username is specificed

MayhemYDG:
 - Access it in the `Advanced` tab of the Settings window.

zixaphir:
- Add Gist link titles

### 1.1.5 - 2013-04-30
seaweedchan:
- Fix various embedding issues
- Fix Link Title depending on Embedding
- Added favicons to links that can be embedded
- Add gist embedding

### 1.1.4 - 2013-04-29
seaweedchan:
- Change ESC functionality in QR to autohide if Persistent QR is enabled
- Add /v/ and /vg/ archiving to archive.nihil-ad-rem.net, and make sure Archiver Selection settings actually switch to it
- Add option to toggle between updater and stats fixed in header or floating

MayhemYDG: 
- Add nyafuu archiving for /w/
- Add /d/ archive

### 1.1.3 - 2013-04-28
seaweedchan:
- Chrome doesn't get .null, so don't style it
- Fix count when auto update is disabled and set updater text to "Update"
- Remove /v/ and /vg/ redirection from Foolz.
- Toggle keybind for header auto-hiding

MayhemYDG:
- Fix Unread Count taking into account hidden posts.

### 1.1.2 - 2013-04-26
seaweedchan:
- Fix emoji and favicon previews not updating on change.
- Fix issue with dragging thread watcher
- Fix some settings not importing when coming from Mayhem's v3
- Fix menu z-index

MayhemYDG:
- Fix bug where a thread would freeze on load.

zixaphir:
- Fix preview with favicons and emoji
- Fix NaN error on Thread Updater Interval
- Draggable UI can no longer overlap the Header.
  - Setting the header to Autohide also increases its z-index to overlap other UI

### 1.1.1 - 2013-04-26
zixaphir:
- Fix script on Opera

MayhemYDG:
- Minor fixes.
- Chrome only: Due to technical limitations, Filter lists and Custom CSS will not by synchronized across devices anymore.

seaweedchan:
- Allow thread watcher to load on catalog

### 1.0.10 - 2013-04-23
- Add message pertaining to rewrite

### 1.0.9 - 2013-04-17
ihavenoface:
- Implement Announcement Hiding
seaweedchan:
- Change #options back to inheriting colors from replies
- Fix script breaking when disabling image expansion

### 1.0.8 - 2013-04-15
seaweedchan:
- Redo settings menu styling
- Move Export/Import buttons and dialog
- Update license and use banner.js for license

### 1.0.7 - 2013-04-14
qqueue:
- Relative post dates

MayhemYDG:
- Exporting/importing settings

### 1.0.6 - 2013-04-13
seaweedchan:
- Update supported boards for archive redirection and custom navigation
- Point to github.io instead of github.com for pages
- Fix post archive link for InstallGentoo and Foolz
- Make InstallGentoo default for /g/
- Fix embedding issues

### 1.0.5 - 2013-04-09
seaweedchan:
- Added keybind to toggle Fappe Tyme
- Fix code tag keybind

Zixaphir:
- Add 'yourPost' class to own replies

### 1.0.4 - 2013-04-08
seaweedchan:
- Fix Fappe Tyme
- Re- add label for image expanding
- Move restore button to left side as per RiDeag

### 1.0.3 - 2013-03-23
seaweedchan:
- Add ad- blocking CSS into Custom CSS examples

Zixaphir:
- Fix ctrl+s bringing up save dialog
- Fix issues with soundcloud embedding

### 1.0.2 - 2013-03-14
seaweedchan:
- New Rice option: Emoji Position
- New layout for Rice tab
- No more Yotsuba / Yotsuba B in options

### 1.0.1 - 2013-03-14
- New option: Emoji
- New Rice option: Sage Emoji

seaweedchan:
- Prettier error messages

### 1.0.0 - 2013-03-13
- Initial release

zixaphir:
- Fix unread post count for filtered posts
- Fix issues when switching from ihavenoface's fork
- Fix backlinks not receiving filtered class
- Fix QR position not saving on refresh
