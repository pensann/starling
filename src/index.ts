import { join, extname, resolve } from "path";


import { exec, spawnSync } from "child_process";
import { loadProject } from "./libs/stardict";
import { parseJSON } from "./libs/parser";
import { readdirSync, statSync } from "fs";
import { Starlog } from "./libs/log";

function travel(dir: string, callback: Function) {
    readdirSync(dir).forEach((file: string) => {
        let pathname = join(dir, file)
        if (statSync(pathname).isDirectory()) {
            travel(pathname, callback)
        } else {
            callback(pathname)
        }
    })
}

// const src = "res/RSV/Ridgeside Village/[CP] Ridgeside Village"
// const srcDisable = "res/RSV/Ridgeside Village/[CP] Ridgeside Village"
// const dist = "res/RSV/Ridgeside Village/[CP] Ridgeside Village-i18n"

const src = "res/SVE/SVE1.13.11/Stardew Valley Expanded/[CP] Stardew Valley Expanded"
const srcDisable = "res/SVE/SVE1.13.11/Stardew Valley Expanded/.[CP] Stardew Valley Expanded"
const dist = "res/SVE/SVE1.13.11/Stardew Valley Expanded/[CP] Stardew Valley Expanded-i18n"

// const src = "res/SVE/SVE1.13.10/Stardew Valley Expanded/[CP] Stardew Valley Expanded"
// const srcDisable = "res/SVE/SVE1.13.10/Stardew Valley Expanded/.[CP] Stardew Valley Expanded"
// const dist = "res/SVE/SVE1.13.10/Stardew Valley Expanded/[CP] Stardew Valley Expanded-zh"


function translate() {
    const dict: DictKV = loadProject("res/SVE/SVE-translate1.13.10")

    const content: DictKV = parseJSON(join(dist, "i18n", "default.json"))
    for (const [key, value] of Object.entries(content)) {
        const valueNew = dict[value]
        if (valueNew) {
            content[key] = valueNew
        } else {
            delete content[key]
        }
    }
    buildTarget(
        join(dist, "i18n", "zh.json"),
        JSON.stringify(content, undefined, 4)
    )
    // JA
    const dictja: { [index: string]: any } = {}
    travel("res/SVE/SVE1.13.10/Stardew Valley Expanded/[JA] Stardew Valley Expanded", (m: any) => {
        const ext = extname(m)
        if (ext == ".json") {
            Starlog.infoOneLine(m)
            try {
                const j = parseJSON(m)
                if (j && j.NameLocalization) {
                    dict[j.Name] = j.NameLocalization
                }
                if (j && j.DescriptionLocalization) {
                    dict[j.Description] = j.DescriptionLocalization
                }
            } catch (error) {
                exec("code '" + m + "'")
                throw new Error(error);
            }
        }
    })
    travel("res/SVE/SVE1.13.11/Stardew Valley Expanded/[JA] Stardew Valley Expanded", (m: any) => {
        const ext = extname(m)
        if (ext == ".json") {
            const j = parseJSON(m)
            if (dict[j.Name]) {
                j.NameLocalization = dict[j.Name]
            }
            if (dict[j.Description]) {
                j.DescriptionLocalization = dict[j.Description]
            }
            buildTarget(resolve(m), JSON.stringify(j, undefined, 2))
        }
    })
}

convertCPToI18n()
translate()

// buildTarget("res/test.json", JSON.stringify(dict, undefined, 2))
// const dictch = {}
// const t2 = new Traversor4Mod("res/RSV/Ridgeside Village Mod 1.2.7/[CP] Ridgeside Village")
// t2.loadFile("content.json")
// Object.assign(dictch, t2.extractText(Lang.zh))

// mergeDict(dict, dictch).toTranslationProject("res/RSV/RSV-translate")
// buildTarget("res/RSV/test.json", JSON.stringify(loadProject("res/RSV/RSV-translate"), undefined, 2))