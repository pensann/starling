import { CommonFields, EditData, Include, BaseChange } from "../libs/base_types";

interface ContentPack {
    Format: string,
    Changes: (CommonFields | Include)[],
    ConfigSchema?: { [index: string]: string }
    CustomLocations?: any[] // ignore
}

interface CommonChange extends BaseChange {
    [index: string]: any
}

interface ChangeAlter {
    alter: CommonChange, // 修改后的CommonChange对象
    dict: { [index: string]: string }, // 提取的字符串字典
    outputFile?: { // 对于Load和Include类型的Change, 需要生成额外的文件信息
        path: string
        content: string
    }
}

interface EntriesAlter {
    alter: { [index: string]: string | null },
    dict: { [index: string]: string } // 提取的字符串字典
}

class ChangeTraversor {
    public change: CommonChange
    constructor(change: CommonFields) {
        this.change = change
    }
    /**
     * traverse
     * 遍历器返回一个ChangeObj对象，包含提取的StrDict和ChangeAlter
     */
    private defaultEntriesHandler(
        baseID: string,
        target: string,
        entries: EntriesAlter["alter"],
        strHandler?: (str: string, ...args: any[]) => string,
        ...args: any[]): EntriesAlter {
        const result: EntriesAlter = {
            alter: entries,
            dict: {}
        }
        for (const [key, value] of Object.entries(entries)) {
            // 匹配dialogue
            if (regex_dialogue_target.test(target)) {
                if (value) {
                    // 将字符串提取至字典
                    result.dict[baseID + key] = value
                    // 处理字符串
                    if (strHandler) {
                        result.alter[key] = strHandler(value, ...args)
                    }
                }
            }
            // 匹配Event
            else if (regex_event_target.test(target)) {
                if (value) {
                    // 将字符串提取至字典
                    result.dict[baseID + key] = value
                    // 处理字符串
                    if (strHandler) {
                        result.alter[key] = event_str_traversor(value, strHandler, ...args)
                    }
                }
            }
            // TODO 匹配其它Target
        }
        return result
    }
    /**
     * Change对象遍历器：
     * 1. 返回Change对象中包含的`原字符串`字典
     * 2. 遍历模组中字符串，对于字符串执行指定操作，并返回操作后的Change对象
     */
    public traverse(strHandler?: (str: string, ...args: any[]) => string, ...args: any[]): ChangeAlter {
        const result: ChangeAlter = {
            alter: this.change,
            dict: {}
        }
        // * BaseID
        const baseID = this.change.Action + this.change.Target + "[When]" + (() => {
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
        if (this.change.Action == "Include") {
            // TODO 目前不支持Include类型的代码

        }
        else if (this.change.Action == "EditData") {
            const change = this.change as EditData
            switch (this.change.Target) {
                case "Data/Movies":
                    // TODO Entries为数据模型
                    break;
                case "Data/ConcessionTastes":
                case "Data/FishPondData":
                case "Data/MoviesReactions":
                case "Data/TailoringRecipes":
                    // ? 这个部分的数据可能会包含MoveEntries的索引
                    // TODO Entries为数据列表
                    break;
                default:
                    // TODO Fields
                    // 这个部分的Entries满足{Key:Value}模式
                    if (change.Entries) {
                        const target = change.Target
                        const entries = change.Entries as EntriesAlter["alter"]
                        const entriesAlter = this.defaultEntriesHandler(baseID, target, entries, strHandler, ...args)
                        change.Entries = entriesAlter.alter
                        Object.assign(result.alter.Entries, entriesAlter.alter)
                        Object.assign(result.dict, entriesAlter.dict)
                    }
                    break;
            }
        }
        return result
    }
}

/** 
 * 1. 容错性考虑, 检测字符串中是否包含奇数引号
 *    - 奇数引号不处理
 *    - 偶数引号匹配双引号，并按照传入字典替换值
 */
function event_str_traversor(str: string, strHandler: (str: string, ...args: any[]) => string, ...args: any[]) {
    const qtMarkNum = (() => {
        const matchList = str.match(/\"/g)
        return matchList ? matchList.length : 0
    })()
    if (qtMarkNum % 2) {
        console.log("[\x1B[1;38;2;252;127;0mWARNING\x1B[0m] 字符串包含奇数引号，使用全字匹配模式...")
        return strHandler(str, ...args)
    }
    else return str.replace(/\".*?\"/g, (s) => {
        const key = s.substring(1, s.length - 1)
        return "\"" + strHandler(key, ...args) + "\""
    })
}

/**
 * 翻译器，查找字典中传入字符串的翻译。  
 * *若字典中未找到翻译，则返回`原字符串`
 */
function str_translator(str: string, dict: { [index: string]: string }) {
    return dict[str] ? dict[str] : str
}

/**
 * - Character-specific dialogue
 * - Marriage dialogue
 * * 大部分包含dialogue
 */
const regex_dialogue_target = /(Characters(\/|\\)Dialogue(\/|\\).*|Strings(\/|\\)Schedules(\/|\\).*)/i

/**
 * - Event files
 * * 大部分包含dialogue
 */
const regex_event_target = /Data(\/|\\)Events(\/|\\).*/i

/**
 * - Animation descriptions
 * ? 有一小部分包含dialogue
*/
const regex_animation_target = /Data(\/|\\)AnimationDescriptions/i

/**
 * - Strings from CS files
 * ? 有一小部分包含dialogue
 */
const regex_strings_from_cs_files_target = /Strings(\/|\\)StringsFromCSFiles/i

export { ChangeTraversor }
