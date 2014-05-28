Fork of [Spittie's 4chan X](https://github.com/Spittie/4chan-x) (itself a fork of [Seaweed's](https://github.com/seaweedchan/4chan-x)).

Note: If you're looking for a maintained fork of OneeChan, try
https://github.com/Nebukazar/OneeChan

#### [Why 4chan X needs to access data on every site?](https://github.com/ccd0/4chan-x/wiki/Why-4chan-X-needs-to-access-data-from-every-website%3F)

## [Install](https://ccd0.github.io/4chan-x/builds/4chan-X.user.js) (Firefox)
Install [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/), then click the link above to install.
## [Install](https://ccd0.github.io/4chan-x/builds/crx.crx) (Chromium)
Download the file from the link above and add drag it to your `chrome://extensions` page.
This should also work for Chrome and Chromium-based versions of Opera.
## Other browsers
This fork of 4chan X is not guaranteed to work correctly in other browsers, but you are welcome to try your luck. Pull requests to fix the bugs you will likely find are always welcome.
### dwb
1. Install dwb with your package manager
2. Install the dwb userscripts extension with `dwbem -N -i userscripts` in your terminal.
3. Make a directory for dwb userscripts with `mkdir .config/dwb/greasemonkey`
4. Change directory to your newly created userscripts folder with `cd .config/dwb/greasemonkey`
5. Download 4chanX with `wget https://ccd0.github.io/4chan-x/builds/4chan-X.user.js`
6. Start dwb

## If you have any problems, try resetting your 4chan X settings

## Forking

### Get started

- Get started by reading through the [Help link](https://help.github.com/) on how to fork a Github project.
- Click the "Fork" button on this page.
- Install [node.js](http://nodejs.org/).
- Install [Grunt's CLI](http://gruntjs.com/) with `npm install -g grunt-cli`.
- Clone your fork of 4chan X.
- `cd` into it.
- Install/Update 4chan X dependencies with `npm install`.

### Build

- Build with `grunt`.
- Continuously build with `grunt watch`.

### Release

- Update the version with `grunt patch`, `grunt minor` or `grunt major`.
- Release with `grunt release`.

Note: this is only used to release new 4chan X versions, ignore as you see fit.

