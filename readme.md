# Documentation

https://aeosynth.github.com/4chan-x

# Installing

[stable](https://github.com/aeosynth/4chan-x/raw/stable/4chan_x.user.js) - if you don't know what you're doing, choose this

[master](https://github.com/aeosynth/4chan-x/raw/master/4chan_x.user.js) - main development branch, turns into stable. can change frequently, so don't complain if other projects don't support this branch.

# Building

[install nodejs and npm](https://github.com/joyent/node/wiki/Installation),
install [coffee-script](https://github.com/jashkenas/coffee-script/) with
`npm install -g coffee-script`, clone 4chan x, cd into it and actually build
with `cake build`. for development (continuous builds), run `cake dev &`.
kill the process with `killall node`.
