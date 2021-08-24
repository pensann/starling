import { stdout } from "single-line-log";
export class Starlog {
    public static debug(...args: any) {
        console.log("[\x1B[38;5;2mDEBUG\x1B[0m]", ...args)
    }
    public static warnning(...args: any) {
        console.log("[\x1B[38;5;208mWARNNING\x1B[0m]", ...args)
    }
    public static error(...args: any) {
        console.log("[\x1B[38;5;1mERROR\x1B[0m]", ...args)
    }
    public static info(...args: any) {
        console.log("[\x1B[38;5;44mINFO\x1B[0m]", ...args)

    }
    public static infoOneLine(...args: any) {
        stdout("[\x1B[38;5;44mINFO\x1B[0m] " + args)
    }
}