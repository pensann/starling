import { mergeDict } from "./utils/extrator";
import { parseJSON, parseXMLStr } from "./utils/parser";
import { DialogueStr } from "./utils/str";
const eng_file = "res/dict_eng.json"
const chs_file = "res/dict_chs.json"
const dict_eng = parseJSON(eng_file)
const dict_chs = parseJSON(chs_file)
const da = mergeDict(dict_eng, dict_chs)
da.toTranslationProject("res/temp")
// console.log(parseXMLStr(readFileSync("res/temp/src/12.xml", { encoding: "utf8" })))
// ! 验证XML文件中带双引号"的文本能否正确替换

// const origin = new DialogueStr("first line #$e#second line")
// const alter = new DialogueStr("第一行 #$e#第二行")
// const strOriginLi = origin.strBeauty.split("\n")
// const strAlterLi = alter.strBeauty.split("\n")
// let str = ""
// for (let index = 0; index < strOriginLi.length; index++) {
//     str = str.concat(
//         "\n//\t",
//         strOriginLi[index],
//         "\n\t",
//         strAlterLi[index]
//     )
// }
// console.log(str)