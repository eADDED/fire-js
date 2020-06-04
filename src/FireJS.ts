// @ts-ignore
global.__MIN_PLUGIN_VERSION__ = "0.11.0";
// @ts-ignore
global.__FIREJS_VERSION__ = "0.13.0";
import ConfigMapper, {Config} from "./mappers/ConfigMapper";
import Cli from "./utils/Cli";
import Page from "./classes/Page";
import {Configuration, Stats} from "webpack";
import {join, relative} from "path";
import {mapPlugins} from "./mappers/PluginMapper";
import PageArchitect from "./architects/PageArchitect";
import {writeFileRecursively} from "./utils/Fs";
import {mkdirp} from "fs-extra"
import * as fs from "fs"
import StaticArchitect, {StaticConfig} from "./architects/StaticArchitect";
import {createMap} from "./mappers/PathMapper";
import WebpackArchitect from "./architects/WebpackArchitect";

export type WebpackConfig = Configuration;
export type WebpackStat = Stats;

export interface PathRelatives {
    libRel: string,
    mapRel: string
}

export interface $ {
    config?: Config,
    pageMap?: Map<string, Page>,
    cli?: Cli,
    rel?: PathRelatives,
    outputFileSystem?,
    inputFileSystem?,
    renderer?: StaticArchitect,
    pageArchitect?: PageArchitect
}

export interface Params {
    config?: Config,
    webpackConfig?: WebpackConfig
    outputFileSystem?,
    inputFileSystem?
}

export interface FIREJS_MAP {
    staticConfig: StaticConfig,
    pageMap: {
        [key: string]: string[]
    },
}

export default class {
    private readonly $: $ = {};

    constructor(params: Params) {
        if (params.config.paths.webpackConfig)
            throw new Error("pass webpack config as params instead of passing it's path");
        // @ts-ignore
        fs.mkdirp = mkdirp;
        this.$.inputFileSystem = params.inputFileSystem || fs
        this.$.outputFileSystem = params.outputFileSystem || fs;
        this.$.config = new ConfigMapper(this.$.inputFileSystem, this.$.outputFileSystem).getConfig(params.config)
        this.$.cli = new Cli(this.$.config.logMode);
        this.$.pageMap = createMap(this.$.config.paths.pages, this.$.inputFileSystem);
        if (!this.$.config.pages["404"]) {
            this.$.config.pages["404"] = relative(this.$.config.paths.pages, join(__dirname, "../web/404/404.jsx"))
            this.$.pageMap.set(this.$.config.pages["404"], new Page(this.$.config.pages["404"]));
        }
        this.$.rel = {
            libRel: relative(this.$.config.paths.dist, this.$.config.paths.lib),
            mapRel: relative(this.$.config.paths.dist, this.$.config.paths.map)
        }
        this.$.pageArchitect = new PageArchitect(this.$, new WebpackArchitect(this.$, params.webpackConfig), !!params.outputFileSystem, !!params.inputFileSystem);
    }

    async init() {
        this.$.cli.log("Mapping Plugins");
        if (!this.$.config.disablePlugins)
            if (this.$.config.paths.plugins)
                mapPlugins(this.$.inputFileSystem, this.$.config.paths.plugins, this.$.pageMap);
        this.$.cli.log("Building Externals");
        this.$.renderer = new StaticArchitect({
            rel: this.$.rel,
            pathToLib: this.$.config.paths.lib,
            externals: await this.$.pageArchitect.buildExternals(),
            explicitPages: this.$.config.pages,
            tags: this.$.config.templateTags,
            template: this.$.inputFileSystem.readFileSync(this.$.config.paths.template).toString()
        })
        //load externals only when they are required
        if (!this.$.pageArchitect.isOutputCustom) {
            this.$.cli.log("Initializing externals")
            // @ts-ignore
            global.window = {};
            this.$.renderer.param.externals.forEach(external => {
                require(join(this.$.config.paths.lib, external));
            });
            require("../web/LinkApi.js")
            // @ts-ignore
            global.React = global.window.React;
            // @ts-ignore
            global.ReactDOM = global.window.ReactDOM;
            // @ts-ignore
            global.ReactHelmet = global.window.ReactHelmet;
            // @ts-ignore
            global.LinkApi = global.window.LinkApi;
        }
        this.$.cli.log("Copying index chunk")
        const index_bundle_out_path = join(this.$.config.paths.lib, "i244ca8c4e9b1d7c62a82.js")
        this.$.outputFileSystem.exists(index_bundle_out_path, exists => {
            if (!exists)
                this.$.inputFileSystem.createReadStream(join(__dirname, "../web/dist/i244ca8c4e9b1d7c62a82.js")).pipe(this.$.outputFileSystem.createWriteStream(index_bundle_out_path));
        })
    }

    buildPage(page: Page) {
        return new Promise<void>((resolve, reject) => {
            this.$.pageArchitect.buildPage(page, () => {
                this.$.cli.ok(`Successfully built page ${page.toString()}`)
                page.plugin.paths.clear();
                page.plugin.onBuild((path, content) => {
                    page.plugin.paths.set(path, undefined);
                    writeFileRecursively(join(this.$.config.paths.map, `${path}.map.js`), `window.__MAP__=${JSON.stringify({
                        content,
                        chunks: page.chunks
                    })}`, this.$.outputFileSystem).catch(err => {
                        throw err
                    });
                    writeFileRecursively(join(this.$.config.paths.dist, `${path}.html`),
                        this.$.renderer.finalize(this.$.renderer.render(this.$.renderer.param.template, page, path, this.$.pageArchitect.isOutputCustom ? undefined : content)),
                        this.$.outputFileSystem
                    ).catch(err => {
                        throw err
                    });
                }, resolve).catch(err => {
                    throw err
                })
            }, reject)
        })
    }

    getContext(): $ {
        return this.$;
    }
}