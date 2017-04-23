const fs = require('fs');
const blessed = require('blessed');

const print = require('./print');
const runLocalCommand = require('./run-local-command');
const scrollBox = require('./create-scroll-box');

module.exports = function(
  screen,
  name,
  runCommandArgs = [],
  exitCommandArgs = false
) {
  let box = null;

  return {
    supported: function() {
      return fs.existsSync('./node_modules/.bin/' + name);
    },

    init: function(grid, index) {
      box = grid.set(0, index, 1, 1, blessed.box, scrollBox(name));
      return box;
    },

    run: function() {
      box.style.border.fg = 'blue';
      box.content = 'Running ' + name + ' ...';
      print(screen, box, runLocalCommand(name, runCommandArgs));
    },

    cleanUp: function() {
      if (exitCommandArgs) {
        runLocalCommand(name, exitCommandArgs);
      }
    },
  };
};
