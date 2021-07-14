/** 最基础的字符串K-V 字典 */
interface DictKV {
    [index: string]: string
}

/** 由ID字符串做索引的改动字典 */
interface DictAlter {
    [index: number]: {
        id: string
        origin: string
        alter: string[]
    }
}

/** 包含修改后的Change和包含的字符串字典 */
interface ChangeAlter {
    alter: CommonChange, // 修改后的CommonChange对象
    dict: DictKV, // 提取的字符串字典
}

/** 包含CommonFields字段的扩展类型 */
interface CommonChange extends CommonFields {
    [index: string]: any
}

/** 包含修改后的Entries和字符串字典 */
interface EntriesAlter {
    alterEntries: { [index: string]: string | null },
    dict: DictKV // 提取的字符串字典
}

/** 包含修改后的MoviesReactionEntries和字符串字典 */
interface MoviesReactionEntriesAlter {
    alterEntries: MoviesReactionEntries,
    dict: DictKV
}