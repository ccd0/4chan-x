## Reporting bugs and suggestions

Reporting bugs:

1. Make sure both your **browser** and **4chan X** are up to date.<br>
   Only **Chrome**, **Firefox** and **Opera** are supported.<br>
   **SRWare Iron**, **Firefox ESR**, **Pale Moon**, **Waterfox**, and other derivatives are not supported; use them at your own risk.
2. Look at the list of [known problems and solutions](https://github.com/MayhemYDG/4chan-x/wiki/FAQ#known-problems).
3. Disable your other extensions & scripts to identify conflicts.
4. If your issue persists, open a [new issue](https://github.com/MayhemYDG/4chan-x/issues) with the following information:
  1. Precise steps to reproduce the problem, with the expected and actual results.
  2. [Console errors](https://github.com/MayhemYDG/4chan-x/wiki/FAQ#console-errors), if any.
  3. 4chan X version, browser variant, browser version, and Greasemonkey version if you are using it.
  4. Your exported settings. If your settings contain sensitive information (e.g. personas), edit the text file manually.

Respect these guidelines:
- Describe the issue clearly, put some effort into it. A one-liner isn't a good enough description.
- If you want to get your suggestion implemented sooner, make it convincing.
- If you want to criticize, make it convincing and constructive.
- Be mature. Act like an idiot and you will be blocked without warning.

## Development & Contribution

### Get started

- Install [node.js](http://nodejs.org/).
- Install [Grunt's CLI](http://gruntjs.com/) with `npm install -g grunt-cli`.
- Clone 4chan X.
- `cd` into it.
- Install/Update 4chan X dependencies with `npm install`.

### Build

- Build with `grunt`.
- Continuously build with `grunt watch`.

### Release

- Update the version with `grunt patch`, `grunt minor` or `grunt major`.
- Release with `grunt release`.

Note: this is only used to release new 4chan X versions, and is **not** needed or wanted in pull requests.

### Contribute

- Edit the sources.
- If the edits affect regular users, edit the changelog.
- Open a pull request.
