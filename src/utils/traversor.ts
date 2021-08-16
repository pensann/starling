import { resolve, join, extname, dirname, basename } from "path";
import { starlog, LOG } from "./log";
import { parseJSON } from "./parser";
import {
    regexp_dialogue,
    regexp_data_mail,
    regexp_data_strings_from_maps,
    regexp_strings_from_csfiles,
    regexp_events,
    regexp_festivals,
    regexp_npc_dispositions,
    regexp_data_npc_gift_tastes,
    regexp_strings_schedule
} from "../libs/regex"
import { buildTarget } from "./builder";
class ChangeTraversor {
    public change: CommonChange
    public re: RegExp
    constructor(change: CommonFields, re?: RegExp) {
        this.re = re ? re : /./m
        this.change = change
    }

    // * BaseID
    protected get baseID(): string {
        return this.change.Action + this.change.Target + (() => {
            let str = ""
            if (this.change.When) {
                str += "[When]"
                for (const [key, value] of Object.entries(this.change.When)) {
                    if (key.toLowerCase() != "language") {
                        str += key + value
                    }
                }
            }
            return str
        })()
    }

    /**
     * 默认Entries遍历器，处理{key:value}并返回alter+dict  
     * *注意，value可能为null，代表删除入口
     */
    protected defaultEntriesTraversor(
        baseID: string,
        target: string,
        entries: EntriesAlter["alterEntries"],
        strHandler?: (str: string, ...args: any[]) => string, ...args: any[]
    ): EntriesAlter {
        const result: EntriesAlter = {
            alterEntries: entries,
            dict: {}
        }
        for (const [key, value] of Object.entries(entries)) {
            // 匹配dialogue
            if (
                regexp_dialogue.test(target)
                || regexp_data_mail.test(target)
                || regexp_strings_from_csfiles.test(target)
                || regexp_data_strings_from_maps.test(target)
                || regexp_strings_schedule.test(target)
                || regexp_festivals.test(target) //festivals默认为Dialogue模式但含有对话模式
            ) {
                if (value
                    && this.re.test(value)
                    && !/\"/m.test(value)
                    && key != "set-up") {
                    // 使用正则提取非对话
                    // 将字符串提取至字典
                    result.dict[baseID + key] = value
                    // 处理字符串
                    if (strHandler) {
                        result.alterEntries[key] = strHandler(value, ...args)
                    }
                }
            }
            // 匹配Event
            else if (
                regexp_events.test(target)
                || regexp_festivals.test(target)
            ) {
                if (value
                    && this.re.test(value)
                    && /\"/m.test(value)
                    && key != "set-up") {
                    const eventAlter = event_str_traversor(value, strHandler, ...args)
                    let n = 0
                    // JS对于已知长度的List手写遍历的性能比迭代器好
                    while (n < eventAlter.strLi.length) {
                        // 将字符串提取至字典
                        if (eventAlter.strLi[n]) { result.dict[baseID + key + "-#" + n] = eventAlter.strLi[n] }
                        n += 1
                    }
                    result.alterEntries[key] = eventAlter.alterStr
                }
            }
            // 匹配NPCDispositions
            else if (regexp_npc_dispositions.test(target)) {
                if (value && this.re.test(value)) {
                    const strLi = value.split("/")
                    if (strLi.length) {
                        const index = strLi.length - 1
                        // 原字符串提取到字典
                        if (strLi[index]) {
                            result.dict[baseID + key] = strLi[index]
                            if (strHandler) {
                                // 处理字符串
                                strLi[index] = strHandler(strLi[index], ...args)
                            }
                        }
                    }
                    // ? （可能有问题）处理后的字符串输出到alter
                    result.alterEntries[key] = strLi.join("/")
                }
            }
            // 匹配GiftTastes
            else if (regexp_data_npc_gift_tastes.test(target)) {
                if (value && this.re.test(value)) {
                    const strLi = value.split("/")
                    if (strLi.length) {
                        let n = 0
                        // 遍历字符串文字，其中模2片段为需要翻译的字符串
                        while (n < strLi.length) {
                            if (!(n % 2)) {
                                if (strLi[n]) {
                                    // 原字符串提取到字典
                                    result.dict[baseID + key + "-#" + n] = strLi[n]
                                    // 处理字符串
                                    if (strHandler) {
                                        strLi[n] = strHandler(strLi[n], ...args)
                                    }
                                }
                            }
                            n += 1
                        }
                        result.alterEntries[key] = strLi.join("/")
                    }
                }
            }
            // TODO 匹配其它Target
        }
        return result
    }
    protected moviesReactionEntriesTraversor(
        baseID: string,
        entries: MoviesReactionEntries,
        strHandler?: (str: string, ...args: any[]) => string,
        ...args: any[]

    ): MoviesReactionEntriesAlter {
        const result: MoviesReactionEntriesAlter = {
            alterEntries: entries,
            dict: {}
        }

        for (const [keyEntry, valueObj] of Object.entries(entries)) {
            let n = 0
            valueObj.Reactions.forEach((reaction) => {
                if (reaction.SpecialResponses) {
                    for (const [keySPR, valueSPR] of Object.entries(reaction.SpecialResponses)) {
                        if (valueSPR && valueSPR.Text) {
                            // 将字符串提取至字典
                            result.dict[baseID + keyEntry + keySPR + "-#" + n] = valueSPR.Text
                            // 处理字符串
                            if (strHandler) {
                                result.alterEntries[keyEntry]["Reactions"][n]["SpecialResponses"]![keySPR]["Text"] = strHandler(valueSPR.Text, ...args)
                            }
                        }
                    }
                }
                n += 1
            })
        }
        return result
    }
}

