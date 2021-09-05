import { rmDir } from "../rmdir";
import { TravFiles } from "./trav-files";
import { buildTarget } from "../builder";
import { join } from "path";
import { Starlog } from "../log";
import { parseJSON } from "../parser";
import { REPEATED_ID_LIST, TRAV_RESULT_DICT } from "../traversor";
import { execSync } from "child_process";
import { existsSync } from "fs";

export function cpConvertToi18n(src: string, dist: string) {
    rmDir(dist)
    const trav = new TravFiles(src)
    const i18nFile = join(src, "i18n", "default.json")
    trav.dist = dist
    Starlog.debug(i18nFile)

    if (!existsSync(i18nFile)) {
        trav.textHandler = (_, id) => `{ { i18n:${id} } } `
        trav.traverseFile("content.json")
        buildTarget(
            join(dist, "i18n", "default.json"),
            JSON.stringify(TRAV_RESULT_DICT, undefined, 4)
        )
        execSync(`cp - r "${join(src, "content.json")}" "${join(dist, "content - origin.json")}"`)
        if (REPEATED_ID_LIST.length) {
            Starlog.warnning(`以下${REPEATED_ID_LIST.length} 个ID重复`, REPEATED_ID_LIST)
            buildTarget("res/REPEATED_ID_LIST.json", JSON.stringify(REPEATED_ID_LIST, undefined, 2))
        }
    } else {
        buildTarget(
            join(dist, "i18n", "default.json"),
            JSON.stringify(parseJSON(i18nFile), undefined, 4)
        )
    }
}
