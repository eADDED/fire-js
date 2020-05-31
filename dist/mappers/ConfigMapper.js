"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const lodash_1 = require("lodash");
function getArgs() {
    return require("arg")({
        //Types
        "--pro": Boolean,
        "--conf": String,
        "--verbose": Boolean,
        "--plain": Boolean,
        "--silent": Boolean,
        "--disable-plugins": Boolean,
        "--help": Boolean,
        //Aliases
        "-p": "--pro",
        "-c": "--conf",
        "-v": "--verbose",
        "-s": "--silent",
        "-h": "--help",
    });
}
exports.getArgs = getArgs;
class default_1 {
    constructor(cli, args) {
        this.makeAbsolute = (root, pathTo) => {
            return path_1.isAbsolute(pathTo) ? pathTo : path_1.resolve(root, pathTo);
        };
        this.throwIfNotFound = (name, pathTo) => {
            if (!fs_1.existsSync(pathTo)) {
                this.cli.error(`${name} not found`, pathTo);
                throw new Error();
            }
        };
        this.cli = cli;
        this.args = args;
    }
    getUserConfig() {
        const wasGiven = this.args["--conf"]; //to store if user gave this arg so that log can be changed
        if (this.args["--conf"]) { //tweak conf path
            if (!path_1.isAbsolute(this.args["--conf"]))
                this.args["--conf"] = path_1.resolve(process.cwd(), this.args["--conf"]); //create absolute path
        }
        else
            this.args["--conf"] = path_1.resolve(process.cwd(), `firejs.config.js`);
        return fs_1.existsSync(this.args["--conf"]) ? (() => {
            this.cli.log(`Loading config from ${this.args["--conf"]}`);
            const config = require(this.args["--conf"]);
            return config.default || config;
        })() : (() => {
            if (wasGiven)
                this.cli.warn(`Config not found at ${this.args["--conf"]}. Loading defaults`);
            return {};
        })();
    }
    getConfig(userConfig = undefined) {
        this.cli.log("Loading configs");
        const config = userConfig ? lodash_1.cloneDeep(userConfig) : this.getUserConfig();
        config.pro = this.args["--pro"] ? true : config.pro || false;
        this.cli.log("mode : " + (config.pro ? "production" : "development"));
        config.paths = config.paths || {};
        this.throwIfNotFound("root dir", config.paths.root = config.paths.root ? this.makeAbsolute(process.cwd(), config.paths.root) : process.cwd());
        this.throwIfNotFound("src dir", config.paths.src = config.paths.src ? this.makeAbsolute(config.paths.root, config.paths.src) : path_1.join(config.paths.root, "src"));
        this.throwIfNotFound("pages dir", config.paths.pages = config.paths.pages ? this.makeAbsolute(config.paths.root, config.paths.pages) : path_1.join(config.paths.src, "pages"));
        //out
        this.makeDirIfNotFound(config.paths.out = config.paths.out ? this.makeAbsolute(config.paths.root, config.paths.out) : path_1.join(config.paths.root, "out"));
        this.makeDirIfNotFound(config.paths.dist = config.paths.dist ? this.makeAbsolute(config.paths.root, config.paths.dist) : path_1.join(config.paths.out, "dist"));
        this.makeDirIfNotFound(config.paths.babel = path_1.join(config.paths.out, "babel"));
        config.paths.template = config.paths.template ? this.makeAbsolute(config.paths.root, config.paths.template) : path_1.resolve(__dirname, "../../web/template.html");
        this.makeDirIfNotFound(config.paths.lib = config.paths.lib ? this.makeAbsolute(config.paths.root, config.paths.lib) : path_1.join(config.paths.dist, "lib"));
        this.makeDirIfNotFound(config.paths.map = config.paths.map ? this.makeAbsolute(config.paths.root, config.paths.map) : path_1.join(config.paths.lib, "map"));
        //configs
        this.undefinedIfNotFound(config.paths, "webpack", config.paths.root, "webpack.config.ts", "webpack config");
        //static dir
        this.undefinedIfNotFound(config.paths, "static", config.paths.src, "static", "static dir");
        //plugins
        this.undefinedIfNotFound(config.paths, "plugins", config.paths.src, "plugins", "plugins dir");
        //html template tags
        config.templateTags = config.templateTags || {};
        config.templateTags.script = config.templateTags.script || "<%=SCRIPT=%>";
        config.templateTags.static = config.templateTags.static || "<%=STATIC=%>";
        config.templateTags.head = config.templateTags.head || "<%=HEAD=%>";
        config.templateTags.style = config.templateTags.style || "<%=STYLE=%>";
        config.templateTags.unknown = config.templateTags.unknown || "<%=UNKNOWN=%>";
        //pages
        config.pages = config.pages || {};
        this.throwIfNotFound("404 page", path_1.join(config.paths.pages, config.pages["404"] = config.pages["404"] || "404.js"));
        return config;
    }
    undefinedIfNotFound(object, property, pathRoot, name, msg) {
        if (object[property]) {
            object[property] = this.makeAbsolute(pathRoot, object[property]);
            this.throwIfNotFound(msg, object[property]);
        }
        else if (!fs_1.existsSync(object[property] = path_1.resolve(pathRoot, name)))
            object[property] = undefined;
    }
    makeDirIfNotFound(path) {
        if (!fs_1.existsSync(path))
            fs_1.mkdirSync(path);
    }
}
exports.default = default_1;
