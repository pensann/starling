class DialogueStr {
    protected str: string
    constructor(str: string) {
        this.str = str.replaceAll(/\n\s*/g, "")
    }
    public get strBeauty() {
        return this.str
            .replaceAll(/#\$(q|e|b)/gm, wrap)
            .replaceAll(/#\$r/gm, wrapAndIndent)
    }
    public get strCompressed() { return this.str }
    private marks = [
        "@",
        "%adj",
        "%noun",
        "%place",
        "%spouse",
        "%name",
        "%firstnameletter",
        "%time",
        "%band",
        "%book",
        "%rival",
        "%pet",
        "%farm",
        "%favorite",
        "%kid1",
        "%kid2"
    ]
    private portrait_alias = {
        "$k": "$0",
        "$h": "$1",
        "$s": "$2",
        "$u": "$3",
        "$l": "$4",
        "$a": "$5"
    }
}


function wrap(str: string) {
    return "\n" + str
}
function wrapAndIndent(str: string) {
    return wrap("\t" + str)
}

export { DialogueStr }