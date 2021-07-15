enum LOG {
    FATAL,
    ERROR,
    WARN,
    INFO,
    DEBUG
}

function StarLog(level: LOG, ...str: string[]) {
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
        default:
            break;
    }
    console.log(prefix, ...str)
}

export { LOG, StarLog }