/** 最基础的字符串K-V 字典 */
interface DictKV {
    [index: string]: string
}

/** 包含修改后的Change和包含的字符串字典 */
interface ChangeTravResult {
    alter: CommonFields, // 修改后的CommonChange对象
    dict: DictKV, // 提取的字符串字典
}

/** 包含修改后的Entries和字符串字典 */
interface EntriesTravResult {
    alter: Entries,
    dict: DictKV // 提取的字符串字典
}
