import { existsSync, statSync } from "fs";
import { join } from "path";
import { parseJSON } from "../parser";
import { Traversor, TRAV_RESULT_DICT } from "../traversor";

class TravFiles extends Traversor {
    public i18n: DictKV | undefined
    constructor(modfolder: string) {
        super()
        this.src = modfolder
        const i18nFolder = join(modfolder, "i18n")
        const i18nFile = join(i18nFolder, this.lang + ".json")
        if (
            statSync(i18nFolder).isDirectory()
            && existsSync(i18nFile)
        ) {
            this.i18n = parseJSON(i18nFile)
        }
    }
    public traverse() {
        const src = join(this.src, "quests.json")
        const dist = join(this.dist, "quests.json")
        const content = parseJSON(src)
    }
}