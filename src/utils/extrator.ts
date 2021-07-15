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
        dictAlter.forEach(alter => {
            if (alter[key]) {
                result[index]["alter"].push(alter[key])
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
        for (const [key, value] of Object.entries(this)) {
            if (key && value && value["origin"]
                && value["alter"] && value["alter"].length != 0
            ) {
                result[value["origin"]] = value["alter"][0]
            }
        }
        return result
    }
}

export { extractModStr, mergeDict, DictAlter }