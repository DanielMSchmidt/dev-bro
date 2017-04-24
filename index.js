#!/usr/bin/env node

const fs = require('fs');

const blessed = require('blessed');
const contrib = require('blessed-contrib');

const runLocalCommand = require('./run-local-command');
const scrollBox = require('./create-scroll-box');
const createPanel = require('./create-panel');

// Prepare the terminal
const screen = blessed.screen({
  fullUnicode: true,
  smartCSR: true,
  autoPadding: true,
  title: '💪 dev-bro 💪',
});

screen.key(['escape', 'q', 'C-c'], () => {
  commands.forEach(({cleanUp}) => cleanUp());
  screen.destroy();
  process.exit(0);
});

const commands = [
  createPanel(screen, 'jest', ['-o']),
  createPanel(screen, 'flow', ['status'], ['stop']),
];

const supportedCommands = commands.filter(({supported}) => supported());

if (!supportedCommands.length) {
  screen.destroy();
  console.log('Nothing seems to be supported');
  process.exit(1);
}

const grid = new contrib.grid({
  rows: 1,
  cols: supportedCommands.length,
  screen: screen,
});

supportedCommands.forEach(({init}, index) => init(grid, index));

function renderContent() {
  supportedCommands.forEach(({run}) => run());
}

// Main Program
renderContent();
fs.watch('./', {persistent: true, recursive: true}, (eventType, filename) => {
  if (filename.indexOf('.watchman') !== -1) {
    return;
  }
  renderContent();
});
