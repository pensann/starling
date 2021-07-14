
// import { extractModStr } from "./utils/extrator";


// const eng = "res/-Stardew Valley Expanded--3753-1-13-8-1625195234/Stardew Valley Expanded/[CP] Stardew Valley Expanded/content.json"
// const eng_file = "res/dict_eng.json"
// extractModStr(eng, eng_file)










// 解压模组字典
// import { extractModStr } from "./utils/extrator"
// const eng = "res/SVE/Stardew Valley Expanded/[CP] Stardew Valley Expanded/content-backup.json"
// const eng_file = "res/dict_eng.json"
// extractModStr(eng, eng_file)


// 通过模组字典
import { parseJSON } from "./utils/parser";
import { mergeDict } from "./utils/extrator";
import { buildTarget } from "./utils/builder";
const eng_file = "res/dict_eng.json"
const dict_eng = parseJSON(eng_file)
// buildTarget("res/dict.json", JSON.stringify(mergeDict(dict_eng), undefined, 4))

import { dump } from "js-yaml";
buildTarget("res/dict.yaml", dump(mergeDict(dict_eng)))




// import { DialogueStr } from "./utils/str";
// import { writeFileSync } from "fs";
// import { regexp_events } from "./libs/regex";
// const mod = "res/-Stardew Valley Expanded--3753-1-13-8-1625195234/Stardew Valley Expanded/[CP] Stardew Valley Expanded/content.json"
// const mod = "res/-Stardew Valley Expanded--3753-1-13-8-1625195234/Stardew Valley Expanded/[CP] Stardew Valley Expanded/content_test.json"


// const chs_file = "res/dict_chs.json"


// const chs = "res/SVE/Stardew Valley Expanded/[CP] Stardew Valley Expanded/content.json"
// extractModStr(chs, chs_file, /[\u4e00-\u9fa5]/gm)
// const dict = parseJSON(eng_file)
// buildFromDict(dict)

// const str = "$q 75005 null#Do you really love me?#$r 75005 2500 raz_love#(Kiss Razolyn)#$r 75015 -1500 raz_lost#This shouldn't go any further."
// const dialogue = new DialogueStr(str)
// const strB = dialogue.strBeauty
// console.log(strB)