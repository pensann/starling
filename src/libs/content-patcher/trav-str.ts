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
    private traverse(value: string, id: string, returnEventStr = false): string {
        const trav = new TravStr(value, id)
        trav.args = this.args
        trav.lang = this.lang
        trav.textHandler = this.textHandler
        trav.getIDMethod = this.getIDMethod
        if (returnEventStr) {
            return trav.plainText().replaceAll(/"/g, "'")
        } else {
            return trav.plainText()
        }
    }
    public plainText(): string {
        const id = this.getID(this.baseID, this.str)
        if (this.re.test(this.str)) {
            TRAV_RESULT_DICT[id] = this.str
        }
        if (this.str && this.textHandler) {
            return this.textHandler(this.str, id, ...this.args)
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
                return "\""
                    + this.traverse(
                        s.substring(1, s.length - 1),
                        this.baseID + "." + index,
                        true // 注意，这里调用traverse方法时注明了需要返回EventsStr。
                    ) + "\""
            })
        }
    }
    public npcGiftTastes(): string {
        const strLi = this.str.split(/\s*\/\s*/)
        // 遍历字符串文字，其中模2片段为需要翻译的字符串
        for (let index = 0; index < strLi.length; index++) {
            if (!(index % 2)) {
                strLi[index] = this.traverse(strLi[index], this.baseID + "." + index / 2)
            }
        }
        return strLi.join("/")
    }
    public npcDispositions() {
        const strLi = this.str.split(/\s*\/\s*/)
        const index = 11
        if (strLi[index]) {
            strLi[index] = this.traverse(strLi[index], this.baseID)
        }
        return strLi.join("/")
    }
}