class EditDataTraversor extends ChangeTraversor {
    /**
     * traverse
     */
    public traverse(strHandler?: (str: string, ...args: any[]) => string, ...args: any[]): ChangeAlter {
        const result: ChangeAlter = {
            alter: this.change,
            dict: {}
        }

        const change = this.change as EditData
        switch (this.change.Target) {
            case "Data/Movies":
                // ? TODO Entries为数据模型
                break;
            case "Data/ConcessionTastes":
            case "Data/FishPondData":
            case "Data/TailoringRecipes":
                // ? TODO Entries为数据列表
                break;
            case "Data/MoviesReactions":
                // ? 先尝试支持 MoviesReactions
                // * Entries为数据列表
                if (change.Entries) {
                    const entries = change.Entries as MoviesReactionEntries
                    const entriesAlter = this.moviesReactionEntriesTraversor(
                        this.baseID, entries, strHandler, ...args)
                    Object.assign(result.alter.Entries, entriesAlter.alterEntries)
                    Object.assign(result.dict, entriesAlter.dict)
                }
                break;
            default:
                // ? Fields SVE中Fields不包含文本
                // 这个部分的Entries满足{Key:Value}模式
                if (change.Entries) {
                    const target = change.Target
                    const entries = change.Entries as EntriesAlter["alterEntries"]
                    const entriesAlter = this.defaultEntriesTraversor(this.baseID, target, entries, strHandler, ...args)
                    Object.assign(result.alter.Entries, entriesAlter.alterEntries)
                    Object.assign(result.dict, entriesAlter.dict)
                }
                break;
        }
        return result
    }
}

class LoadTraversor extends ChangeTraversor {
    public modPath: string
    constructor(change: CommonChange, modPath: string, re?: RegExp) {
        super(change, re)
        this.modPath = modPath
    }
    /**
     * traverse
     */
    public traverse(strHandler?: (str: string, ...args: any[]) => string, ...args: any[]): ChangeAlter {
        const result: ChangeAlter = {
            alter: this.change as Load,
            dict: {}
        }
        const change = this.change as Load
        if (extname(change.FromFile) == ".json") {
            const entries = parseJSON(join(resolve(this.modPath), change.FromFile))
            switch (this.change.Target) {
                case "Data/Movies":
                    // ? TODO Entries为数据模型
                    break;
                case "Data/ConcessionTastes":
                case "Data/FishPondData":
                case "Data/MoviesReactions":
                case "Data/TailoringRecipes":
                    // ? TODO Entries为数据列表
                    break;
                default:
                    // 这个部分的Entries满足{Key:Value}模式
                    const target = change.Target
                    const entriesAlter = this.defaultEntriesTraversor(this.baseID, target, entries, strHandler, ...args)
                    Object.assign(result.dict, entriesAlter.dict)
                    if (strHandler) {
                        const filePathR = join(dirname(change.FromFile), basename(change.FromFile, ".json") + "-alter.json")
                        const filePath = join(resolve(this.modPath), filePathR)
                        buildTarget(filePath, JSON.stringify(entriesAlter.alterEntries, undefined, 4))
                        result.alter["FromFile"] = filePathR
                    }
                    break;
            }
        }
        return result
    }
}

/** 
 * 1. 容错性考虑, 检测字符串中是否包含奇数引号
 *    - 奇数引号做全字匹配
 *    - 偶数引号匹配双引号，并按照传入字典替换值
 */
function event_str_traversor(str: string, strHandler?: (str: string, ...args: any[]) => string, ...args: any[]): {
    alterStr: string,
    strLi: string[]
} {
    const result = {
        alterStr: str,
        strLi: [] as string[]
    }
    const qtMarkNum = (() => {
        const matchList = str.match(/\"/g)
        return matchList ? matchList.length : 0
    })()
    if (qtMarkNum % 2) {
        starlog(LOG.WARN, `文本包含未闭合引号，使用全字匹配模式...\n\x1B[38;5;65m${str}\x1B[0m`)
        result.strLi.push(str)
        if (strHandler) { result.alterStr = strHandler(str, ...args) }
    }
    else result.alterStr = str.replace(/\".*?\"/g, (s) => {
        const str = s.substring(1, s.length - 1)
        result.strLi.push(str)
        if (strHandler) return "\"" + strHandler(str, ...args) + "\""
        else return s
    })
    return result
}

export { EditDataTraversor, LoadTraversor }
