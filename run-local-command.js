const execFile = require('child_process').execFile;

function toPromise(fn, ...args) {
    return new Promise((resolve, reject) => {
        fn(...args, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stdout, stderr });
            }

            resolve(stdout);
        });
    });
}

module.exports = function runLocalCommand(cmd, options) {
    return toPromise(execFile, './node_modules/.bin/' + cmd, options);
};
