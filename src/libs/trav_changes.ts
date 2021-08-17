import { parseJSON } from "./parser";
import { Traversor4Entries } from "./trav_entries";
import { join, resolve, basename, extname } from "path";
import { Starlog } from "./log";

enum Lang {
    default,
    zh
}

export class Traversor4Files {
    private readonly modPath: string
    private content: { [i: string]: any }
    private i18n: { [i: string]: string } | undefined
    private re: RegExp | undefined
    constructor(modPath: string, content: { [i: string]: any } = {}) {
        this.modPath = resolve(modPath)
        this.content = content
    }
    public load(...paths: string[]) {
        this.content = parseJSON(join(this.modPath, ...paths))
    }
    public read(...paths: string[]) {
        return parseJSON(join(this.modPath, ...paths))
    }
    public extractText(lang = Lang.default): DictKV {
        const result: DictKV = {}
        switch (lang) {
            case Lang.zh:
                this.re = /[^\x00-\xff]/m
                this.i18n = this.read("i18n", "zh.json")
                break;
            default:
                this.i18n = this.read("i18n", "default.json")
                break;
        }
        // 开始提取
        for (let index = 0; index < this.content.Changes.length; index++) {
            const changeUnknownType = this.content.Changes[index] as BaseChange
            let traversor
            const fileList = []
            if (changeUnknownType.Action == "Include") {
                const change = changeUnknownType as Include
                traversor = new Traversor4Files(this.modPath)
                // 循环所有的Include
                fileList.length = 0
                fileList.push(...change.FromFile.split(/\s*,\s*/))
                for (let index = 0; index < fileList.length; index++) {
                    const file = fileList[index];
                    traversor.load(file)
                    Starlog.debug(this.modPath, file)
                    Object.assign(result, traversor.extractText(lang))
                }
            } else if (changeUnknownType.Action == "EditData") {
                const change = changeUnknownType as EditData
                if (change.Entries) {
                    traversor = new Traversor4Entries(change.Target, change.Entries, "BaseID", this.re, this.i18n)
                    Object.assign(result, traversor.traverse().dict)
                }
                // TODO 支持Field等其它字段翻译
            } else if (changeUnknownType.Action == "Load") {
                const change = changeUnknownType as Load
                // TODO load的Target可能为多个,仅处理json文件
                const targetList = change.Target.split(/\s*,\s*/)
                for (let index = 0; index < targetList.length; index++) {
                    const target = targetList[index]
                    if (extname(target) == ".json") {
                        const file = change.FromFile.replace(/{{TargetWithoutPath}}/i, basename(target))
                        traversor = new Traversor4Entries(change.Target, this.read(file), "BaseID", this.re, this.i18n)
                    }
                }
            } else {
                // TODO Default
            }
        }
        return result
    }
}