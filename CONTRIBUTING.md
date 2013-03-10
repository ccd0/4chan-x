## Reporting bugs

1. Make sure both your **browser** and **4chan X** are up to date.
2. Disable your other extensions & scripts to identify conflicts.
3. If your issue persists, open a [new issue](https://github.com/MayhemYDG/4chan-x/issues) with the following information:
  1. Report precise steps to reproduce the problem.
  2. Report console errors, if any.
  3. Report browser version.
  4. Include your exported settings.

Open your console with:
- `Ctrl + Shift + J` on Chrome.
- `Ctrl + Shift + K` on Firefox.
- `Ctrl + Shift + O` on Opera.

## Development & Contribution

### Get started

- Install [node.js](http://nodejs.org/).
- Install [Grunt's CLI](http://gruntjs.com/) with `npm install -g grunt-cli`.
- Clone 4chan X.
- `cd` into it.
- Install 4chan X dependencies with `npm install`.

### Build

- Build with `grunt`.
- Continuously build with `grunt watch`.

### Release

- To patch, run `grunt patch` (`0.0.x` version bump).
- To upgrade, run `grunt upgrade` (`0.x.0` version bump).
- Release with `grunt release`.

Note: this is only used to release new 4chan X versions, and is **not** needed or wanted in pull requests.

### Contribute

- Edit the CoffeeScript sources.
- Build the JavaScript.
- If the edits affect regular users, edit the changelog.
- Fork the repository.
- Open a pull request.
