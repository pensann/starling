import { exec } from "child_process"
import { extname, resolve } from "path"
import { buildTarget } from "../builder"
import { Starlog } from "../log"
import { parseJSON } from "../parser"
import { travel } from "../traversor"

function jaTranslate(mod2bTrans: string) {
    // JA
    const dict: { [index: string]: any } = {}
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