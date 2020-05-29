import arg = require("arg");

export interface Args {
    "--export"?: boolean,              //Production Mode
    "--conf"?: string,              //Path to Config file
    "--verbose"?: boolean,          //Log Webpack Stat
    "--plain"?: boolean,            //Log without styling i.e colors and symbols
    "--silent"?: boolean,           //Log errors only
    "--disable-plugins"?: boolean,  //Disable plugins
    "--help"?: boolean,             //Help
    "--fly"?: boolean               //Export for fly
}

export function getArgs(): Args {
    return arg({
        //Types
        "--export": Boolean,
        "--pro": Boolean,
        "--conf": String,
        "--verbose": Boolean,
        "--plain": Boolean,
        "--silent": Boolean,
        "--disable-plugins": Boolean,
        "--help": Boolean,
        //Aliases
        "-e": "--export",
        "-p": "--pro",
        "-c": "--conf",
        "-v": "--verbose",
        "-s": "--silent",
        "-h": "--help"
    })
}