// import { dump } from "js-yaml";
// import { buildTarget } from "./utils/builder";
// import { mergeDict } from "./utils/extrator";
// import { parseJSON } from "./utils/parser";
// const eng_file = "res/dict_eng.json"
// const dict_eng = parseJSON(eng_file)
// const da = mergeDict(dict_eng, dict_eng)
// buildTarget("res/dictKV2.yaml", dump(da, { lineWidth: 100000000 }))

// import { DialogueStr } from "./utils/str"

// import { readFileSync, writeFileSync } from "fs";
// import { DialogueStr } from "./utils/str";


// // 测试YML直接格式化
// const yml = readFileSync("res/dictKV2.yaml", { encoding: "utf8" })
// writeFileSync("res/dictKV3.yaml", new DialogueStr(yml).strBeauty
//     .replace(/^#/g, "    ")
// )

// const str = "{{hi{{nihao}}}}#$e#hi$1#$b#你好#$q   -302 -1#$r -2932 -2 xxx_event#我是@ hiya %adj hiya %noun hiya %place hiya %spouse hiya %name hiya %firstnameletter hiya %time hiya %band hiya %book hiya %rival hiya %pet hiya %farm hiya %favorite hiya %kid1 hiya %kid hiya "

// const ds = new DialogueStr(str)

// console.log(ds.trait)

// const regex2 = /@|%adj|%noun|%place|%spouse|%name|%firstnameletter|%time|%band|%book|%rival|%pet|%farm|%favorite|%kid1|%kid2/gm

// console.log(str.match(regex2))

// 测试for循环

// const li = [1, 2, 3, 4, 5]

// function testFor() {
//     for (let index = 0; index < li.length; index++) {
//         const n = li[index];
//         console.log(n)
//         return
//     }
//     console.log("执行完了")
// }

// testFor()