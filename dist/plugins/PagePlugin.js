"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagePlugMinVer = void 0;
const FireJSPlugin_1 = require("./FireJSPlugin");
exports.PagePlugMinVer = 0.5;
class default_1 extends FireJSPlugin_1.default {
    constructor(page) {
        super(0.5, FireJSPlugin_1.PluginCode.PagePlugin);
        this.page = page;
    }
    onBuild(renderPage, ...extra) {
        return __awaiter(this, void 0, void 0, function* () {
            renderPage("/" + this.page.toString().substring(0, this.page.toString().lastIndexOf(".")), {});
        });
    }
}
exports.default = default_1;