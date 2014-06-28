## Reporting bugs and suggestions

Reporting bugs: (note that some of these links refer to Mayhem's 4chan X repo to avoid duplication of information resources. Bugs MUST be filed on [our issue tracker](https://github.com/zixaphir/appchan-x/issues), not Mayhem's)

1. Make sure both your **browser** and **Appchan X** are up to date.<br>
   Only **Chrome**, **Firefox** and **Opera** are supported.<br>
   **SRWare Iron**, **Firefox ESR**, **Pale Moon**, **Waterfox**, and other derivatives are not supported, use them at your own risk. This means that issue reports made with these browsers will be ignored unless you're able to duplicate it on a supported browser.

2. Look at the list of [known problems and solutions](https://github.com/MayhemYDG/4chan-x/wiki/FAQ#known-problems).
3. Disable your other extensions & scripts to identify conflicts.
4. If your issue persists, open a [new issue](https://github.com/zixaphir/appchan-x/issues) with the following information:
  1. Precise steps to reproduce the problem, with the expected and actual results.
  2. [Console errors](https://github.com/MayhemYDG/4chan-x/wiki/FAQ#console-errors), if any.
  3. Appchan X version, browser variant, browser version, and Greasemonkey version if you are using it.
  4. Your exported settings. If your settings contains sensible information (e.g. personas), edit the text file manually.

Respect these guidelines:
- Describe the issue clearly, put some effort into it. A one-liner isn't a good enough description.
- If you want to get your suggestion implemented sooner, make it convincing.
- If you want to criticize, make it convincing and constructive.
- Be mature. Act like an idiot and you will be blocked without warning.

## Development & Contribution

### Get started

- Install [node.js](http://nodejs.org/).
- Install [Grunt's CLI](http://gruntjs.com/) with `npm install -g grunt-cli`.
- Clone Appchan X.
- `cd` into it.
- Install/Update Appchan X dependencies with `npm install`.

### Build

- Build with `grunt`.
- Continuously build with `grunt watch`.

### Release

- Update the version with `grunt patch`, `grunt minor` or `grunt major`.
- Release with `grunt release`.

Note: this is only used to release new versions, and is **not** needed or wanted in pull requests.

### Contribute

- Edit the sources.
- If the edits affect regular users, edit the changelog.
- Open a pull request.

## Archive Maintenance

Archivers should direct their archive pull requests (updated boards, changed protocols, etc) to [4chan X](https://github.com/MayhemYDG/4chan-x/). Appchan does not provide a JSON Interfact to synchronize dynamically as 4chan X does. There is no benefit to updating the archives in this repo and it only creates additional merge overhead.
