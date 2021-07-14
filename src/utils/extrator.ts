import { dirname } from "path";
import { parseJSON } from "./parser";
import { EditDataTraversor, LoadTraversor } from "./traversor";

function extractModStr(contentFile: string, re?: RegExp) {
    const result: DictKV = {}
    const content = parseJSON(contentFile) as ContentPack
    content.Changes.forEach((change) => {
        if (change.Action == "EditData") {
            const traversor = new EditDataTraversor(change, re)
            Object.assign(result, traversor.traverse().dict)
        } else if (change.Action == "Load") {
            const traversor = new LoadTraversor(change, dirname(contentFile), re)
            Object.assign(result, traversor.traverse().dict)
        }
    })
    return result
}

function mergeDict(dictOrigin: DictKV, ...dictAlter: DictKV[]): DictAlter {
    const result: DictAlter = {}
    for (const [key, value] of Object.entries(dictOrigin)) {
        // 提取origin字段
        result[key]["origin"] = value
        // 提取alter字段
        dictAlter.forEach(alter => {
            if (alter[key]) {
                result[key]["alter"].push(alter[key])
            }
        })
    }
    return result
}

export { extractModStr, mergeDict }

// * 字符串处理的示例代码
// const regexLi = [
//     regexp_dialogue,
//     regexp_strings_from_csfiles,
//     regexp_events,
//     regexp_festivals
// ]
// regexLi.forEach(regex => {
//     if (regex.test(key)) {
//         const dialogueStr = new DialogueStr(value)
//         // TODO 将经过美化的格式生成到字典
//         console.log(dialogueStr.strBeauty)
//     }
// })