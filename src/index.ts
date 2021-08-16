import { buildTranslationProject, translateMod } from "./tools"
import { buildTarget } from "./utils/builder"
import { extractModStr, mergeDict } from "./utils/extrator"

const path = "res/translator.json"
buildTranslationProject(path)
// translateMod(path, { zip: false })
// const dict = mergeDict(
//     extractModStr("res/SVE1.13.10/Stardew Valley Expanded/[CP] Stardew Valley Expanded/content-backup.json"),
//     extractModStr("res/SVE1.13.10/Stardew Valley Expanded/[CP] Stardew Valley Expanded/content.json", /[^\x00-\xff]/m)
// ).toDictKV()
// buildTarget("res/dict.json", JSON.stringify(dict, undefined, 2))