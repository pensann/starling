/**
 * 1. 文本遍历器使用replace方法实现，确保id一致。
 * 2. 文本遍历器不解决i18n读取功能
 */

import { Starlog } from "../log";
import { Traversor, TRAV_RESULT_DICT } from "../traversor";

export class TravStr extends Traversor {
    public readonly str: string
    constructor(str: string, baseID: string) {
        super(baseID)
        this.str = str
    }
    private traverse(value: string, id: string, mode?: "EventText"): string {
        const trav = new TravStr(value, id)
        trav.lang = this.lang
        trav.textHandler = this.textHandler
        trav.textHArgs = this.textHArgs
        trav.getTextID = this.getTextID
        switch (mode) {
            case "EventText":
                return trav.plainText().replaceAll(/"/g, "'")
            default:
                return trav.plainText()
        }
    }
    public plainText(): string {
        const id = this.getTextID(this.baseID, this.str)
        if (this.str) {
            if (this.re.test(this.str)) {
                TRAV_RESULT_DICT[id] = this.str
            }
            if (this.textHandler) {
                return this.textHandler(this.str, id, ...this.textHArgs)
            }
        }
        return this.str
    }
    public eventsLike(): string {
        const qtMarkNum = (() => {
            const matchList = this.str.match(/\"/g)
            return matchList ? matchList.length : 0
        })()
        if (qtMarkNum % 2) {
            Starlog.warnning(`文本包含未闭合引号，使用全字匹配模式...\n\x1B[38;5;65m${this.str}\x1B[0m`)
            // 处理包含奇数引号的文本
            return this.plainText()
        }
        else {
            let index = -1
            return this.str.replace(/\".*?\"/g, (s) => {
                index++
                return `"${this.traverse(
                    s.slice(1, - 1),
                    this.baseID + "." + index,
                    "EventText" // 注意，这里调用traverse方法时注明了需要返回EventText。
                )}"`
            })
        }
    }
    public npcGiftTastes(): string {
        const strLi = this.str.split(/\s*\/\s*/)
        const _ = [0, 2, 4, 6, 8].forEach(i => {
            strLi[i] = this.traverse(strLi[i], this.baseID + "." + i / 2)
        })
        return strLi.join("/")
    }
    public npcDispositions() {
        const strLi = this.str.split(/\s*\/\s*/)
        const index = 11
        strLi[index] = this.traverse(strLi[index], this.baseID)
        return strLi.join("/")
    }
    public mail(): string {
        // 注意，在使用非global正则时，完成第一次匹配时立即返回结果。
        // 即认为字符串中仅包含1个item和1个[#]
        const [text, name] = (_ => {
            const m = this.str.match(/\[#]/)
            return [
                m ? this.str.slice(0, m.index) : this.str,
                m ? this.str.slice(m.index! + 3) : ""
            ]
        })()
        const [plainText, item] = (_ => {
            const m = text.match(/%item\s+.*\s+%%/)
            return [
                m ? text.slice(0, m.index) : text,
                m ? m[0] : ""
            ]
        })()
        const textH = this.traverse(plainText, this.baseID + ".text") + item
        const nameH = this.traverse(name ? name : "", this.baseID + ".name")

        return textH + (nameH ? "[#]" + nameH : "")
    }
    public quests(): string {
        const strLi = this.str.split(/\s*\/\s*/)
        const _ = [1, 2, 3, 7].forEach(i => {
            strLi[i] = this.traverse(strLi[i], this.baseID + "." + i)
        })
        if (strLi.length - 1 == 9) {
            strLi[9] = this.traverse(strLi[9], this.baseID + "." + 9)
        }
        return strLi.join("/")
    }
}