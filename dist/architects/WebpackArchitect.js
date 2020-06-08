"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const path_1 = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanObsoleteChunks = require("webpack-clean-obsolete-chunks");
class default_1 {
    constructor(globalData, userConfig = {}) {
        this.$ = globalData;
        userConfig.entry = userConfig.entry || {};
        userConfig.output = userConfig.output || {};
        // @ts-ignore
        userConfig.module = userConfig.module || {};
        userConfig.module.rules = userConfig.module.rules || [];
        userConfig.externals = userConfig.externals || {};
        userConfig.plugins = userConfig.plugins || [];
        this.userConfig = userConfig;
    }
    forExternals() {
        const conf = {
            target: 'web',
            mode: process.env.NODE_ENV,
            entry: {
                "e": path_1.join(__dirname, "../../web/external_group_semi.js"),
                "r": path_1.join(__dirname, "../../web/renderer.js"),
            },
            output: {
                path: this.$.config.paths.lib,
                filename: "[name][contentHash].js"
            }
        };
        conf.entry[path_1.join(path_1.relative(this.$.config.paths.lib, this.$.config.paths.cache), "f")] = path_1.join(__dirname, "../../web/external_group_full.js");
        return conf;
    }
    forPage(page) {
        let mergedConfig = Object.assign({ 
            //settings which can be changed by user
            target: 'web', mode: process.env.NODE_ENV, 
            //add config base to user config to prevent undefined errors
            optimization: {
                splitChunks: {
                    chunks: 'all',
                    minChunks: Infinity
                },
                usedExports: true,
                minimize: true
            } }, lodash_1.cloneDeep(this.userConfig));
        mergedConfig.externals["react"] = 'React';
        mergedConfig.externals["react-dom"] = 'ReactDOM';
        const cssLoaderUse = [MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    modules: {
                        hashPrefix: 'hash',
                    },
                },
            }
        ];
        mergedConfig.module.rules.push({
            test: /\.(js|jsx)$/,
            use: {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: path_1.join(this.$.config.paths.cache, ".babelCache"),
                    presets: ["@babel/preset-env", "@babel/preset-react"]
                }
            },
        }, {
            test: /\.sass$/i,
            loader: [...cssLoaderUse, 'sass-loader']
        }, {
            test: /\.less$/i,
            loader: [...cssLoaderUse, 'less-loader']
        }, {
            test: /\.css$/i,
            use: cssLoaderUse
        });
        mergedConfig.plugins.push(new MiniCssExtractPlugin({
            filename: (mergedConfig.output.chunkFilename || "c[contentHash]") + ".css"
        }), new CleanObsoleteChunks());
        mergedConfig.name = page.toString();
        mergedConfig.entry = path_1.join(this.$.config.paths.pages, mergedConfig.name);
        mergedConfig.output.filename = (mergedConfig.output.filename || "m[contentHash]") + ".js";
        mergedConfig.output.chunkFilename = (mergedConfig.output.chunkFilename || "c[contentHash]") + ".js";
        mergedConfig.output.publicPath = `/${this.$.rel.libRel}/`;
        mergedConfig.output.path = this.$.config.paths.lib;
        mergedConfig.output.library = "__FIREJS_APP__";
        mergedConfig.output.libraryTarget = "window";
        return mergedConfig;
    }
}
exports.default = default_1;
