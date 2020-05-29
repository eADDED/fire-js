/// <reference types="node" />
import * as fs from "fs";
export interface Config {
    pro?: boolean;
    verbose?: boolean;
    logMode?: "plain" | "silent";
    disablePlugins?: boolean;
    paths?: {
        root?: string;
        src?: string;
        pages?: string;
        dist?: string;
        template?: string;
        lib?: string;
        map?: string;
        webpack?: string;
        static?: string;
        plugins?: string;
    };
    templateTags?: TemplateTags;
    pages?: ExplicitPages;
}
export interface ExplicitPages {
    "404"?: string;
}
export interface TemplateTags {
    script?: string;
    static?: string;
    head?: string;
    style?: string;
    unknown?: string;
}
export default class {
    inputFileSystem: any;
    outputFileSystem: any;
    constructor(inputFileSystem?: typeof fs, outputFileSystem?: typeof fs);
    getUserConfig(path: string): Config | never;
    getConfig(config?: Config): Config;
    private makeAbsolute;
    private throwIfNotFound;
    private undefinedIfNotFound;
    private makeDirIfNotFound;
}
