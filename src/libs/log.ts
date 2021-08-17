export class Starlog {
    public static debug(...args: any) {
        console.log("[\x1B[38;5;2mDEBUG\x1B[0m]", ...args)
    }
    public static warnning(...args: any) {
        console.log("[\x1B[38;5;208mWARNNING\x1B[0m]", ...args)
    }
}