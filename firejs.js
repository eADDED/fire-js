#!/usr/bin/env node
const FireJS = require("./index");
const app = new FireJS({});
if (app.getContext().config.pro)
    app.buildPro(() => {
        app.getContext().cli.ok("DONE ⌐■-■")
    });
else {
    require("./server")(app);
}