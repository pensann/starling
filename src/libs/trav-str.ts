/**
 * 1. 文本遍历器使用replace方法实现，确保id一致。
 * 2. 文本遍历器不解决i18n读取功能
 */

import { createHash } from "crypto";
import { Starlog } from "./log";

export const TRAVERSE_DICT: DictKV = {}

export class Trav4Str {
    public args: any[] = []
    public baseID: string
    public re = /./
    public textHandler: ((str: string, ...args: any[]) => string) | undefined
    public readonly str: string
    constructor(str: string, baseID: string) {
        this.str = str
        this.baseID = baseID
    }
    public getID(id: string, value: string) {
        const idExists = (() => {
            for (const [idExists, valueExists] of Object.entries(TRAVERSE_DICT)) {
                if (value == valueExists) {
                    return idExists
                } else if (id != idExists) {
                    throw new Error(`Multiple values(${valueExists},${value}) use a same id(${id})!`);
                }
            }
        })()
        if (idExists) {
            return idExists
        } else {
            // return id.replace(/\s+/g, "_").replace(/\/|\||=/g, ".")
            return createHash("sha1").update(JSON.stringify(id)).digest('hex')
        }
    }
    private traverse(value: string, id: string): string {
        const trav = new Trav4Str(value, id)
        trav.args = this.args
        trav.re = this.re
        trav.textHandler = this.textHandler
        trav.getID = this.getID
        return trav.travPlainText()
    }
    public travPlainText(): string {
        const id = this.getID(this.baseID, this.str)
        if (this.re.test(this.str)) {
            TRAVERSE_DICT[id] = this.str
            if (this.textHandler) {
                return this.textHandler(this.str, ...this.args)
            }
        }
        return this.str
    }
    public travEventsLike(): string {
        const qtMarkNum = (() => {
            const matchList = this.str.match(/\"/g)
            return matchList ? matchList.length : 0
        })()
        if (qtMarkNum % 2) {
            Starlog.warnning(`文本包含未闭合引号，使用全字匹配模式...\n\x1B[38;5;65m${this.str}\x1B[0m`)
            // 处理包含奇数引号的文本
            return this.travPlainText()
        }
        else {
            let index = -1
            return this.str.replace(/\".*?\"/g, (s) => {
                index++
                return "\"" + this.traverse(s.substring(1, s.length - 1), this.baseID + "." + index) + "\""
            })
        }
    }
    public travNpcGiftTastes(): string {
        const strLi = this.str.split(/\s*\/\s*/)
        // 遍历字符串文字，其中模2片段为需要翻译的字符串
        for (let index = 0; index < strLi.length; index++) {
            if (!(index % 2)) {
                strLi[index] = this.traverse(strLi[index], this.baseID + "." + index / 2)
            }
        }
        return strLi.join("/")
    }
    public travNpcDispositions() {
        const strLi = this.str.split(/\s*\/\s*/)
        const index = 11
        if (strLi[index]) {
            strLi[index] = this.traverse(strLi[index], this.baseID)
        }
        return strLi.join("/")
    }
}