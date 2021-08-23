import { join, resolve } from "path";
import { StardewStr } from "./content-patcher/str";
import { create } from "xmlbuilder2"
import { Starlog } from "./log";
import { buildTarget } from "./builder";
import { parseJSON, parseXML } from "./parser";

class StarDict {
    [index: number]: {
        id: string,
        origin: string,
        alter: string[]
    } | undefined
    constructor(dict: object = {}) {
        Object.assign(this, dict)
    }
    public toDictKV(withUndefined = false): DictKV {
        const result: DictKV = {}
        for (const [_, value] of Object.entries(this as {
            [index: number]: {
                id: string,
                origin: string,
                alter: string[]
            }
        })) {
            const v = value.alter.pop()
            if (withUndefined) {
                result[value.origin] = v ? v : ""
            } else if (v) {
                result[value.origin] = v
            }
        }
        return result
    }
    /**
     * toTranslationProject
     */
    public toTranslationProject(path: string) {
        const mainFile = join(resolve(path), "main.json")
        const mainFileContent: {
            [i: string]: {
                origin: string,
                alterFile?: string
            }
        } = {}
        const alterFile = join(resolve(path), "alter.xml")
        const alterFileContent: {
            [i: string]: string
        } = {}
        /**
         * 1. 遍历自己，拿到origin和alter
         * 2. 将origin和alter格式化后写入文件
         * 3. 校验TOKEN，不通过显示警告
         * 4. 使用手写的遍历
         * 5. 注意校验待翻译文本是否重复
         */
        let entryCount = 1
        let fnameCount = 1
        for (const [originStr, alterStr] of Object.entries(this.toDictKV(true))) {
            const origin = new StardewStr(originStr)
            const alter = new StardewStr(alterStr)
            const filePath = join(resolve(path), "src", fnameCount.toString() + ".xml")
            const filePathRel = join("src", fnameCount.toString() + ".xml")
            mainFileContent[entryCount] = { origin: origin.str }
            if (
                origin.containsText
                && (
                    origin.trait != alter.trait
                    || !alter.str
                )
            ) {
                Starlog.warnning("特征不匹配:\n" + origin.str + "\n" + alter.str)
                buildTarget(filePath, this.convertToXMLStr(
                    {
                        origin: origin.strBeauty,
                        alter: alter.strBeauty,
                    }, 2, { trait: origin.trait }))
                mainFileContent[entryCount]["alterFile"] = filePathRel
                fnameCount++
            }
            else {
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
                alterFileContent[entryCount] = str
            }
            entryCount++
        }
        // 润色文件
        buildTarget(alterFile, this.convertToXMLStr(alterFileContent).replace(/\n\s*\n/gm, "\n"))
        buildTarget(mainFile, JSON.stringify(mainFileContent, undefined, 2))
    }
    private convertToXMLStr(entries: DictKV, space?: string | number, attr?: { [index: string]: string | undefined }) {
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
}

export function loadProject(path: string): DictKV {
    const mainFile = join(resolve(path), "main.json")
    const alterFile = join(resolve(path), "alter.xml")
    const mainFileContent = parseJSON(mainFile) as {
        [i: string]: {
            origin: string,
            alterFile?: string
        }
    }
    const alterFileContent = parseXML(alterFile)
    for (const [key, value] of Object.entries(alterFileContent)) {
        Object.assign(mainFileContent[key], { "alter": [value] })
    }
    for (const [key, value] of Object.entries(mainFileContent)) {
        if (value.alterFile) {
            Object.assign(mainFileContent[key], { "alter": [parseXML(join(path, value.alterFile))["alter"]] })
            mainFileContent[key].alterFile = undefined
        }
    }
    return new StarDict(mainFileContent).toDictKV()
}

export function mergeDict(origin: DictKV, ...alters: DictKV[]): StarDict {
    const result = new StarDict()
    let index = 0
    for (const [id, valueOrigin] of Object.entries(origin)) {
        index += 1
        result[index] = {
            id: id,
            origin: valueOrigin,
            alter: []
        }
        for (let i = 0; i < alters.length; i++) {
            const alter = alters[i];
            const valueAlter = alter[id]
            if (valueAlter) {
                result[index]!["alter"].push(valueAlter)
            }
        }
    }
    return result
}