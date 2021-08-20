import { Lang } from "./libs/trav"
import { buildTarget } from "./libs/builder";
import { join } from "path";


import { spawnSync } from "child_process";
import { rmDir } from "./libs/rmdir";
import { TravFiles } from "./libs/trav-files";
// const src = "res/RSV/Ridgeside Village/[CP] Ridgeside Village"
// const srcDisable = "res/RSV/Ridgeside Village/[CP] Ridgeside Village"
// const dist = "res/RSV/Ridgeside Village/[CP] Ridgeside Village-i18n"

const src = "res/SVE/SVE1.13.11/Stardew Valley Expanded/[CP] Stardew Valley Expanded"
const srcDisable = "res/SVE/SVE1.13.11/Stardew Valley Expanded/.[CP] Stardew Valley Expanded"
const dist = "res/SVE/SVE1.13.11/Stardew Valley Expanded/[CP] Stardew Valley Expanded-i18n"

// const src = "res/SVE/SVE1.13.10/Stardew Valley Expanded/[CP] Stardew Valley Expanded"
// const srcDisable = "res/SVE/SVE1.13.10/Stardew Valley Expanded/.[CP] Stardew Valley Expanded"
// const dist = "res/SVE/SVE1.13.10/Stardew Valley Expanded/[CP] Stardew Valley Expanded-zh"


rmDir(dist)
spawnSync('mv', [src, srcDisable])
spawnSync('cp', ['-r', srcDisable, dist])
const trav = new TravFiles(dist)
trav.textHandler = (_, id) => {
    return `{{i18n:${id}}}`
}
buildTarget(
    join(dist, "i18n", "default.json"),
    JSON.stringify(trav.traverse("content.json"), undefined, 4)
)

// buildTarget("res/test.json", JSON.stringify(dict, undefined, 2))
// const dictch = {}
// const t2 = new Traversor4Mod("res/RSV/Ridgeside Village Mod 1.2.7/[CP] Ridgeside Village")
// t2.loadFile("content.json")
// Object.assign(dictch, t2.extractText(Lang.zh))

// mergeDict(dict, dictch).toTranslationProject("res/RSV/RSV-translate")
// buildTarget("res/RSV/test.json", JSON.stringify(loadProject("res/RSV/RSV-translate"), undefined, 2))