These external files are produced manually.

pixi.js
---------

For details, see https://github.com/photonstorm/phaser/issues/1974.

1. Clone https://github.com/photonstorm/phaser
2. Within the repo, run `npm install && npm install -g grunt-cli`
3. Run `grunt custom --exclude p2,creature,ninja --split true`
4. A file will be in `/dist/pixi.js`. Copy that here.
