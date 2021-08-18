import {  } from "fs";
import { join, resolve } from "path";
class StarDict {
    [index: number]: {
        id: string,
        origin: string,
        alter: string[]
    } | undefined
    public toDictKV(): DictKV {
        const result: DictKV = {}
        for (const [_, value] of Object.entries(this as {
            [index: number]: {
                id: string,
                origin: string,
                alter: string[]
            }
        })) {
            const v = value.alter.pop()
            if (v) {
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

// class DictAlter {
//     [index: number]: DictAlterValue
//     constructor(dict?: DictAlter) {
//         Object.assign(this, dict)
//     }
//     public toDictKV(srcFolder?: string) {
//         const result: DictKV = {}
//         for (let index = 0; index < Object.values(this).length; index++) {
//             const value = Object.values(this)[index];
//             if (value.alterFile && srcFolder) {
//                 // ? 如果有alterFile，根据srcFolder读取AlterFile
//                 result[value.origin] = parseXML(join(resolve(srcFolder), value.alterFile), "utf-8")["alter"].replace(/\r/g, "")
//             }
//             else if (value.alter) {
//                 result[value.origin] = value.alter.replace(/\r/g, "")
//             }
//         }
//         return result
//     }
//     public toTranslationProject(path: string) {
//         const mainFile = join(resolve(path), "main.json")
//         const result: DictKV = {}
//         const content: { [index: string]: DictAlterValue } = {}
//         /**
//          * 1. 遍历自己，拿到origin和alter
//          * 2. 将origin和alter格式化后写入文件
//          * 3. 校验TOKEN，不通过显示警告
//          * 4. 使用手写的遍历
//          * 5. 注意校验待翻译文本是否重复
//          */
//         const duplicatedFile: DictKV = {}
//         const duplicatedEntry: DictKV = {}
//         let entryCount = 1
//         let fnameCount = 1
//         for (let index = 0; index < Object.values(this).length; index++) {
//             const value = Object.values(this)[index] as DictAlterValue
//             const origin = new DialogueStr(value.origin)
//             const alter = new DialogueStr(value.alter ? value.alter : "")
//             // * 绝对路径
//             const filePath = join(resolve(path), "src", fnameCount.toString() + ".xml")
//             const filePathRel = join("src", fnameCount.toString() + ".xml")
//             content[entryCount] = {
//                 id: value.id,
//                 origin: value.origin
//             }
//             if (
//                 origin.trait != alter.trait
//                 || !alter.str
//             ) {
//                 // * 如果trait不匹配，或者没有翻译，以{origin:xxx,alter:xxx}&attr = {trait:xxx}格式写入文件
//                 if (duplicatedFile[origin.str]) {
//                     // 如果重复，则直接使用之前新建好的文件
//                     content[entryCount]["alterFile"] = duplicatedFile[origin.str]
//                 } else {
//                     starlog(LOG.WARN, "特征不匹配:\n" + origin.str + "\n" + alter.str)
//                     // 如果不重复，建立文件
//                     buildTarget(filePath, convertToXMLStr(
//                         {
//                             origin: origin.strBeauty,
//                             alter: alter.strBeauty,
//                         }, 2, { trait: origin.trait }))
//                     // content[key]["alterFile"] = filePath
//                     // 写入duplicatedFile字典
//                     duplicatedFile[origin.str] = filePathRel
//                     // 写入content
//                     content[entryCount]["alterFile"] = filePathRel
//                     // 计数++
//                     entryCount++
//                     fnameCount++
//                 }
//             } else if (!duplicatedEntry[origin.str]) {
//                 // 如果trait匹配,检查是否重复,以{id:alter}格式添加至result
//                 const strOriginLi = origin.strBeauty.split("\n")
//                 const strAlterLi = alter.strBeauty.split("\n")
//                 let str = ""
//                 for (let index = 0; index < strOriginLi.length; index++) {
//                     str = str.concat(
//                         "\n//",
//                         strOriginLi[index],
//                         "\n",
//                         strAlterLi[index]
//                     )
//                 }
//                 result[entryCount] = str
//                 entryCount++
//             }
//         }
//         // 润色文件
//         const alterFilePath = join(resolve(path), "alter.xml")
//         buildTarget(alterFilePath, convertToXMLStr(result).replace(/\n\s*\n/gm, "\n"))
//         buildTarget(mainFile, JSON.stringify(content, undefined, 2))
//     }
// }