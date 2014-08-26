Fork of [Spittie's 4chan X](https://github.com/Spittie/4chan-x) (itself a fork of [Seaweed's](https://github.com/seaweedchan/4chan-x)).

If you're looking for OneeChan, try
https://github.com/Nebukazar/OneeChan

## [Install](https://ccd0.github.io/4chan-x/builds/4chan-X.user.js) (Firefox)
Install [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/versions/2.1), then click the link above to install.

**Important**: If you are using Greasemonkey 2.0, you should update to the [latest version](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/). Otherwise you may be subject to a [bug](https://github.com/greasemonkey/greasemonkey/issues/1938), fixed in version 2.1, which prevents Greasemonkey from updating 4chan X and other userscripts to the latest version. After doing so, you may want to update 4chan X manually since it is likely to be out of date.

Greasemonkey 2.1 also fixed [another bug](https://github.com/greasemonkey/greasemonkey/issues/1937) that can break posting of images from URLs and downloading images with the original filename.

### Known issues
The combination of Firefox 29 and Greasemonkey 2.0+ causes 4chan X not to work.
If you have this problem, you should [upgrade Firefox](http://www.mozilla.org/en-US/firefox/new/) to version 30 or higher.
Alternatively, you can downgrade to [Greasemonkey 1.15](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/versions/#version-1.15) and turn off automatic updates for Greasemonkey ([see pic](https://raw.githubusercontent.com/ccd0/4chan-x/master/img/2014-07-12_16-19-32.png)).

## [Install](https://ccd0.github.io/4chan-x/builds/4chan-X.crx) (Chromium)
Download the file from the link above and add drag it to your `chrome://extensions` page.
This should also work for non-Windows/dev/canary Chrome and Chromium-based versions of Opera.

**Note**: The stable and beta releases of Chrome on Windows will disable extensions not installed from the Chrome store, so users will need to install 4chan X from [here](https://chrome.google.com/webstore/detail/4chan-x/ohnjgmpcibpbafdlkimncjhflgedgpam).

### Known issues
Some recent versions of Chromium/Chrome (38.0.2085 - 38.0.2103) (and versions of Opera based on them) suffer from a (now fixed) [bug](https://crbug.com/393686) that prevents extensions from making HTTP requests if more than one extension is enabled. This breaks, among other things, thread updating, quick reply, and, when `JSON Navigation` is enabled, the thread index. If you are experiencing this, try using another version of Chromium/Chrome/Opera, disabling your other extensions, or using a different browser.

## Other browsers
This fork of 4chan X is not guaranteed to work correctly in other browsers, but you are welcome to try your luck. Pull requests to fix the bugs you will likely find are always welcome.

### dwb
1. Install dwb with your package manager
2. Install the dwb userscripts extension with `dwbem -N -i userscripts` in your terminal.
3. Make a directory for dwb userscripts with `mkdir .config/dwb/greasemonkey`
4. Change directory to your newly created userscripts folder with `cd .config/dwb/greasemonkey`
5. Download 4chanX with `wget https://ccd0.github.io/4chan-x/builds/4chan-X.user.js`
6. Start dwb

## Beta channel
New features and non-urgent bugfixes are released on the beta channel for further testing before they are moved the stable version. Please [report](https://github.com/ccd0/4chan-x/issues) any issues you find, and be sure to mention which version you're using.
- [Firefox version](https://ccd0.github.io/4chan-x/builds/4chan-X-beta.user.js)
- [Chromium version](https://ccd0.github.io/4chan-x/builds/4chan-X-beta.crx)

If you want to install the current beta version but get updates from the stable channel after that, install it from [here](https://github.com/ccd0/4chan-x/raw/beta/builds/4chan-X.user.js) for Firefox or [here](https://github.com/ccd0/4chan-x/raw/beta/builds/4chan-X.crx) for Chromium.

## More information
### [Frequently Asked Questions](https://github.com/ccd0/4chan-x/wiki/Frequently-Asked-Questions)
### [Reporting Bugs and Contributing](https://github.com/ccd0/4chan-x/blob/master/CONTRIBUTING.md)

