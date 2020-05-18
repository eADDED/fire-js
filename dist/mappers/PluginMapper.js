"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PagePath_1 = require("../classes/PagePath");
const Fs_1 = require("../utils/Fs");
const PathArchitect_1 = require("../architects/PathArchitect");
const path_1 = require("path");
class default_1 {
    constructor(globalData) {
        this.$ = globalData;
    }
    mapPlugins() {
        this.$.config.plugins.forEach(path => {
            this.mapPlugin(path);
        });
    }
    mapPlugin(path) {
        const plugin = require(path);
        for (const page in plugin) {
            const mapComponent = this.$.map.get(page);
            if (!mapComponent) //check if this page exists
                throw new TypeError(`page ${page} either does not exists or is not mapped`);
            mapComponent.plugin = plugin[page];
        }
    }
    applyPlugin(mapComponent) {
        const pathArchitect = new PathArchitect_1.default(this.$);
        mapComponent.paths = []; //reset paths
        if (mapComponent.plugin) {
            this.parsePagePaths(mapComponent.plugin, (path, content) => {
                const pagePath = new PagePath_1.default(mapComponent, path, content, this.$);
                if (this.$.config.pro) {
                    Fs_1.writeFileRecursively(//write content
                    path_1.join(this.$.config.paths.dist, pagePath.MapPath), `window.__MAP__=${JSON.stringify(pagePath.Map)}`);
                    pathArchitect.writePath(mapComponent, pagePath); //write html file
                }
                else
                    mapComponent.paths.push(pagePath); //push in dev mode
            }, err => {
                throw err;
            });
        }
        else {
            //make default page
            let path = mapComponent.getPage();
            path = "/" + path.substring(0, path.lastIndexOf(mapComponent.getExt()));
            const pagePath = new PagePath_1.default(mapComponent, path, {}, this.$);
            if (this.$.config.pro) {
                Fs_1.writeFileRecursively(//write content
                path_1.join(this.$.config.paths.dist, pagePath.MapPath), `window.__MAP__=${JSON.stringify(pagePath.Map)}`);
                pathArchitect.writePath(mapComponent, pagePath); //write html when pro
            }
            else
                mapComponent.paths.push(pagePath); //push when dev
        }
    }
    parsePagePaths(paths, callback, reject) {
        if (Array.isArray(paths)) {
            paths.forEach(path => {
                if (typeof path === "string") {
                    callback(path, {});
                }
                else if (path.constructor.name === "AsyncFunction") {
                    path().then(value => {
                        this.parsePagePaths(value, callback, reject);
                    });
                }
                else if (typeof path === "object") {
                    if (typeof path.path !== "string") {
                        reject(new TypeError(`Expected path:string got ${typeof path.path}`));
                        return;
                    }
                    if (typeof path.content !== "object") {
                        reject(new TypeError(`Expected content:object got ${typeof path.path}`));
                        return;
                    }
                    callback(path.path, path.content);
                }
                else
                    reject(new TypeError(`Expected String | Object | Array got ${typeof path} in plugin for path ${path}`));
            });
        }
        else {
            reject(new TypeError(`Expected array got ${typeof paths}`));
        }
    }
}
exports.default = default_1;