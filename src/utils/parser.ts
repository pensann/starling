import { readFileSync } from "fs"
import { stripComments } from "jsonc-parser"
import jsonic = require("jsonic")

/** 返回无BOM头的字符串 */
function stripBOM(str: string) {
    return str.charCodeAt(0) == 0xfeff ?
        str.slice(1)
        : str
}

/** 解析JSON文件，返回JSON对象
 * - 默认使用"utf-8"、"utf-8-sig"编码，可指定编码
 * - 支持跨行的非标准JSON文件(转义为\n)
 * - 支持使用数字做索引的非标准json
 */
function parseJSON(path: string, encoding: BufferEncoding = "utf-8") {
    const jsonStr = stripComments(stripBOM(readFileSync(path, encoding)))
    try { return JSON.parse(jsonStr) }
    catch (error) {
        if (error instanceof SyntaxError) {
            return jsonic(jsonStr)
        }
    }
}

export { parseJSON }