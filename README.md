![screenshot](https://ccd0.github.io/4chan-x/img/screenshot.png)
# 4chan X
Adds various features to 4chan.
Previously developed by [aeosynth](https://github.com/aeosynth/4chan-x), [Mayhem](https://github.com/MayhemYDG/4chan-x), [ihavenoface](https://github.com/ihavenoface/4chan-x), [Zixaphir](https://github.com/zixaphir/appchan-x), [Seaweed](https://github.com/seaweedchan/4chan-x), and [Spittie](https://github.com/Spittie/4chan-x), with contributions from many others.

If you're looking for a maintained fork of OneeChan (a style script used in addition to 4chan X), try
https://github.com/Nebukazar/OneeChan.

**Note**: 4chan X disables the native extension, so if you uninstall 4chan X, you'll need to re-enable it. To do this, click the `[Settings]` link in the top right corner and uncheck "`Disable the native extension`" in the panel that appears.

## Install

### Firefox
Install [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/), then **[click here to install 4chan X](https://ccd0.github.io/4chan-x/builds/4chan-X.user.js)**.

- **Pale Moon** users should use [Greasemonkey 1.15](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/versions/1.15.1-signed).
- **SeaMonkey** users should use Greasemonkey 2.3 converted with [this tool](http://addonconverter.fotokraina.com/?url=https://addons.mozilla.org/firefox/downloads/file/282084/greasemonkey-2.3-fx.xpi).

### Chromium
4chan X is available as a Chrome extension. The Chrome extension has the additional feature of being able to sync your settings and data with other devices via Chrome Sync.

- **Chromium**: **[Download 4chan X](https://ccd0.github.io/4chan-x/builds/4chan-X.crx)**, then open `chrome://extensions` and drag the downloaded file onto the page. Alternatively, you can install 4chan X from the **[Chrome store](https://chrome.google.com/webstore/detail/4chan-x/ohnjgmpcibpbafdlkimncjhflgedgpam)**.
- **Opera**: **[Click to install 4chan X](https://ccd0.github.io/4chan-x/builds/4chan-X.crx)**, then follow the prompts to activate it in your extension manager. Note: This version does not work with Opera 12; try [loadletter's fork](https://github.com/loadletter/4chan-x) instead.
- **Chrome**, **Vivaldi**: Install 4chan X from the **[Chrome store](https://chrome.google.com/webstore/detail/4chan-x/ohnjgmpcibpbafdlkimncjhflgedgpam)**.

You can also use the [userscript version of 4chan X](https://ccd0.github.io/4chan-x/builds/4chan-X.user.js) with [Tampermonkey](https://tampermonkey.net/).

### Safari
Install [JS Blocker](http://jsblocker.toggleable.com/), then **[click here to install 4chan X](https://ccd0.github.io/4chan-x/builds/4chan-X.user.js)**.

### WebKitGTK+
Several WebKitGTK+ based browsers have support for userscripts and can run 4chan X. Due to the lack of the cross-site GM_* API, and lack of support for userscripts in iframes, not all features will work. You may experience crashes when repeatedly solving the default image-based captchas. You can avoid this problem by enabling `Use Recaptcha v1` in your settings.

- **dwb**: Install the userscripts extension, then save the [script](https://ccd0.github.io/4chan-x/builds/4chan-X.user.js) to the `$XDG_CONFIG_HOME/dwb/greasemonkey` or `$HOME/.config/dwb/greasemonkey` directory (creating it if necessary):

        dwbem -N -i userscripts
        wget -P ${XDG_CONFIG_HOME:-$HOME/.config}/dwb/greasemonkey https://ccd0.github.io/4chan-x/builds/4chan-X.user.js

- **Midori**: Enable `User addons` in your preferences, under the Extensions tab. In the Privacy tab, check `Enable HTML5 local storage support`. Optionally, if you want 4chan X to be able to open new tabs when you start or reply to a thread, you will need to check `Allow scripts to open popups` under the Behavior tab. Then click the link to the [script](https://ccd0.github.io/4chan-x/builds/4chan-X.user.js) to install it.

- **Luakit**: Navigate to the [script](https://ccd0.github.io/4chan-x/builds/4chan-X.user.js), then type the command `:usi` to install it.

- **uzbl**: Install the script from https://github.com/singpolyma/singpolyma/blob/master/uzbl/data/scripts/userscript.sh, enable it in your config file, and then save [4chan X](https://ccd0.github.io/4chan-x/builds/4chan-X.user.js) to `$XDG_DATA_HOME/uzbl/userscripts` (or `$HOME/.local/share/uzbl/userscripts`).

        wget -P ${XDG_DATA_HOME:-$HOME/.local/share}/uzbl/scripts https://raw.githubusercontent.com/singpolyma/singpolyma/master/uzbl/data/scripts/userscript.sh
        chmod +x ${XDG_DATA_HOME:-$HOME/.local/share}/uzbl/scripts/userscript.sh
        echo '@on_event LOAD_COMMIT spawn @scripts_dir/userscript.sh document-start' >> ${XDG_CONFIG_HOME:-$HOME/.config}/uzbl/config
        echo '@on_event LOAD_FINISH spawn @scripts_dir/userscript.sh document-end'   >> ${XDG_CONFIG_HOME:-$HOME/.config}/uzbl/config
        wget -P ${XDG_DATA_HOME:-$HOME/.local/share}/uzbl/userscripts https://ccd0.github.io/4chan-x/builds/4chan-X.user.js

### Other browsers
4chan X can be used in some browsers that do not support userscripts, such as **Microsoft Edge**, using [a local proxy](https://github.com/ccd0/4chan-x-proxy). Not all features will work.

## Beta version
New features and non-urgent bugfixes are released on the beta channel for further testing before they are moved the stable version. Please [report](https://github.com/ccd0/4chan-x/issues) any issues you find, and be sure to mention which version you're using. You should back up your settings regularly to prevent them from being lost due to bugs.

To install the current **beta** version but get updates from the **stable** channel (recommended if you want a particular recent feature):
- [Install userscript](https://github.com/ccd0/4chan-x/raw/beta/builds/4chan-X.user.js) (use with Greasemonkey / Tampermonkey / JS Blocker / etc.)
- [Download Chrome extension](https://github.com/ccd0/4chan-x/raw/beta/builds/4chan-X.crx) (download and drag to `chrome://extensions`)

To install the **beta** version and get updates whenever there's a new **beta** version:
- [Install userscript](https://ccd0.github.io/4chan-x/builds/4chan-X-beta.user.js)
- [Download Chrome extension](https://ccd0.github.io/4chan-x/builds/4chan-X-beta.crx)

## Security note
4chan X currently shares your settings and post history between the HTTP and HTTPS versions of 4chan. If you are concerned about protecting your privacy against a man-in-the-middle attack, you should disable 4chan X on the HTTP version of 4chan and/or install [HTTPS Everywhere](https://www.eff.org/https-everywhere).

## Troubleshooting
If you encounter a bug, try the steps [here](https://github.com/ccd0/4chan-x/blob/master/CONTRIBUTING.md#reporting-bugs), then report it to the [issue tracker](https://github.com/ccd0/4chan-x/issues). If the bug seems to be caused by a script update, you can install a old version from the [changelog](https://github.com/ccd0/4chan-x/blob/master/CHANGELOG.md).

## More information
- [Changelog](https://github.com/ccd0/4chan-x/blob/master/CHANGELOG.md)
- [Frequently Asked Questions](https://github.com/ccd0/4chan-x/wiki/Frequently-Asked-Questions)
- [Report Bugs](https://github.com/ccd0/4chan-x/issues)
- [Contributing](https://github.com/ccd0/4chan-x/blob/master/CONTRIBUTING.md)

