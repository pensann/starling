import { existsSync, rmdirSync } from "fs";
import { basename, join } from "path";
import { cpConvertToi18n, cpi18nTranslate } from "./content-patcher/tools";
import { TravFiles as TravCP } from "./content-patcher/trav-files";
import { jaTranslate } from "./json-assets/tools";
import { TravFiles as TravJA } from "./json-assets/trav-files";
import { Starlog } from "./log";
import { parseJSON } from "./parser";
import { loadProject, mergeDict } from "./stardict";
import { Lang, TRAV_RESULT_DICT } from "./traversor";

interface translatorConfig {
    Name: string
    src: string
    dist: string,
    Mods: [
        {
            Path: string,
            Type: "CP" | "JA"
            Translation: {
                Lang: Lang
                Project: string
                From: string
            }
        }
    ]
}


export class Translator {
    public readonly config: translatorConfig
    constructor(configFile: string) {
        this.config = parseJSON(configFile)
    }
    public buildProject() {
        this.config.Mods.forEach((mod) => {
            const projectFolder = join(
                this.config.src,
                mod.Translation.Project
            )
            const src = join(this.config.src, mod.Path)
            const from = join(this.config.src, mod.Translation.From)

            if (existsSync(projectFolder)) { rmdirSync(projectFolder) }
            if (mod.Type == "CP") {
                const dictOri: DictKV = {}

                const trav = new TravCP(join(this.config.src, mod.Path))
                trav.emptyDict()
                trav.traverse("content.json")
                Object.assign(dictOri, TRAV_RESULT_DICT)
                trav.emptyDict()

                trav.modFolder = from
                trav.lang = mod.Translation.Lang
                trav.traverse("content.json")

                trav.modFolder = src
                trav.lang = mod.Translation.Lang
                trav.traverse("content.json")

                mergeDict(dictOri, TRAV_RESULT_DICT).toTranslationProject(projectFolder)
            } else if (mod.Type = "JA") {
                const dictOri: DictKV = {}

                const trav = new TravJA(src)
                trav.emptyDict()
                trav.traverse()
                Object.assign(dictOri, TRAV_RESULT_DICT)
                trav.emptyDict()

                trav.modFolder = from
                trav.lang = mod.Translation.Lang
                trav.traverse()
                Starlog.debug(TRAV_RESULT_DICT)

                // 优先考虑本版本的汉化
                trav.modFolder = src
                trav.lang = mod.Translation.Lang
                trav.traverse()
                mergeDict(dictOri, TRAV_RESULT_DICT).toTranslationProject(projectFolder)
            }
        })
    }
    public translate() {
        this.config.Mods.forEach((mod) => {
            const projectFolder = join(
                this.config.src,
                mod.Translation.Project
            )
            const dict: DictKV = loadProject(projectFolder)
            const src = join(this.config.src, mod.Path)
            const dist = join(this.config.dist, basename(mod.Path))
            if (mod.Type == "CP") {
                cpConvertToi18n(src, dist)
                cpi18nTranslate(dist, dict, Lang.zh)
            } else if (mod.Type == "JA") {
                jaTranslate(src, dist, dict, Lang.zh)
            }
        })
    }
}