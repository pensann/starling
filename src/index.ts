import { buildTarget } from "./libs/builder";
import { parseJSON } from "./libs/parser";
import { Translator } from "./libs/translator";

let translator

const transLi = [
    // "res/SVE/translator.json",
    "res/RSV/translator.json",
    // "res/MNF/translator.json"
]

transLi.forEach(s => {
    translator = new Translator(s)
    translator.buildProject()
    translator.translate()
})

// const c = parseJSON("res/SVE/SVE1.13.11/Stardew Valley Expanded/[CP] Stardew Valley Expanded/content.json")
// buildTarget("res/SVE/SVE-zh/content.json", JSON.stringify(c, undefined, 2))

// import { mergeDict } from "./libs/stardict";
// mergeDict(
//     parseJSON("res/SVE/SVE1.13.11-i8n/Stardew Valley Expanded/[CP] Stardew Valley Expanded-i18n/i18n/default.json"),
//     parseJSON("res/SVE/SVE1.13.11-i8n/Stardew Valley Expanded/[CP] Stardew Valley Expanded-i18n/i18n/zh.json")
// ).toTranslationProject("res/SVE/cp-translation")

// const dict: DictKV = parseJSON("res/SVE/SVE1.13.11-i8n/Stardew Valley Expanded/[CP] Stardew Valley Expanded-i18n/i18n/zh.json")
// const dictzh: DictKV = {}

// for (const [key, value] of Object.entries(dict)) {
//     if (/[^\x00-\xff]/m.test(value)) {
//         dictzh[key] = value
//     }
// }

// import { mergeDict } from "./libs/stardict";
// mergeDict(
//     parseJSON("res/SVE/SVE1.13.11-i8n/Stardew Valley Expanded/[CP] Stardew Valley Expanded-i18n/i18n/default.json"),
//     dictzh
// ).toTranslationProject("res/SVE/cp-translation")
