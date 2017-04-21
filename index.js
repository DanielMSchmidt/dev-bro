#!/usr/bin/env node

const fs = require('fs');

const blessed = require('blessed');
const contrib = require('blessed-contrib');

const runLocalCommand = require('./run-local-command');

// Check if flow and jest are installed
if (!fs.existsSync('./node_modules/.bin/flow')) {
    console.error('We expect a local version of flow');
    process.exit(1);
}

if (!fs.existsSync('./node_modules/.bin/jest')) {
    console.error('We expect a local version of jest');
    process.exit(1);
}

// Prepare the terminal
const screen = blessed.screen({
    fullUnicode: true,
    smartCSR: true,
    autoPadding: true,
    title: '💪 dev-bro 💪'
});
screen.key(['escape', 'q', 'C-c'], () => {
    runLocalCommand('flow', ['stop']);
    screen.destroy();
    process.exit(0);
});

const grid = new contrib.grid({
    rows: 1,
    cols: 2,
    screen: screen
});
const jestBox = grid.set(0, 0, 1, 1, blessed.box, scrollBox('Jest'));
const flowBox = grid.set(0, 1, 1, 1, blessed.box, scrollBox('Flow'));

// Main Program
renderContent();
fs.watch('./', { persistent: true, recursive: true }, (eventType, filename) => {
    if (filename.indexOf('.watchman') !== -1) {
        return;
    }
    renderContent();
});

// Renders the content
function renderContent() {
    // run jest and flow in parallel
    flowBox.style.border.fg = 'blue';
    jestBox.style.border.fg = 'blue';
    flowBox.content = 'Running Flow...';
    jestBox.content = 'Running Jest...';
    screen.render();
    print(flowBox, runLocalCommand('flow', ['status']));
    print(jestBox, runLocalCommand('jest', ['-o']));
}

// Prints a single box
function print(box, promise) {
    promise.then(
        content => {
            box.style.border.fg = 'green';
            box.content = content + '\n\n\n';
            screen.render();
        },
        ({ stdout, stderr }) => {
            box.style.border.fg = 'red';
            box.content = stdout + stderr + '\n\n\n';
            screen.render();
        }
    );
}

// initializes a box with a label
function scrollBox(label) {
    return {
        label: label,
        tags: true,
        scrollable: true,
        scrollbar: {
            ch: ' '
        },
        border: {
            type: 'line' // or bg
        },
        keys: true,
        vi: true,
        alwaysScroll: true,
        mouse: true,
        style: {
            fg: 'white'
        }
    };
}
