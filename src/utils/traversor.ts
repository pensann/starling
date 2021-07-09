import { CommonFields, EditData, Include } from "../libs/base_types";

interface ContentPack {
    Format: string,
    Changes: (CommonFields | Include)[],
    ConfigSchema?: { [index: string]: string }
    CustomLocations?: any[] // ignore
}

interface ChangeAlter {
    alter: CommonChange, // 修改后的CommonChange对象
    dict: { [index: string]: string | null }, // 提取的字符串字典
    outputFile?: { // 对于Load和Include类型的Change, 需要生成额外的文件信息
        path: string
        content: string
    }
}

interface CommonChange extends CommonFields {
    [index: string]: any
}

class ChangeTraversor {
    public change: CommonFields
    constructor(change: CommonFields) {
        this.change = change
    }
    /**
     * traverse
     * 遍历器返回一个ChangeObj对象，包含提取的StrDict和ChangeAlter
     */
    public traverse(strHandler?: (str: string, ...args: any[]) => string, ...args: any[]): ChangeAlter {
        const result: ChangeAlter = {
            alter: this.change,
            dict: {}
        }
        // TODO 计算baseID
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
        // TODO 判断Change属于哪个类型,并处理遍历
        // TODO 目前不支持Include类型的代码
        if (this.change.Action == "EditData") {
            const change = this.change as EditData
            switch (change.Target) {
                case "Data/Movies":
                    // TODO Entries为数据模型
                    break;
                case "Data/ConcessionTastes":
                case "Data/FishPondData":
                case "Data/MoviesReactions":
                case "Data/TailoringRecipes":
                    // TODO Entries为数据列表
                    // 这个部分的数据可能会包含MoveEntries的索引
                    break;
                default:
                    // TODO 遍历Fields
                    // TODO 遍历Entries
                    // * TODO 可以将Entries抽象为EntriesHandler方法用于Load的代码复用
                    if (change.Entries) {
                        for (const [key, value] of Object.entries(change.Entries)) {
                            // 匹配dialogue
                            if (regex_dialogue_target.test(change.Target)) {
                                if (value) {
                                    // 将字符串提取至字典
                                    result.dict[baseID + key] = value as string
                                    // 处理字符串
                                    if (strHandler) {
                                        result.alter.Entries[key] = strHandler(value as string, ...args)
                                    }
                                }
                            }
                            // TODO 匹配其它Target
                        }
                    }
                    break;
            }
        }
        return result
    }
    private entriesHandler(strHandler?: (str: string, ...args: any[]) => string, ...args: any[]) {

    }
}

/**
 * - Character-specific dialogue
 * - Marriage dialogue
 * * 大部分包含dialogue
 */
const regex_dialogue_target = /Characters(\/|\\)Dialogue(\/|\\).*/i

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

export { ChangeTraversor, regex_dialogue_target, regex_event_target }
