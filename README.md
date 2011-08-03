# Installing

[master](https://github.com/aeosynth/4chan-x/raw/master/4chan_x.user.js)

[master](https://github.com/aeosynth/4chan-x/raw/stable/4chan_x.user.js)

# Building

[install nodejs and npm](https://github.com/joyent/node/wiki/Installation),
install [coffee-script](https://github.com/jashkenas/coffee-script/) with
`npm install -g coffee-script`, clone 4chan x, cd into it and run
`npm link coffee-script`. actually build it with `cake build`. for development
(continuous builds), run `cake dev &`.  kill the process with `killall node`.
