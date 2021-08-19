import { parseJSON } from "./libs/parser"
import { Lang, Trav4Mod } from "./libs/trav-files"
import { loadProject, mergeDict } from "./libs/stardict";
import { buildTarget } from "./libs/builder";
import { TravEntries } from "./libs/trav-entries";
import { Starlog } from "./libs/log";
import { join } from "path";


import { spawnSync } from "child_process";
import { rmdirSync } from "fs";
import { rmDir } from "./libs/rmdir";
const dict = {}
const src = "res/RSV/Ridgeside Village/[CP] Ridgeside Village"
const srcDisable = "res/RSV/Ridgeside Village/[CP] Ridgeside Village"
const dist = "res/RSV/Ridgeside Village/[CP] Ridgeside Village-zh"

// const src = "res/SVE/SVE1.13.11/Stardew Valley Expanded/[CP] Stardew Valley Expanded"
// const srcDisable = "res/SVE/SVE1.13.11/Stardew Valley Expanded/.[CP] Stardew Valley Expanded"
// const dist = "res/SVE/SVE1.13.11/Stardew Valley Expanded/[CP] Stardew Valley Expanded-i18n"

// const src = "res/SVE/SVE1.13.10/Stardew Valley Expanded/[CP] Stardew Valley Expanded"
// const srcDisable = "res/SVE/SVE1.13.10/Stardew Valley Expanded/.[CP] Stardew Valley Expanded"
// const dist = "res/SVE/SVE1.13.10/Stardew Valley Expanded/[CP] Stardew Valley Expanded-zh"


rmDir(dist)
spawnSync('mv', [src, srcDisable])
spawnSync('cp', ['-r', srcDisable, dist])
const t = new Trav4Mod(dist)
t.loadFile("content.json")
Object.assign(dict, t.extractText(Lang.default,true))
buildTarget(join(dist, "i18n", "default.json"), JSON.stringify(dict, undefined, 4))

// buildTarget("res/test.json", JSON.stringify(dict, undefined, 2))
// const dictch = {}
// const t2 = new Traversor4Mod("res/RSV/Ridgeside Village Mod 1.2.7/[CP] Ridgeside Village")
// t2.loadFile("content.json")
// Object.assign(dictch, t2.extractText(Lang.zh))

// mergeDict(dict, dictch).toTranslationProject("res/RSV/RSV-translate")
// buildTarget("res/RSV/test.json", JSON.stringify(loadProject("res/RSV/RSV-translate"), undefined, 2))