import { parseJSON } from "../parser";
import { TravEntries } from "./trav-entries";
import { join, extname } from "path";
import { buildTarget } from "../builder";
import { Traversor, TRAV_RESULT_DICT } from "../traversor";
import { Target, TarFmt } from "./target";
import { Starlog } from "../log";
import { existsSync, statSync } from "fs";

export class TravFiles extends Traversor {
    constructor(src: string) {
        super()
        this.src = src
    }
    private getChangeID(change: CommonFields): string {
        return change.Target + (() => {
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
    public tranverse() {
        const i18nFolder = join(this.src, "i18n")
        const i18nFile = join(i18nFolder, this.lang + ".json")
        if (existsSync(i18nFolder) && statSync(i18nFolder).isDirectory()) {
            // 写i18n模组的遍历逻辑
            if (existsSync(i18nFile)) {
                Object.assign(TRAV_RESULT_DICT, parseJSON(i18nFile))
            }
            if (this.textHandler) {
                buildTarget(join(this.dist, "i18n", this.lang + ".json"), "{}")
            }
        } else {
            this.traverseFile("content.json")
        }
    }
    public traverseFile(relPath: string): void {
        const content: CommonContent = parseJSON(join(this.src, relPath))
        const changeList = []

        const FLAGS = {
            loadEdited: false,
            createEmptyFile: false
        }

        const len = content.Changes.length

        Starlog.info(`Traversing file: ${join(this.src, relPath)}`)
        for (let index = 0; index < len; index++) {
            const percent = String(index * 100 / len).slice(0, 4) + "%"
            Starlog.infoOneLine(`Loading change ${percent}`)

            const changeUnknownType: {
                Action: BaseChange["Action"]
                [index: string]: undefined | any
            } = content.Changes[index]

            if (changeUnknownType.Action == "Include") {
                const change = changeUnknownType as Include
                change.FromFile.split(/\s*,\s*/).forEach((file) => {
                    this.traverseFile(file)
                })
            } else if (changeUnknownType.Action == "EditData") {
                const change = changeUnknownType as EditData
                if (change.Entries) {
                    const trav = new TravEntries(
                        change.Target,
                        change.Entries, this.getChangeID(change)
                    )
                    trav.lang = this.lang
                    if (!this.textHandler) {
                        if (!change.When || (change.When && change.When["language"] == this.lang)) trav.traverse()
                    } else {
                        const i18nFile = join(this.src, "i18n", this.lang + ".json")
                        trav.textHandler = this.textHandler
                        if (existsSync(i18nFile)) { trav.i18n = parseJSON(i18nFile) }
                        change.Entries = trav.traverse()
                    }
                }
                changeList.push(change)
                // TODO 支持Field等其它字段翻译
            } else if (changeUnknownType.Action == "Load") {
                FLAGS.loadEdited = false
                const change = changeUnknownType as Load
                if (extname(change.FromFile) == ".json") {
                    const targetList = change.Target.split(/\s*,\s*/)
                    const editDataListNew: EditData[] = []
                    targetList.forEach((targetStr) => {
                        // 遍历器用到的假entries文件
                        const target = new Target(targetStr)
                        if (
                            target.type == TarFmt.PlainText
                            || target.type == TarFmt.EventsLike
                            || target.type == TarFmt.Festivals
                        ) {
                            const trav = new TravEntries(
                                target.str,
                                parseJSON(join(this.src, change.FromFile.replace(/{{TargetWithoutPath}}/gi, target.strWithoutPath))),
                                this.getChangeID(change)
                            )
                            trav.lang = this.lang
                            if (!this.textHandler) {
                                // 不处理文本的话，直接遍历
                                if (!change.When || (change.When && change.When["language"] == this.lang)) trav.traverse()
                            } else {
                                // 处理文本
                                FLAGS.loadEdited = true
                                const i18nFile = join(this.src, "i18n", this.lang + "json")

                                // 设置遍历器
                                trav.textHandler = this.textHandler
                                if (existsSync(i18nFile)) { trav.i18n = parseJSON(i18nFile) }

                                // 保存遍历结果
                                editDataListNew.push({
                                    Action: "EditData",
                                    Target: target.str,
                                    Entries: trav.traverse()
                                })
                            }
                        }
                    })
                    if (FLAGS.loadEdited) {
                        FLAGS.createEmptyFile = true
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
        if (FLAGS.createEmptyFile) {
            buildTarget(join(this.dist, "empty.json"), "{}")
        }
        content["Changes"] = changeList
        if (this.textHandler) {
            buildTarget(join(this.dist ? this.dist : this.src, relPath), JSON.stringify(content, undefined, 4))
        }
    }
}