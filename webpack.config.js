const path = require('path');

module.exports = {
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "printerWEB.js",
        library: "PrinterWEB"
    },
    mode: "production"
}