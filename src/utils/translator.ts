import { existsSync, lstatSync, renameSync } from "fs";
import { join, resolve, basename, dirname } from "path/posix";
import { LOG, starlog } from "./log";
import { EditDataTraversor, LoadTraversor } from "./traversor";
import { buildTarget } from "./builder";
import { parseJSON } from "./parser";

function translate(path: string, dict: DictKV) {
    const finalPath = (() => {
        if (lstatSync(path).isDirectory()) {
            const backup = join(resolve(path), "content-backup.json")
            const origin = join(resolve(path), "content.json")
            if (existsSync(backup)) {
                return backup
            }
            else if (existsSync(origin)) {
                return origin
            }
        } else if (existsSync(path)) {
            // 如果Path不是文件夹，判断文件名
            if (basename(path) == "content-backup.json") {
                // 如果是content-backup.json则直接赋值
                return path
            }
            else if (basename(path) == "content.json") {
                // 如果是content.json则查看同级文件夹是否有backup文件
                const backup = join(resolve(dirname(path)), "content-backup.json")
                if (existsSync(backup)) {
                    return backup
                }
                else {
                    return path
                }
            } else {
                starlog(LOG.ERROR, "文件不存在")
                return
            }
        }
    })()

    if (finalPath) {
        const content: ContentPack = parseJSON(finalPath)
        const changesAlter: ContentPack["Changes"] = []
        content.Changes.forEach(change => {
            if (change.Action == "EditData") {
                const traversor = new EditDataTraversor(change)
                changesAlter.push(traversor.traverse(str_translator, dict).alter)
            } else if (change.Action == "Load") {
                const traversor = new LoadTraversor(change, dirname(finalPath))
                changesAlter.push(traversor.traverse(str_translator, dict).alter)
            }
        })
        const oldFile = join(dirname(finalPath), "content.json")
        const newFile = join(dirname(finalPath), "content-backup.json")
        if (basename(finalPath) == "content.json") {
            // 如果是content.json，备份为content-backup.json
            renameSync(oldFile, newFile)
        }
        content.Changes = changesAlter
        buildTarget(join(dirname(finalPath), "content.json"), JSON.stringify(content, undefined, 2))
    }
}

/**
 * 翻译器，查找字典中传入字符串的翻译。  
 * * 若字典中未找到翻译，则返回`原字符串`
 */
function str_translator(str: string, dict: DictKV) {
    return dict[str] ? dict[str] : str
}

export { translate }