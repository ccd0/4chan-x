# 4chan X
Adds various features to 4chan.
A continuation of the fork formerly maintained by [Seaweed](https://github.com/seaweedchan/4chan-x) and subsequently [Spittie](https://github.com/Spittie/4chan-x).

If you're looking for a maintained fork of OneeChan, try
https://github.com/Nebukazar/OneeChan

## [Install](https://ccd0.github.io/4chan-x/builds/4chan-X.user.js) (Firefox)
Install [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/), then click the link above to install 4chan X. If you are using Firefox 29 or earlier, you should use [Greasemonkey 1.15](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/versions/#version-1.15).

### Known issues
The combination of Firefox 29 and Greasemonkey 2.0+ causes 4chan X not to work.
If you have this problem, you should [upgrade Firefox](http://www.mozilla.org/en-US/firefox/new/) to version 30 or higher.
Alternatively, you can downgrade to [Greasemonkey 1.15](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/versions/#version-1.15) and turn off automatic updates for Greasemonkey ([see pic](https://ccd0.github.io/4chan-x/img/2014-07-12_16-19-32.png)).

## [Install](https://ccd0.github.io/4chan-x/builds/4chan-X.crx) (Chromium)
Download the file from the link above and add drag it to your `chrome://extensions` page.
This should also work for non-Windows/dev/canary Chrome and Chromium-based versions of Opera.

## [Install](https://chrome.google.com/webstore/detail/4chan-x/ohnjgmpcibpbafdlkimncjhflgedgpam) (Chrome store)
The stable and beta releases of Chrome on Windows will disable extensions not installed from the Chrome store, so users will need to install 4chan X from the link above.
Only the latest stable version of 4chan X is available.

## Other browsers
This fork of 4chan X is not guaranteed to work correctly in other browsers, but you are welcome to try your luck. Pull requests to fix the bugs you will likely find are always welcome. You may fare better with [loadletter's v2 fork](https://github.com/loadletter/4chan-x), which has fewer features but less dependence on browser-specific APIs.

- [Installing 4chan X in dwb](https://github.com/ccd0/4chan-x/wiki/Installing-4chan-X-in-dwb)

## Beta channel
New features and non-urgent bugfixes are released on the beta channel for further testing before they are moved the stable version. Please [report](https://github.com/ccd0/4chan-x/issues) any issues you find, and be sure to mention which version you're using.
- [Firefox version](https://ccd0.github.io/4chan-x/builds/4chan-X-beta.user.js)
- [Chromium version](https://ccd0.github.io/4chan-x/builds/4chan-X-beta.crx)

If you want to install the current beta version but get updates from the stable channel after that, install it from [here](https://github.com/ccd0/4chan-x/raw/beta/builds/4chan-X.user.js) for Firefox or [here](https://github.com/ccd0/4chan-x/raw/beta/builds/4chan-X.crx) for Chromium.

## Security note
4chan X currently shares your settings and post history between the HTTP and HTTPS versions of 4chan. If you are concerned about protecting your privacy against a man-in-the-middle attack, you should disable 4chan X on the HTTP version of 4chan and/or install [HTTPS Everywhere](https://www.eff.org/https-everywhere).

## More information
### [Source Code](https://github.com/ccd0/4chan-x)
### [Changelog](https://github.com/ccd0/4chan-x/blob/master/CHANGELOG.md)
### [Frequently Asked Questions](https://github.com/ccd0/4chan-x/wiki/Frequently-Asked-Questions)
### [Reporting Bugs and Contributing](https://github.com/ccd0/4chan-x/blob/master/CONTRIBUTING.md)

