import { resolve } from "path"
import { Traversor, TRAVERSE_DICT } from "../traversor"

export class TravFiles extends Traversor {
    private readonly modFolder: string
    constructor(modfolder: string) {
        super()
        this.modFolder = resolve(modfolder)
    }
    public traverse(fileRelPath: string): DictKV {
        return TRAVERSE_DICT
    }
}