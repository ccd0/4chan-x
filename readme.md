# Get Appchan X [HERE](http://zixaphir.github.com/appchan-x/).

# Building

- Install [node.js](http://nodejs.org/).
- Install [CoffeeScript](http://coffeescript.org/) with `npm install -g coffee-script`.
- Clone Appchan X.
- `cd` into it and build with `cake build`.
- For development (continuous builds), run `cake dev &`. Kill the process with `killall node`.

# Releasing

- Upgrade version with `cake -v VERSION upgrade`. Note that this is only used to
release new Appchan x versions, and is not needed or wanted in pull requests.

# Contributing

- Fork the repo
- Edit the CoffeeScript source
- Build the JavaScript
- If the edits affect regular users, edit the changelog
- Send a pull request
