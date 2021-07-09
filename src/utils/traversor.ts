import { CommonFields } from "../libs/base_types";

interface ContentPack {
    Format: string,
    Changes: (CommonFields)[],
    ConfigSchema?: { [index: string]: string }
    CustomLocations?: any[] // ignore
}

interface StrDict {
    [index: string]: { // 字符串ID
        Origin: string, // Mod中直接提取的字符串
        Alter: string[] // 经过Handler处理的字符串(列表)
    }
}

interface ChangeObj {
    obj: CommonFields,
    dict: StrDict
}

class ChangeTraversor {
    public change: CommonFields
    constructor(change: CommonFields) {
        this.change = change
    }
    /**
     * traverse
     * 遍历器返回一个ChangeObj对象，包含提取的StrDict和处理后的ChangeObj
     */
    public traverse(): ChangeObj {
        const result: ChangeObj = {
            obj: this.change,
            dict: {}
        }
        // TODO 判断Change属于哪个类型,并处理遍历


        return result
    }
}

export { ChangeTraversor, StrDict }