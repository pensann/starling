import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { parseJSON } from "./parser";
import { EditDataTraversor, LoadTraversor } from "./traversor";

function extractModStr(contentFile: string, target: string, re?: RegExp) {
    const content = parseJSON(contentFile) as ContentPack
    const dir = dirname(target)
    if (!existsSync(dir)) mkdirSync_P(dir)
    if (existsSync(target)) { console.log("[\x1B[38;5;208mWARNING\x1B[0m] 目标存在，覆盖文件: ", resolve(target)) }
    const di: any = {}
    content.Changes.forEach((change) => {
        if (change.Action == "EditData") {
            const traversor = new EditDataTraversor(change, re)
            Object.assign(di, traversor.traverse().dict)
        } else if (change.Action == "Load") {
            const traversor = new LoadTraversor(change, dirname(contentFile), re)
            Object.assign(di, traversor.traverse().dict)
        }
    })
    writeFileSync(target, JSON.stringify(di, undefined, 4))
}

function mkdirSync_P(folderPath: string) {
    if (existsSync(folderPath)) {
        return true;
    } else {
        if (mkdirSync_P(dirname(folderPath))) {
            console.log("[\x1B[38;5;44mINFO\x1B[0m] 创建文件夹: ", resolve(folderPath))
            mkdirSync(folderPath);
            return true;
        }
    }
}

export { extractModStr }