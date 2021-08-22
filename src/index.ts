import { TravFiles as TravJAFiles } from "./libs/json-assets/trav-files";
import { Lang, TRAV_RESULT_DICT } from "./libs/traversor";
import { cpConvertToi18n, cpi18nTranslate } from "./libs/content-patcher/tools";
import { jaTranslate } from "./libs/json-assets/tools";

let src, dist
src = "res/SVE/SVE1.13.11/Stardew Valley Expanded/[CP] Stardew Valley Expanded"
dist = "res/SVE/SVE1.13.11-i18n/Stardew Valley Expanded/[CP] Stardew Valley Expanded"
// cpConvertToi18n(src, dist)
// cpi18nTranslate(dist, loadProject("res/SVE/SVE-translate1.13.10"), Lang.zh)

src = "res/SVE/SVE1.13.11/Stardew Valley Expanded/[JA] Stardew Valley Expanded"
dist = "res/SVE/SVE1.13.11-i18n/Stardew Valley Expanded/[JA] Stardew Valley Expanded"
const jaTrav = new TravJAFiles("res/SVE/SVE/Stardew Valley Expanded/[JA] Stardew Valley Expanded")
jaTrav.emptyDict()
jaTrav.lang = Lang.zh
jaTrav.traverse()
jaTranslate(src, dist, TRAV_RESULT_DICT, Lang.zh)
