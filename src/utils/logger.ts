enum LOG {
    FATAL,
    ERROR,
    WARN,
    INFO,
    DEBUG
}

function StarLog(level: LOG, str: string) {
    let prefix = ""
    switch (level) {
        case LOG.INFO:
            prefix = "[\x1B[38;5;44mINFO\x1B[0m]"
            break;
        case LOG.WARN:
            
        default:
            break;
    }
    console.log(str)
}