import { dirname } from "path";
import { LOG, StarLog } from "./log";
import { parseJSON } from "./parser";
import { DialogueStr } from "./str";
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

function mergeDict(dictOrigin: DictKV, ...otherDict: DictKV[]): DictAlter {
    const result = new DictAlter()
    let index = 0
    for (const [key, value] of Object.entries(dictOrigin)) {
        // 提取origin字段
        result[index] = {
            id: key,
            origin: value,
            alter: []
        }
        // 提取alter字段
        otherDict.forEach(dict => {
            if (dict[key]) {
                result[index]["alter"].push(dict[key])
            }
        })
        index += 1
    }
    return result
}

class DictAlter {
    [index: number]: {
        id: string
        origin: string
        alter: string[]
    }
    public toDictKV() {
        const result: DictKV = {}
        for (const [key, value] of Object.entries(this) as [string, DictAlterValue][]) {
            if (key && value && value.origin
                && value.alter && value.alter.length != 0
            ) {
                /**
                 * 如果有alter字段，则分析alter字段是否是一个有效翻译。
                 * * 另外，不能使用forEach遍历，因为不能用return中断
                 */
                for (let index = 0; index < value.alter.length; index++) {
                    const element = value.alter[index]
                    const originStr = new DialogueStr(value.origin)
                    const alterStr = new DialogueStr(element)
                    /** 有效翻译：包含相同Trait的第一个alter */
                    if (originStr.trait == alterStr.trait) {
                        // 注意这里的key使用原字符串str做索引
                        result[originStr.str] = alterStr.strCompressed
                        return // 这里应该只会return掉for循环
                    }
                    else {
                        StarLog(LOG.WARN, "字符串特征不符合\n" + alterStr.str)
                    }
                }
            }
        }
        return result
    }
}

interface DictAlterValue {
    id: string
    origin: string
    alter: string[]
}

export { extractModStr, mergeDict, DictAlter }