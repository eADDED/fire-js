import ConfigMapper, {Args, Config, getArgs} from "./mappers/ConfigMapper";
import Cli from "./utils/Cli";
import Page from "./classes/Page";
import {Configuration, Stats} from "webpack";
import {join, relative} from "path";
import {mapPlugins} from "./mappers/PluginMapper";
import PageArchitect from "./architects/PageArchitect";
import {moveChunks, writeFileRecursively} from "./utils/Fs";
import * as fs from "fs"
import StaticArchitect, {StaticConfig} from "./architects/StaticArchitect";
import {convertToMap, createMap} from "./mappers/PathMapper";
import WebpackArchitect from "./architects/WebpackArchitect";

export type WebpackConfig = Configuration;
export type WebpackStat = Stats;

export interface PathRelatives {
    libRel: string,
    mapRel: string
}

export interface ChunkGroup {
    babelChunk: string,
    chunks: string[]
}

export interface $ {
    args?: Args,
    config?: Config,
    pageMap?: Map<string, Page>,
    cli?: Cli,
    template?: string,
    rel?: PathRelatives,
    outputFileSystem?,
    inputFileSystem?,
    renderer?: StaticArchitect,
    pageArchitect?: PageArchitect
}

export interface Params {
    config?: Config,
    args?: Args,
    pages?: string[],
    template?: string,
    webpackConfig?: WebpackConfig
    outputFileSystem?,
    inputFileSystem?
}

export interface FIREJS_MAP {
    staticConfig: StaticConfig,
    pageMap: {
        [key: string]: ChunkGroup
    },
    template: string
}

export default class {
    private readonly $: $ = {};

    constructor(params: Params = {}) {
        this.$.args = params.args || getArgs();
        this.$.cli = new Cli(this.$.args["--plain"] ? "--plain" : this.$.args["--silent"] ? "--silent" : undefined);
        if (this.$.args["--help"]) {
            console.log("\n\n    \x1b[1m Fire JS \x1b[0m - Highly customizable no config react static site generator built on the principles of gatsby, nextjs and create-react-app.");
            console.log("\n    \x1b[1m Flags \x1b[0m\n" +
                "\n\t\x1b[34m--pro, -p\x1b[0m\n\t    Production Mode\n" +
                "\n\t\x1b[34m--conf, -c\x1b[0m\n\t    Path to Config file\n" +
                "\n\t\x1b[34m--verbose, -v\x1b[0m\n\t    Log Webpack Stat\n" +
                "\n\t\x1b[34m--plain\x1b[0m\n\t    Log without styling i.e colors and symbols\n" +
                "\n\t\x1b[34m--silent, s\x1b[0m\n\t    Log errors only\n" +
                "\n\t\x1b[34m--disable-plugins\x1b[0m\n\t    Disable plugins\n" +
                "\n\t\x1b[34m--help, -h\x1b[0m\n\t    Help")
            console.log("\n     \x1b[1mVersion :\x1b[0m 0.10.1");
            console.log("\n     \x1b[1mVisit https://github.com/eAdded/FireJS for documentation\x1b[0m\n\n")
            process.exit(0);
        }
        this.$.inputFileSystem = params.inputFileSystem || fs;
        this.$.outputFileSystem = params.outputFileSystem || fs;
        this.$.config = new ConfigMapper(this.$.cli, this.$.args).getConfig(params.config);
        this.$.template = params.template || this.$.inputFileSystem.readFileSync(this.$.config.paths.template).toString();
        this.$.pageMap = params.pages ? convertToMap(params.pages) : createMap(this.$.config.paths.pages, this.$.inputFileSystem);
        this.$.rel = {
            libRel: relative(this.$.config.paths.dist, this.$.config.paths.lib),
            mapRel: relative(this.$.config.paths.dist, this.$.config.paths.map)
        }
        this.$.pageArchitect = new PageArchitect(this.$, new WebpackArchitect(this.$, params.webpackConfig), !!params.outputFileSystem, !!params.inputFileSystem);
    }

    async init() {
        this.$.cli.log("Mapping Plugins");
        if (!this.$.args["--disable-plugins"])
            if (this.$.config.paths.plugins)
                mapPlugins(this.$.inputFileSystem, this.$.config.paths.plugins, this.$.pageMap);
            else
                throw new Error("Plugins Dir Not found")
        this.$.cli.log("Building Externals");
        this.$.renderer = new StaticArchitect({
            rel: this.$.rel,
            babelPath: this.$.config.paths.babel,
            externals: await this.$.pageArchitect.buildExternals(),
            explicitPages: this.$.config.pages,
            tags: this.$.config.templateTags,
        })
    }

    buildPro() {
        return new Promise<any>((resolve, reject) => {
                if (!this.$.config.pro)
                    throw new Error("Not in production mode. Make sure to pass [--pro, -p] flag");
                this.$.cli.log("Building Pages");
                const promises = [];
                for (const page of this.$.pageMap.values())
                    promises.push(new Promise(async resolve => {
                        await this.$.pageArchitect.buildBabel(page);
                        await moveChunks(page, this.$, this.$.outputFileSystem)
                        this.$.pageArchitect.buildDirect(page, async () => {
                            this.$.cli.ok(`Successfully built page ${page.toString()}`)
                            await page.plugin.initPaths();
                            await page.plugin.paths.forEach(path => {
                                (async () => {
                                    const content = await page.plugin.getContent(path)
                                    await Promise.all([
                                        writeFileRecursively(join(this.$.config.paths.map, `${path}.map.js`), `window.__MAP__=${JSON.stringify({
                                            content,
                                            chunks: page.chunkGroup.chunks
                                        })}`, this.$.outputFileSystem),
                                        writeFileRecursively(join(this.$.config.paths.dist, `${path}.html`),
                                            this.$.renderer.finalize(this.$.renderer.render(this.$.template, page, path, content)),
                                            this.$.outputFileSystem
                                        )
                                    ]);
                                    resolve();
                                })()
                            })
                        }, err => {
                            throw err;
                        })
                    }))
                Promise.all(promises).then(resolve).catch(reject);
            }
        )
    }

    getContext(): $ {
        return this.$;
    }
}