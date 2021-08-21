import { rmDir } from "../rmdir";
import { execSync } from "child_process";
import { TravFiles } from "./trav-files";
import { buildTarget } from "../builder";
import { join } from "path";
import { Starlog } from "../log";
import { REPEATED_ID_LIST } from "./trav-str";
import { parseJSON } from "../parser";

export function cpConvertToi18n(src: string, dist: string) {
    rmDir(dist)
    execSync(`cp -r ${src} ${dist}`)
    const trav = new TravFiles(dist)
    trav.textHandler = (_, id) => {
        return `{{i18n:${id}}}`
    }
    buildTarget(
        join(dist, "i18n", "default.json"),
        JSON.stringify(trav.traverse("content.json"), undefined, 4)
    )
    if (REPEATED_ID_LIST) {
        Starlog.warnning(`以下${REPEATED_ID_LIST.length}个ID重复`, REPEATED_ID_LIST)
    }
}

export function cpi18nTranslate(cpPath: string, dict: DictKV) {
    const i18nFile = join(cpPath, "i18n", "default.json")
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
        join(i18nFile),
        JSON.stringify(content, undefined, 4)
    )
}