"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = require("webpack");
const WebpackArchitect_1 = require("./WebpackArchitect");
const memory_fs_1 = require("memory-fs");
class default_1 {
    constructor(globalData) {
        this.$ = globalData;
    }
    buildExternals() {
        return new Promise((resolve, reject) => {
            this.build(new WebpackArchitect_1.default(this.$).externals(), undefined, stat => {
                stat.compilation.chunks.forEach(chunk => {
                    this.$.externals.push(...chunk.files);
                });
                resolve();
            }, reject);
        });
    }
    buildBabel(mapComponent, resolve, reject) {
        this.build(new WebpackArchitect_1.default(this.$).babel(mapComponent), undefined, stat => {
            if (this.logStat(stat)) //true if errors
                reject();
            else {
                filterMainChunk(stat, mapComponent, "babelChunk");
                resolve();
            }
        }, err => reject(err));
    }
    buildDirect(mapComponent, resolve, reject) {
        const fileSystem = this.$.config.pro ? undefined : new memory_fs_1.default();
        this.build(new WebpackArchitect_1.default(this.$).direct(mapComponent), fileSystem, stat => {
            if (!this.$.config.pro) {
                mapComponent.chunks = []; //re init for new chunks
                mapComponent.memoryFileSystem = fileSystem;
            }
            if (this.logStat(stat)) //true if errors
                reject();
            else {
                stat.compilation.chunks.forEach(chunk => {
                    chunk.files.forEach(file => {
                        if (file.startsWith("m")) {
                            mapComponent.chunks.unshift(file); //add main chunk to the top
                        }
                        else
                            mapComponent.chunks.push(file);
                    });
                });
                resolve();
            }
        }, reject);
    }
    build(config, fileSystem, resolve, reject) {
        const compiler = webpack_1.default(config);
        if (fileSystem)
            compiler.outputFileSystem = fileSystem;
        if (config.watch)
            compiler.watch({}, (err, stat) => {
                if (err)
                    reject(err);
                else
                    resolve(stat);
            });
        else
            compiler.run((err, stat) => {
                if (err)
                    reject(err);
                else
                    resolve(stat);
            });
    }
    logStat(stat) {
        let errorCount = 0;
        if (this.$.args["--verbose"]) {
            this.$.cli.log("Stat");
            this.$.cli.normal(stat);
        }
        if (stat.hasWarnings()) {
            this.$.cli.warn(`Warning in page ${stat.compilation.name}\n`, ...stat.compilation.warnings);
        }
        if (stat.hasErrors()) {
            if (stat.compilation.errors.length === 0)
                this.$.cli.error(`Error in page ${stat.compilation.name}`);
            else {
                this.$.cli.error(`Error in page ${stat.compilation.name}\n`, ...stat.compilation.errors);
            }
            if (this.$.config.pro)
                this.$.cli.log("Some errors might not be displayed in production mode. Try moving to development mode.");
            this.$.cli.error(`Unable to build page ${stat.compilation.name} with ${errorCount} error(s)`);
            return true;
        }
    }
}
exports.default = default_1;
function filterMainChunk(stat, mapComponent, property) {
    stat.compilation.chunks.forEach(chunk => {
        chunk.files.forEach(file => {
            if (file.startsWith("m")) {
                mapComponent[property] = file;
            }
            else //don't add babel main
                mapComponent.chunks.push(file);
        });
    });
}