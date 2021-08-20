import { parseJSON } from "./parser";
import { TravEntries } from "./trav-entries";
import { join, resolve, extname } from "path";
import { buildTarget } from "./builder";
import { Traversor, TRAVERSE_DICT, Lang } from "./trav";
import { Target, TargetType } from "./target";
import { Starlog } from "./log";
import { existsSync } from "fs";

export class TravFiles extends Traversor {
    private readonly modFolder: string
    constructor(modfolder: string) {
        super()
        this.modFolder = resolve(modfolder)
    }
    private getChangeID(change: CommonFields): string {
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
    public traverse(fileRelPath: string): DictKV {
        const content = parseJSON(join(this.modFolder, fileRelPath)) as CommonContent
        const changeList = []
        Starlog.info(`Traversing file: ${fileRelPath}`)
        for (let index = 0; index < content.Changes.length; index++) {
            const changeUnknownType = content.Changes[index] as BaseChange
            const percent = String(index * 100 / content.Changes.length).slice(0, 4) + "%"
            Starlog.infoOneLine(`Traversing change ${percent}`)
            if (changeUnknownType.Action == "Include") {
                const change = changeUnknownType as Include
                change.FromFile.split(/\s*,\s*/).forEach((file) => {
                    this.traverse(file)
                })
            } else if (changeUnknownType.Action == "EditData") {
                const change = changeUnknownType as EditData
                if (change.Entries) {
                    const trav = new TravEntries(change.Target, change.Entries, this.getChangeID(change))
                    const i18nFile = join(this.modFolder, "i18n", this.lang + ".json")
                    trav.lang = this.lang
                    trav.textHandler = this.textHandler
                    if (existsSync(i18nFile)) { trav.i18n = parseJSON(i18nFile) }
                    change.Entries = trav.traverse()
                }
                changeList.push(change)
                // TODO 支持Field等其它字段翻译
            } else if (changeUnknownType.Action == "Load") {
                const change = changeUnknownType as Load
                // 首先记住这个load文件
                changeList.push(change)
                // 然后开始Edit 
                // load的Target可能为多个,仅处理json文件
                const targetList = change.Target.split(/\s*,\s*/)
                if (extname(change.FromFile) == ".json") {
                    targetList.forEach((targetStr) => {
                        const target = new Target(targetStr)
                        if (
                            target.type == TargetType.PlainText
                            || target.type == TargetType.EventsLike
                            || target.type == TargetType.Festivals
                        ) {
                            const file = change.FromFile.replace(/{{TargetWithoutPath}}/gi, target.strWithoutPath)
                            const entries = parseJSON(join(this.modFolder, file))
                            const trav = new TravEntries(target.str, entries, this.getChangeID(change))
                            trav.lang = this.lang
                            if (this.textHandler) {
                                // 需要翻译的话，需要把文件转换为EditData后应用
                                const i18nFile = join(this.modFolder, "i18n", this.lang + "json")
                                trav.textHandler = this.textHandler
                                if (existsSync(i18nFile)) { trav.i18n = parseJSON(i18nFile) }
                                const changeNew: EditData = {
                                    Action: "EditData",
                                    Target: target.str,
                                    Entries: trav.traverse()
                                }
                                changeList.push(changeNew)
                            } else {
                                trav.traverse()
                            }
                        }
                    })
                }
            } else {
                changeList.push(changeUnknownType)
            }
        }
        content["Changes"] = changeList
        if (this.textHandler) {
            buildTarget(
                join(this.modFolder, fileRelPath),
                JSON.stringify(content, undefined, 4))
        }
        return TRAVERSE_DICT
    }
}