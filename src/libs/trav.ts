export const TRAVERSE_DICT: DictKV = {}

export class Traversor {
    public args: any[] = []
    public baseID: string
    public re = /./
    public textHandler: ((str: string, id: string, ...args: any[]) => string) | undefined
    constructor(baseID: string = "") {
        this.baseID = baseID
    }
}