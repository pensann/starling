import { create } from "xmlbuilder2"
import { dirname, join, resolve } from "path";

import { buildTarget } from "./builder";
import { DialogueStr } from "./str";
import { EditDataTraversor, LoadTraversor } from "./traversor";
import { LOG, starlog } from "./log";
import { parseJSON, parseXML } from "./parser";
import { regexp_events } from "../libs/regex";

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
    constructor(dict?: DictAlter) {
        Object.assign(this, dict)
    }
    public toDictKV(srcFolder?: string) {
        const result: DictKV = {}
        for (let index = 0; index < Object.values(this).length; index++) {
            const value = Object.values(this)[index];
            if (value.alterFile && srcFolder) {
                // ? 如果有alterFile，根据srcFolder读取AlterFile
                result[value.origin] = parseXML(join(resolve(srcFolder), value.alterFile), "utf-8")["alter"].replace(/\r/g,"")
            }
            else if (value.alter) {
                result[value.origin] = value.alter.replace(/\r/g,"")
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
         * 5. 注意校验待翻译文本是否重复
         */
        const duplicatedFile: DictKV = {}
        const duplicatedEntry: DictKV = {}
        let entryCount = 1
        let fnameCount = 1
        for (let index = 0; index < Object.values(this).length; index++) {
            const value = Object.values(this)[index] as DictAlterValue
            const origin = new DialogueStr(value.origin)
            const alter = new DialogueStr(value.alter ? value.alter : "")
            // * 绝对路径
            const filePath = join(resolve(path), "src", fnameCount.toString() + ".xml")
            const filePathRel = join("src", fnameCount.toString() + ".xml")
            content[entryCount] = {
                id: value.id,
                origin: value.origin
            }
            if (
                origin.trait != alter.trait
                || !alter.str
            ) {
                // * 如果trait不匹配，或者没有翻译，以{origin:xxx,alter:xxx}&attr = {trait:xxx}格式写入文件
                if (duplicatedFile[origin.str]) {
                    // 如果重复，则直接使用之前新建好的文件
                    content[entryCount]["alterFile"] = duplicatedFile[origin.str]
                } else {
                    starlog(LOG.WARN, "特征不匹配:\n" + origin.str + "\n" + alter.str)
                    // 如果不重复，建立文件
                    buildTarget(filePath, convertToXMLStr(
                        {
                            origin: origin.strBeauty,
                            alter: alter.strBeauty,
                        }, 2, { trait: origin.trait }))
                    // content[key]["alterFile"] = filePath
                    // 写入duplicatedFile字典
                    duplicatedFile[origin.str] = filePathRel
                    // 写入content
                    content[entryCount]["alterFile"] = filePathRel
                    // 计数++
                    entryCount++
                    fnameCount++
                }
            } else if (!duplicatedEntry[origin.str]) {
                // 如果trait匹配,检查是否重复,以{id:alter}格式添加至result
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
                result[entryCount] = str
                entryCount++
            }
        }
        // 润色文件
        const alterFilePath = join(resolve(path), "alter.xml")
        buildTarget(alterFilePath, convertToXMLStr(result).replace(/\n\s*\n/gm, "\n"))
        buildTarget(mainFile, JSON.stringify(content, undefined, 2))
    }
}

function loadTranslationProject(path: string): DictKV {
    const content: DictAlter = parseJSON(join(resolve(path), "main.json"))
    const alterXML = parseXML(join(resolve(path), "alter.xml"))
    for (let index = 0; index < Object.entries(content).length; index++) {
        const [key, value] = Object.entries(content)[index] as [unknown, DictAlterValue]
        // 首先从alterXML里面寻求润色文本
        content[key as number].alter = alterXML[key as number]
        // 读取alterFile
        if (value.alterFile) {
            const alterFromXML = parseXML(join(resolve(path), value.alterFile))["alter"]
            if (!alterFromXML) {
                starlog(LOG.ERROR, "文件未翻译:" + value.alterFile)
            } else {
                // !Events类型双引号替换为单引号
                if (regexp_events.test(value.id)) {
                    content[key as number].alter = alterFromXML
                        .replace(/"/gm, "'")
                } else {
                    content[key as number].alter = alterFromXML
                }
                // 检查文件中的翻译特征是否满足
                const alterStr = content[key as number].alter
                if (alterStr) {
                    const origin = new DialogueStr(content[key as number].origin)
                    const alter = new DialogueStr(alterStr)
                    if (origin.trait != alter.trait) {
                        starlog(LOG.ERROR, "翻译不正确:" + value.alterFile)
                    }
                }
            }
            content[key as number].alterFile = undefined
        }
    }
    return new DictAlter(content).toDictKV(path)
}

interface DictAlterValue {
    id: string
    origin: string
    alter?: string
    alterFile?: string
}

export { extractModStr, mergeDict, DictAlter, loadTranslationProject }