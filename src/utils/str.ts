class DialogueStr {
    public str: string
    constructor(str: string) {
        this.str = str
    }
    public get strBeauty() {
        return this.str
            .replaceAll(/#\$(q|e|b)/gm, wrap)
            .replaceAll(/#\$r/gm, wrapAndIndent)
    }
    public get strCompressed() { return this.str }
    public get trait() {
        return this.strCompressed
            .replaceAll(
                /\$(k|h|s|u|l|a)/gm,
                str => { return this.portrait_alias[str] }
            )
            .match(this.traitRgexp)?.join("/")
            .replaceAll(/\s+/gm, "_")
    }
    public fromString(str: string) {
        this.str = str.replaceAll(/\n\s*/g, "")
    }
    private portrait_alias = {
        "$k": "$0",
        "$h": "$1",
        "$s": "$2",
        "$u": "$3",
        "$l": "$4",
        "$a": "$5"
    } as { [index: string]: string }
    private traitRgexp = /^%|{{[^{}]*?}}|\^|#|@|%adj|%noun|%place|%spouse|%name|%firstnameletter|%time|%band|%book|%rival|%pet|%farm|%favorite|%kid1|%kid2|\$(e|b|q\s*-?\d*\s*-?\d*|r\s*-?\d*\s*-?\d*\s*\w*|\d*)/gm
}


function wrap(str: string) {
    return "\n" + str
}
function wrapAndIndent(str: string) {
    return wrap("\t" + str)
}

export { DialogueStr }