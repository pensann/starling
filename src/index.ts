import { buildTarget } from "./libs/builder";
import { parseJSON } from "./libs/parser";
import { Translator } from "./libs/translator";

let translator

// const transLi = [
//     "res/SVE/translator.json",
//     // "res/RSV/translator.json",
//     // "res/MNF/translator.json"
// ]

// transLi.forEach(s => {
//     translator = new Translator(s)
//     // translator.buildProject()
//     translator.translate()
// })

const c = parseJSON("res/SVE/SVE1.13.11/Stardew Valley Expanded/[CP] Stardew Valley Expanded/content.json")
// const c = parseJSON("res/SVE/SVE-zh/content.json")
buildTarget("res/SVE/SVE-zh/content.json", JSON.stringify(c, undefined, 2))