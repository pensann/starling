import { resolve, join, extname } from "path";
import { parseJSON } from "./parser";
interface CommonChange extends CommonFields {
    [index: string]: any
}

interface ChangeAlter {
    alter: CommonChange, // 修改后的CommonChange对象
    dict: Dict, // 提取的字符串字典
}

interface EntriesAlter {
    alterEntries: { [index: string]: string | null },
    dict: Dict // 提取的字符串字典
}

interface MoviesReactionEntriesAlter {
    alterEntries: MoviesReactionEntries,
    dict: Dict
}

interface Dict { [index: string]: string }

class ChangeTraversor {
    public change: CommonChange
    public re: RegExp
    constructor(change: CommonFields, re?: RegExp) {
        this.re = re ? re : /.*/gm
        this.change = change
    }

    // * BaseID
    protected get baseID(): string {
        return this.change.Action + this.change.Target + "[When]" + (() => {
            let str = ""
            if (this.change.When) {
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
        strHandler?: (str: string, ...args: any[]) => string,
        ...args: any[]): EntriesAlter {
        const result: EntriesAlter = {
            alterEntries: entries,
            dict: {}
        }
        for (const [key, value] of Object.entries(entries)) {
            // 匹配dialogue
            if (
                regexp_dialogue.test(target)
                || regexp_strings_from_cs_files.test(target)
                || regexp_data_mail.test(target)
                || regexp_data_strings_from_maps.test(target)
            ) {
                if (value && this.re.test(value)) {
                    // 将字符串提取至字典
                    result.dict[baseID + key] = value
                    // 处理字符串
                    if (strHandler) {
                        result.alterEntries[key] = strHandler(value, ...args)
                    }
                }
            }
            // 匹配Event
            else if (regexp_event.test(target)) {
                if (value && this.re.test(value)) {
                    // 将字符串提取至字典
                    const eventAlter = event_str_traversor(value, strHandler, ...args)
                    let n = 0
                    // TODO 这里可以手写遍历，不使用迭代
                    while (n < eventAlter.strLi.length) {
                        result.dict[baseID + key + "-#" + n] = eventAlter.strLi[n]
                        n += 1
                    }
                    // TODO 这里有问题
                    result.alterEntries[key] = eventAlter.alterStr
                }
            }
            // 匹配NPCDispositions
            else if (regexp_npc_dispositions.test(target)) {
                if (value && this.re.test(value)) {
                    result.alterEntries[key] = value.replace(/\/[^\/]*?$/g, (str: string) => {
                        // 将字符串提取至字典
                        const s_real = str.substring(1)
                        result.dict[baseID + key] = s_real
                        if (strHandler) {
                            // 处理字符串
                            str = "/" + strHandler(s_real, ...args)
                        }
                        return str
                    })
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
                // TODO Fields
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
            alter: this.change,
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
                    // TODO Load需要做IO操作，将输出好的Entries整理成文件，并修改FromFile入口
                    // Object.assign(result.alter.Entries, entriesAlter.alter)
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
        console.log("[\x1B[38;5;208mWARNING\x1B[0m] 字符串包含奇数引号，使用全字匹配模式...")
        console.log(`\x1B[38;5;65m${str}\x1B[0m`)
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

/**
 * 翻译器，查找字典中传入字符串的翻译。  
 * *若字典中未找到翻译，则返回`原字符串`
 */
function str_translator(str: string, dict: { [index: string]: string }) {
    return dict[str] ? dict[str] : str
}

// 直接提取字符串
const regexp_dialogue = /Characters(\/|\\\\)Dialogue(\/|\\\\).*/i
const regexp_strings_from_cs_files = /Strings(\/|\\\\)StringsFromCSFiles/i
const regexp_data_mail = /Data(\/|\\\\)Mail/i
const regexp_data_strings_from_maps = /Strings(\/|\\\\)StringsFromMaps/i

// ? 据说含有dialogue，但SVE没有
const regexp_strings_schedule = /Strings(\/|\\\\)Schedules(\/|\\\\).*/i
const regexp_animation = /Data(\/|\\\\)AnimationDescriptions/i
const regexp_data_npc_gift_tastes = /Data(\/|\\\\)NPCGiftTastes/i

// ! 特殊格式
const regexp_event = /Data(\/|\\\\)Events(\/|\\\\).*/i

// ! "/"隔开，取最后一个区间
const regexp_npc_dispositions = /Data(\/|\\\\)NPCDispositions/i

// * Do more here...


export { EditDataTraversor, LoadTraversor }
