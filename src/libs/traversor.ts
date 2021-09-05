import { createHash } from "crypto"
import { readdirSync, statSync } from "fs"
import { join } from "path"

export enum Lang {
    default = "default",
    zh = "zh"
}

let repeatedIdIndex = 0
export const REPEATED_ID_LIST: string[] = []

export const TRAV_RESULT_DICT: DictKV = {}
export const TRAV_INIT = () => {
    for (const key in TRAV_RESULT_DICT) {
        delete TRAV_RESULT_DICT[key]
    }
}

/**
 * @param src
 * @param dist
 * @function textHandler 文本处理器
 * @param textHArgs 文本处理器参数
 * @param lang 语言枚举
 * @param baseID (readonly)
 * @function getTextID 计算文本的ID
 */
export class Traversor {
    // 路径
    public src: string = "."
    public dist: string = "."
    /** 文本处理器接受text、id?(兼容i18n)作为输入，其余参数作为rest参数传入 */
    public textHandler: ((str: string, id?: string, ...args: any[]) => string) | undefined
    public textHArgs: any[] = []
    // 语言
    public lang = Lang.default
    public get re() {
        switch (this.lang) {
            case Lang.zh:
                return /[^\x00-\xff]/m
            default:
                return /./
        }
    }
    constructor(baseID = "") {
        this.baseID = baseID
    }
    // ID处理
    protected readonly baseID: string
    // 测试用
    public getTextID(id: string, value: string, mode = "sha1_4") {
        // TODO
        const fmt = (id: string) => {
            switch (mode) {
                case "sha1_4":
                    return createHash("sha1").update(id).digest('hex').slice(0, 8)
                default:
                    return id.replace(/\s+/g, "_").replace(/\/|\||=/g, ".")
            }
        }
        try {
            const idExists = (() => {
                for (const [idNow, valueNow] of Object.entries(TRAV_RESULT_DICT)) {
                    if (value == valueNow) {
                        return idNow
                    } else if (fmt(id) == idNow) {
                        throw new Error(`Multiple values(${valueNow},${value}) using a same id(${id})!`);
                    }
                }
            })()
            if (idExists) {
                return idExists
            } else {
                return fmt(id)
            }
        } catch (error) {
            repeatedIdIndex++
            const repeatedId = id + "." + repeatedIdIndex
            REPEATED_ID_LIST.push(id + "." + repeatedIdIndex)
            return fmt(repeatedId)
        }
    }
}

export function travel(
    dir: string,
    callback: (pathName: string, fromPath: string) => void,
    fromPath?: string
) {
    readdirSync(dir).forEach((file: string) => {
        let pathname = join(dir, file)
        fromPath = fromPath ? fromPath : dir
        if (statSync(pathname).isDirectory()) {
            travel(pathname, callback, fromPath)
        } else {
            callback(pathname, fromPath)
        }
    })
}