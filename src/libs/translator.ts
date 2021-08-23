import { existsSync, rmdirSync } from "fs";
import { join } from "path";
import { TravFiles as TravCP } from "./content-patcher/trav-files";
import { TravFiles as TravJA } from "./json-assets/trav-files";
import { Starlog } from "./log";
import { parseJSON } from "./parser";
import { mergeDict } from "./stardict";
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
            if (existsSync(projectFolder)) { rmdirSync(projectFolder) }
            if (mod.Type == "CP") {
                const dictOri: DictKV = {}
                const dictAlter: DictKV = {}
                const dictAlter2: DictKV = {}
                let trav

                trav = new TravCP(join(this.config.src, mod.Path))
                trav.emptyDict()
                trav.traverse("content.json")
                Object.assign(dictOri, TRAV_RESULT_DICT)

                trav = new TravCP(join(this.config.src, mod.Translation.From))
                trav.emptyDict()
                trav.lang = mod.Translation.Lang
                trav.traverse("content.json")
                Object.assign(dictAlter, TRAV_RESULT_DICT)

                trav = new TravCP(join(this.config.src, mod.Path))
                trav.emptyDict()
                trav.lang = mod.Translation.Lang
                trav.traverse("content.json")
                Object.assign(dictAlter2, TRAV_RESULT_DICT)

                mergeDict(dictOri, dictAlter, dictAlter2).toTranslationProject(projectFolder)
            } else if (mod.Type = "JA") {
                const dictOri: DictKV = {}
                const dictAlter: DictKV = {}
                const dictAlter2: DictKV = {}
                let trav

                trav = new TravJA(join(this.config.src, mod.Path))
                trav.emptyDict()
                trav.traverse()
                Object.assign(dictOri, TRAV_RESULT_DICT)

                trav = new TravJA(join(this.config.src, mod.Translation.From))
                trav.emptyDict()
                trav.lang = mod.Translation.Lang
                trav.traverse()

                // 优先考虑本版本的汉化
                trav = new TravJA(join(this.config.src, mod.Path))
                trav.lang = mod.Translation.Lang
                trav.traverse()
                Object.assign(dictAlter2, TRAV_RESULT_DICT)
                mergeDict(dictOri, dictAlter, dictAlter2).toTranslationProject(projectFolder)
            }
        })
    }
}