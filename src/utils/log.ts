enum LOG {
    FATAL,
    ERROR,
    WARN,
    INFO,
    DEBUG
}

// curl -s https://gist.githubusercontent.com/HaleTom/89ffe32783f89f403bba96bd7bcd1263/raw/ | bash
function starlog(level: LOG, ...str: any[]) {
    let prefix = ""
    switch (level) {
        case LOG.INFO:
            prefix = "[\x1B[38;5;44mINFO\x1B[0m]"
            break;
        case LOG.WARN:
            prefix = "[\x1B[38;5;208mWARN\x1B[0m]"
            break;
        case LOG.ERROR:
            prefix = "[\x1B[38;5;1mERROR\x1B[0m]"
            break
        case LOG.DEBUG:
            prefix = "[\x1B[38;5;2mDEBUG\x1B[0m]"
            break
        default:
            break;
    }
    // 日志级别
    if (level < 4) {
        console.log(prefix, ...str)
    }
}

export { LOG, starlog }