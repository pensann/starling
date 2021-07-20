import { create } from "xmlbuilder2"
import { dirname, join, resolve } from "path";
import { readFileSync } from "fs";

import { buildTarget } from "./builder";
import { DialogueStr } from "./str";
import { EditDataTraversor, LoadTraversor } from "./traversor";
import { LOG, starlog } from "./log";
import { parseJSON, parseXMLStr } from "./parser";

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

function mergeDict(dictOrigin: DictKV, dictOther: DictKV): DictAlter {
    const result = new DictAlter()
    let index = 0
    for (const [key, value] of Object.entries(dictOrigin)) {
        // 提取origin字段
        result[index] = {
            id: key,
            origin: value,
            alter: dictOther[key]
        }
        index += 1
    }
    return result
}

function convertToXMLStr(entries: DictKV, space?: string | number, attr?: { [index: string]: string | undefined }) {
    let indent: string | undefined
    if (typeof (space) == "number") {
        indent = " ".repeat(space)
    } else {
        indent = space ? space : " ".repeat(2)
    }
    const root = create({ encoding: "utf-8" })
        .ele('entries', attr)
    for (const [key, value] of Object.entries(entries)) {
        const valueBeauty =
            "\n" + indent.repeat(2)
            + value.replace(/\n/g, "\n" + indent.repeat(2))
            + "\n" + indent
        root.ele("entry", { id: key }).txt(valueBeauty)
    }
    return root.end({ prettyPrint: true, indent: indent })
}

class DictAlter {
    [index: number]: DictAlterValue
    public toDictKV(srcFolder?: string) {
        const result: DictKV = {}
        // TODO 这里替换成手写的遍历
        for (const [_, value] of Object.entries(this) as [string, DictAlterValue][]) {
            if (value.alterFile && srcFolder) {
                // ? 如果有alterFile，根据srcFolder读取AlterFile
                result[value.origin] = parseXMLStr(readFileSync(join(resolve(srcFolder), value.alterFile), "utf-8"))["alter"]
            }
            else if (value.alter) {
                result[value.origin] = value.alter
            }
        }
        return result
    }
    public toTranslationProject(path: string) {
        const mainFile = join(resolve(path), "main.json")
        const result: DictKV = {}
        const content: { [index: string]: DictAlterValue } = {}
        /**
         * 1. 遍历自己，拿到origin和alter
         * 2. 将origin和alter格式化后写入文件
         * 3. 校验TOKEN，不通过显示警告
         * 4. 使用手写的遍历
         */
        for (let index = 0; index < Object.entries(this).length; index++) {
            const [key, value] = Object.entries(this)[index] as [string, DictAlterValue];
            const origin = new DialogueStr(value.origin)
            const alter = new DialogueStr(value.alter ? value.alter : "")
            const filePath = join(resolve(path), "src", key.toString() + ".xml")
            content[key] = {
                id: value.id,
                origin: value.origin
            }
            if (origin.trait != alter.trait) {
                // * 如果trait不匹配，以{origin:xxx,alter:xxx}&attr = {trait:xxx}格式写入文件
                starlog(LOG.WARN, "特征不匹配:\n", origin.str + "\n" + alter.str)
                buildTarget(filePath, convertToXMLStr(
                    {
                        origin: origin.strBeauty,
                        alter: alter.strBeauty,
                    }, 2, { trait: origin.trait }))
                content[key]["alterFile"] = filePath
            } else {
                // 如果trait匹配，以{id:alter}格式添加至result
                const strOriginLi = origin.strBeauty.split("\n")
                const strAlterLi = alter.strBeauty.split("\n")
                let str = ""
                for (let index = 0; index < strOriginLi.length; index++) {
                    str = str.concat(
                        "\n//",
                        strOriginLi[index],
                        "\n",
                        strAlterLi[index]
                    )
                }
                result[key] = str
            }
        }
        // 润色文件
        const alterFilePath = join(resolve(path), "alter.xml")
        buildTarget(alterFilePath, convertToXMLStr(result).replace(/\n\s*\n/gm, "\n"))
        buildTarget(mainFile, JSON.stringify(content, undefined, 2))
    }
}

interface DictAlterValue {
    id: string
    origin: string
    alter?: string
    alterFile?: string
}

export { extractModStr, mergeDict, DictAlter }