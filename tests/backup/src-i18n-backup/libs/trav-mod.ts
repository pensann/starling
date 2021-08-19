import { parseJSON } from "./parser";
import { Traversor4Entries } from "./trav-entries";
import { join, resolve, basename, extname } from "path";
import { Starlog } from "./log";
import { existsSync } from "fs";
import { buildTarget } from "./builder";

export enum Lang {
    default,
    zh
}

export const STATIC_FILE_LIST: string[] = []

export class Traversor4Mod {
    private readonly modPath: string
    private content: { [i: string]: any }
    private filename: string = ""
    private i18n: { [i: string]: string } = {}
    private re: RegExp | undefined
    constructor(modPath: string, content: { [i: string]: any } = {}) {
        this.modPath = resolve(modPath)
        this.content = content
    }
    public loadFile(...paths: string[]) {
        this.filename = join(this.modPath, ...paths)
        this.content = parseJSON(this.filename)
        Starlog.debug("LoadFile:", this.filename)
    }
    private loadi18n(lang = Lang.default) {
        if (existsSync(join(this.modPath, "i18n"))) {
            switch (lang) {
                case Lang.zh:
                    this.re = /[^\x00-\xff]/m
                    this.i18n = this.read("i18n", "zh.json")
                    break;
                default:
                    this.i18n = this.read("i18n", "default.json")
                    break;
            }
        }
    }
    public read(...paths: string[]) {
        return parseJSON(join(this.modPath, ...paths))
    }
    private getBaseID(change: CommonFields): string {
        return change.Action + change.Target + (() => {
            let str = ""
            if (change.When) {
                str += "[When]"
                for (const [key, value] of Object.entries(change.When)) {
                    if (key.toLowerCase() != "language") {
                        str += key + value
                    }
                }
            }
            return str
        })()
    }
    public extractText(lang = Lang.default, convertToi18n = false): DictKV {
        const result: DictKV = {}
        this.loadi18n(lang)
        // 开始提取
        const changeList = []
        for (let index = 0; index < this.content.Changes.length; index++) {
            const changeUnknownType = this.content.Changes[index] as BaseChange
            let traversor
            const fileList = []
            if (changeUnknownType.Action == "Include") {
                const change = changeUnknownType as Include
                traversor = new Traversor4Mod(this.modPath)
                // 循环所有的Include
                fileList.length = 0
                fileList.push(...change.FromFile.split(/\s*,\s*/))
                for (let index = 0; index < fileList.length; index++) {
                    const file = fileList[index];
                    traversor.loadFile(file)
                    Object.assign(result, traversor.extractText(lang))
                }
            } else if (changeUnknownType.Action == "EditData") {
                const change = changeUnknownType as EditData
                if (change.Entries) {
                    traversor = new Traversor4Entries(change.Target, change.Entries, this.getBaseID(change), this.re, this.i18n)
                    Object.assign(result, traversor.traverse().dict)
                    change.Entries = traversor.traverse(this.translator).alter
                }
                // 写入ChangeList
                changeList.push(change)
                // TODO 支持Field等其它字段翻译
            } else if (changeUnknownType.Action == "Load") {
                const change = changeUnknownType as Load
                // load的Target可能为多个,仅处理json文件
                const targetList = change.Target.split(/\s*,\s*/)
                for (let index = 0; index < targetList.length; index++) {
                    const target = targetList[index]
                    if (extname(change.FromFile) == ".json") {
                        // TODO 
                        const file = change.FromFile.replace(/{{TargetWithoutPath}}/gi, basename(target))
                        if (!(STATIC_FILE_LIST.indexOf(file) > -1)) {
                            traversor = new Traversor4Entries(change.Target, this.read(file), this.getBaseID(change), this.re, this.i18n)
                            Object.assign(result, traversor.traverse().dict)
                            if (convertToi18n) {
                                buildTarget(join(this.modPath, file), JSON.stringify(traversor.traverse(this.translator).alter, undefined, 2))
                            }
                            STATIC_FILE_LIST.push(file)
                        }
                    }
                }
                changeList.push(change)
            } else {
                changeList.push(changeUnknownType)
            }

        }
        if (convertToi18n) {
            const content = {} as { [i: string]: any }
            Object.assign(content, this.content)
            content["Changes"] = changeList
            buildTarget(
                this.filename,
                JSON.stringify(content, undefined, 4))
        }
        return result
    }
    private translator(str: string, id: string): string {
        return `{{i18n:${id}}}`
    }
}