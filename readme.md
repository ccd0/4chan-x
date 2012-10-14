# Get Appchan X [HERE](http://zixaphir.github.com/appchan-x/).

## Reporting bugs

1. Make sure your **browser** & **Appchan X** are up to date.
2. Please include as much information as possible, including your internet browser
3. Disable your other extensions & scripts.
4. If your issue persists:
  1. Report precise steps to reproduce the problem.
  2. Report console errors, if any.
  3. Report browser and browser version.

Open your console with:
- `Ctrl + Shift + J` on Chrome & Firefox
- `Ctrl + Shift + O` on Opera.

## Development & Contribution

### Get started

- Clone Appchan X.
- `cd` into it.
- Install [node.js](http://nodejs.org/).
- Install [Grunt](http://gruntjs.com/) with `npm install -g grunt`.
- Install Appchan X dependencies with `npm install`.

### Build

- Build with `grunt`.
- For development (continuous builds), run `grunt watch`.

### Release

- To patch, run `grunt patch` (`0.0.x` version bump).
- To upgrade, run `grunt upgrade` (`0.x.0` version bump).
- Release with `grunt release`.

Note that this is only used to release new Appchan X versions, and is not needed or wanted in pull requests.

### Contributing

- Fork the repo
- Edit the CoffeeScript source
- Build the JavaScript
- If the edits affect regular users, edit the changelog
- Send a pull request
