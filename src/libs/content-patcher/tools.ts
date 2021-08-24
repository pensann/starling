import { rmDir } from "../rmdir";
import { TravFiles } from "./trav-files";
import { buildTarget } from "../builder";
import { join } from "path";
import { Starlog } from "../log";
import { parseJSON } from "../parser";
import { Lang, REPEATED_ID_LIST, TRAV_RESULT_DICT } from "../traversor";

export function cpConvertToi18n(src: string, dist: string) {
    rmDir(dist)
    const trav = new TravFiles(src)
    trav.dist = dist
    trav.textHandler = (_, id) => {
        return `{{i18n:${id}}}`
    }
    trav.traverseUnsafe("content.json")
    buildTarget(
        join(dist, "i18n", "default.json"),
        JSON.stringify(TRAV_RESULT_DICT, undefined, 4)
    )
    if (REPEATED_ID_LIST.length) {
        Starlog.warnning(`以下${REPEATED_ID_LIST.length}个ID重复`, REPEATED_ID_LIST)
    }
}

export function cpi18nTranslate(cpPath: string, dict: DictKV, lang: Lang) {
    const i18nFile = join(cpPath, "i18n", "default.json")
    const targetFile = join(cpPath, "i18n", lang + ".json")
    const content: DictKV = parseJSON(i18nFile)
    for (const [key, value] of Object.entries(content)) {
        const valueNew = dict[value]
        if (valueNew) {
            content[key] = valueNew
        } else {
            delete content[key]
        }
    }
    buildTarget(
        join(targetFile),
        JSON.stringify(content, undefined, 4)
    )
}