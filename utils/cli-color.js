const {args} = require("../store/global.data");
//tick ✓ log # warning ! error X

module.exports.normal = console.log;
if (args["--no_output"]) {
    module.exports.normal = (...messages) => {
    }
    module.exports.ok = (...messages) => {
    };
    module.exports.error = (...messages) => {
    };
    module.exports.warn = (...messages) => {
    };
    module.exports.log = (...messages) => {
    };
    module.exports.throwError = error => {
        throw error
    };
} else if (args["--no_color"]) {
    module.exports.ok = console.log;
    module.exports.error = console.error;
    module.exports.warn = console.warn;
    module.exports.log = console.log;
} else {
    module.exports.log = (...messages) => console.error('\x1b[34m#', ...messages, '\x1b[0m');
    module.exports.ok = (...messages) => console.error('\x1b[32m✓', ...messages, '\x1b[0m');
    module.exports.error = (...messages) => console.error('\x1b[31mX', ...messages, '\x1b[0m');
    module.exports.warn = (...messages) => console.error('\x1b[33m!', ...messages, '\x1b[0m');
}