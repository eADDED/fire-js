import MemoryFileSystem = require("memory-fs");
import { $, WebpackConfig, WebpackStat } from "../index";
import MapComponent from "../classes/MapComponent";
export default class {
    private readonly $;
    constructor(globalData: $);
    buildExternals(): Promise<unknown>;
    buildBabel(mapComponent: MapComponent, resolve: () => void, reject: (err: any | undefined) => void): void;
    buildDirect(mapComponent: MapComponent, resolve: () => void, reject: (err: any | undefined) => void): void;
    build(config: WebpackConfig, fileSystem: MemoryFileSystem | undefined, resolve: (stat: any) => void, reject: (err: any) => void): void;
    logStat(stat: WebpackStat): boolean;
}
