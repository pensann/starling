export const TRAVERSE_DICT: DictKV = {}

export enum Lang {
    default = "default",
    zh = "zh"
}

export class Traversor {
    public args: any[] = []
    public baseID: string
    public lang = Lang.default
    public get re() {
        switch (this.lang) {
            case Lang.zh:
                return /[^\x00-\xff]/m
            default:
                return /./
        }
    }
    public textHandler: ((str: string, id: string, ...args: any[]) => string) | undefined
    constructor(baseID: string = "") {
        this.baseID = baseID
    }
}