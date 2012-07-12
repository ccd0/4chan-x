# Get 4chan X [HERE](http://ihavenoface.github.com/4chan-x/).

# Building

- Install [node.js](http://nodejs.org/).
- Install [CoffeeScript](http://coffeescript.org/) with `npm install -g coffee-script`.
- Clone 4chan X.
- `cd` into it and build with `cake build`.
- For development (continuous builds), run `cake dev &`. Kill the process with `killall node`.

# Releasing

- Upgrade version with `cake -v VERSION upgrade`. Note that this is only used to
release new 4chan x versions, and is not needed or wanted in pull requests.

# Contributing

- Edit the CoffeeScript source
- Build the JavaScript
- If the edits affect regular users, edit the changelog
- Fork the repo
- Send a pull request
