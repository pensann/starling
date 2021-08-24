import { parseJSON } from "../parser";
import { TravEntries } from "./trav-entries";
import { join, extname } from "path";
import { buildTarget } from "../builder";
import { Traversor, TRAV_RESULT_DICT } from "../traversor";
import { Target, TargetType } from "./target";
import { Starlog } from "../log";
import { existsSync, statSync } from "fs";

export class TravFiles extends Traversor {
    constructor(modfolder: string) {
        super()
        this.src = modfolder
    }
    private getChangeID(change: CommonFields): string {
        return change.Target + (() => {
            // return change.Action + change.Target + (() => {
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
    public traverseSafe(fileRelPath: string) {
        const i18nFolder = join(this.src, "i18n")
        if (statSync(i18nFolder).isDirectory()) {
            // 写i18n模组的遍历逻辑
            Object.assign(TRAV_RESULT_DICT, parseJSON(join(i18nFolder, this.lang + ".json")))
            if (this.textHandler) {
                buildTarget(join(this.dist, "i18n", this.lang + ".json"), "{}")
            }
        } else {
            this.traverse(fileRelPath)
        }
    }
    public traverse(fileRelPath: string): void {
        Starlog.info(`Traversing file: ${join(this.src, fileRelPath)}`)
        const content = parseJSON(join(this.src, fileRelPath)) as CommonContent
        const changeList = []
        let loadEdited = false
        for (let index = 0; index < content.Changes.length; index++) {
            const changeUnknownType: {
                Action: BaseChange["Action"]
                [index: string]: undefined | any
            } = content.Changes[index]
            const percent = String(index * 100 / content.Changes.length).slice(0, 4) + "%"
            Starlog.infoOneLine(`Loading change ${percent}`)
            if (
                !changeUnknownType["When"] // 不包含When默认提取
                || (
                    changeUnknownType["When"] //包含When并且Language正确
                    && changeUnknownType["When"]["Language"] == this.lang
                )
            ) {
                if (changeUnknownType.Action == "Include") {
                    const change = changeUnknownType as Include
                    change.FromFile.split(/\s*,\s*/).forEach((file) => {
                        this.traverse(file)
                    })
                } else if (changeUnknownType.Action == "EditData") {
                    const change = changeUnknownType as EditData
                    if (change.Entries) {
                        const trav = new TravEntries(change.Target, change.Entries, this.getChangeID(change))
                        const i18nFile = join(this.src, "i18n", this.lang + ".json")
                        trav.lang = this.lang
                        trav.textHandler = this.textHandler
                        if (existsSync(i18nFile)) { trav.i18n = parseJSON(i18nFile) }
                        change.Entries = trav.traverse()
                    }
                    changeList.push(change)
                    // TODO 支持Field等其它字段翻译
                } else if (changeUnknownType.Action == "Load") {
                    const change = changeUnknownType as Load
                    if (extname(change.FromFile) == ".json") {
                        const targetList = change.Target.split(/\s*,\s*/)
                        const editDataListNew: EditData[] = []
                        targetList.forEach((targetStr) => {
                            // 遍历器用到的假entries文件
                            const target = new Target(targetStr)
                            if (
                                target.type == TargetType.PlainText
                                || target.type == TargetType.EventsLike
                                || target.type == TargetType.Festivals
                            ) {
                                const file = change.FromFile.replace(/{{TargetWithoutPath}}/gi, target.strWithoutPath)
                                const entries = parseJSON(join(this.src, file))
                                const trav = new TravEntries(target.str, entries, this.getChangeID(change))
                                trav.lang = this.lang
                                if (!this.textHandler) {
                                    // 不处理文本的话，直接遍历
                                    trav.traverse()
                                } else {
                                    // 处理文本
                                    loadEdited = true
                                    const i18nFile = join(this.src, "i18n", this.lang + "json")

                                    // 设置遍历器
                                    trav.textHandler = this.textHandler
                                    if (existsSync(i18nFile)) { trav.i18n = parseJSON(i18nFile) }

                                    // 保存遍历结果
                                    editDataListNew.push({
                                        Action: "EditData",
                                        Target: target.str,
                                        Entries: trav.traverse()
                                    } as EditData)
                                }
                            }
                        })
                        if (loadEdited) {
                            change.FromFile = "empty.json"
                        }
                        changeList.push(change, ...editDataListNew)
                    } else {
                        changeList.push(change)
                    }
                } else {
                    changeList.push(changeUnknownType)
                }
            }
        }
        if (loadEdited) {
            const fakeFile = join(this.dist, "empty.json")
            buildTarget(fakeFile, "{}")
        }
        console.log("")
        content["Changes"] = changeList
        if (this.textHandler) {
            buildTarget(
                join(
                    this.dist ? this.dist : this.src,
                    fileRelPath
                ),
                JSON.stringify(content, undefined, 4))
        }
    }
}