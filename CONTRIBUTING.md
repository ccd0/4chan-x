## Reporting bugs

Bug reports and feature requests for 4chan X are tracked at **https://github.com/ccd0/4chan-x/issues?q=is%3Aopen+sort%3Aupdated-desc**.

You can submit a bug report / feature request either via your Github account or the [anonymous report form](https://gitreports.com/issue/ccd0/4chan-x).

If you're reporting a bug, the more detail you can give, the better. If I can't reproduce your bug, I probably won't be able to fix it. You can help by doing the following:

1. Include precise steps to reproduce the problem, with the expected and actual results.
2. Make sure your browser, 4chan X, and userscript manager (e.g. Greasemonkey, ViolentMoney, or Tampermonkey) are up to date. **Include the versions you're using in bug reports.**
3. Open your console with Shift+Control+J (⇧⌘J on OS X Firefox, ⌘⌥J on OS X Chromium), and **look for error messages**, especially ones that occur at the same time as the bug. Include these in your bug report. If you're using Firefox, be sure to check the browser console (Shift+Control+J), not just the web console (Shift+Control+K) as errors may not show up in the latter. Messages about "Content Security Policy" are expected and can be ignored.
4. If other people (including me) aren't having your problem, **test whether it happens in a fresh profile**. Here are instructions for [Firefox](https://support.mozilla.org/en-US/kb/profile-manager-create-and-remove-firefox-profiles) and [Chromium](https://developer.chrome.com/devtools/docs/clean-testing-environment).
5. **Please mention any other extensions / scripts you are using.** To check if a bug is due to a conflict with another extension, temporarily disable any other extensions and userscripts. If the bug goes away, turn them back on one by one until you find the one causing the problem.
6. To test if the bug occurs under the default settings or only with specific settings, back up your settings and reset them using the **Export** and **Reset Settings** links in the settings panel. If the bug only occurs under specific settings, upload your exported settings to a site like https://paste.installgentoo.com/, and link to it in your bug report. If your settings contains sensitive information (e.g. personas), edit the text file manually.
7. Test if the bug occurs using the **native extension** with 4chan X disabled. If it does, it's likely a problem with 4chan or your browser rather than with 4chan X.

## Development & Contribution

### Get started

- Install [git](https://git-scm.com/), [node.js](https://nodejs.org/), and [npm](https://www.npmjs.com/) (usually distributed with node), and GNU Make (on Windows, the [MinGW](http://www.mingw.org/) port will work).
- Clone 4chan X: `git clone https://github.com/ccd0/4chan-x.git`<br>(If this is taking too long, you can add `--depth 100` to fetch only recent history.)
- Open the directory: `cd 4chan-x`

### Build

- Build with `make`.

### Contribute

- 4chan X is mostly written in [CoffeeScript](http://coffeescript.org/). If you're already familiar with Javascript, it doesn't take long to pick up.
- Edit the sources in the src/ directory (not the compiled scripts in builds/).
- Compile the script with: `make` (this should fetch needed dependencies automatically; if not, do an `npm install` first)
- Install the compiled script (found in the testbuilds/ directory), and test your changes.
- Make sure you have set your name and email as you want them, as they will be published in your commit message:<br>`git config user.name yourname`<br>`git config user.email youremail`
- Commit your changes: `git commit -a`
- Open a pull request by doing any of the following:
  - Fork this repository on Github, push your changes to your fork, and make a pull request through the Github website.
  - Push your changes to any online Git repository, and [open an issue](https://gitreports.com/issue/ccd0/4chan-x) with an explanation of your changes and the URL, branch, and commit you want me to pull from.
  - Export your changes via `git bundle` (e.g. `git bundle create file.bundle master..your-branch`), and upload them to a file host like https://jii.moe/. Then [open an issue](https://gitreports.com/issue/ccd0/4chan-x) with an explanation of your changes and the URL of the file.

Archive list updates should go to https://github.com/MayhemYDG/archives.json.

### More info

Further documentation is available at https://github.com/ccd0/4chan-x/wiki/Developer-Documentation.
