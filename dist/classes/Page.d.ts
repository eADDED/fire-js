import { ChunkGroup } from "../index";
import Plugin from "./Plugin";
export default class {
    chunkGroup: ChunkGroup;
    plugin: Plugin;
    private readonly name;
    constructor(page: string);
    toString(): string;
}
