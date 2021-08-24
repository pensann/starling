import { existsSync, statSync } from "fs";
import { join } from "path";
import { parseJSON } from "../parser";
import { Traversor, TRAV_RESULT_DICT } from "../traversor";

class TravFiles extends Traversor {

    public i18n: DictKV | undefined
    constructor(src: string) {
        super()
        this.src = src

        // 加载i18n
        const i18nFile = join(this.src, "i18n", this.lang + ".json")
        if (existsSync(i18nFile)) { this.i18n = parseJSON(i18nFile) }
    }
    public traverse() {
        const srcFile = join(this.src, "quests.json")
        const distFile = join(this.dist, "quests.json")
        const content = parseJSON(srcFile)

        // Quest
    }
}