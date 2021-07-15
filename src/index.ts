import { dump } from "js-yaml";
import { buildTarget } from "./utils/builder";
import { mergeDict } from "./utils/extrator";
import { parseJSON } from "./utils/parser";
const eng_file = "res/dict_eng.json"
const dict_eng = parseJSON(eng_file)
const da = mergeDict(dict_eng, dict_eng)
buildTarget("res/dictKV2.yaml", dump(da, { lineWidth: 100000000 }))

import { readFileSync, writeFileSync } from "fs";
import { DialogueStr } from "./utils/str";


// 测试YML直接格式化
const yml = readFileSync("res/dictKV2.yaml", { encoding: "utf8" })
writeFileSync("res/dictKV3.yaml", new DialogueStr(yml).strBeauty
    .replace(/^#/g, "    ")
)