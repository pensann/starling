import { createHash } from "crypto"
import { readdirSync, statSync } from "fs"
import { join } from "path"

let repeatedIdIndex = 0

export const REPEATED_ID_LIST: string[] = []
export const TRAV_RESULT_DICT: DictKV = {}

export enum Lang {
    default = "default",
    zh = "zh"
}

export class Traversor {
    public src: string = "."
    public dist: string = "."
    public readonly emptyDict = () => {
        for (const key in TRAV_RESULT_DICT) {
            delete TRAV_RESULT_DICT[key]
        }
    }
    public args: any[] = []
    public baseID: string
    public lang = Lang.default
    public get re() {
        switch (this.lang) {
            case Lang.zh:
                return /[^\x00-\xff]/m
            default:
                return /./
        }
    }
    public textHandler: ((str: string, id?: string, ...args: any[]) => string) | undefined
    constructor(baseID: string = "") {
        this.baseID = baseID
    }
    public readonly getID = (id: string, value: string) => {
        return this.getIDMethod(id, value)
    }
    public getIDMethod(id: string, value: string) {
        const fmt = (id: string) => {
            // return id
            // return id.replace(/\s+/g, "_").replace(/\/|\||=/g, ".")
            return createHash("sha1").update(id).digest('hex').slice(0, 8)
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
                // return id.replace(/\s+/g, "_").replace(/\/|\||=/g, ".")
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