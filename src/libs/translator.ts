import { exec } from "child_process";
import { existsSync, rmdirSync } from "fs";
import { basename, join, resolve } from "path";
import { cpConvertToi18n, cpi18nTranslate } from "./content-patcher/tools";
import { jaTranslate } from "./json-assets/tools";
import { Starlog } from "./log";
import { parseJSON } from "./parser";
import { loadProject, mergeDict } from "./stardict";

import { Lang, TRAV_RESULT_DICT, TRAV_INIT } from "./traversor";
import { TravFiles as TravCP } from "./content-patcher/trav-files";
import { TravFiles as TravJA } from "./json-assets/trav-files";
import { TravFiles as TravMFM } from "./mail-framework/trav-files";
import { mfmTranslate } from "./mail-framework/tools";

function getCurrentTime() {
    var date = new Date();//当前时间
    var month = zeroFill(date.getMonth() + 1);//月
    var day = zeroFill(date.getDate());//日
    var hour = zeroFill(date.getHours());//时
    var minute = zeroFill(date.getMinutes());//分
    var second = zeroFill(date.getSeconds());//秒

    //当前时间
    var curTime = date.getFullYear() + "-" + month + "-" + day
        + "-" + hour + "-" + minute + "-" + second;

    return curTime;
}

/**
 * 补零
 */
function zeroFill(i: number) {
    if (i >= 0 && i <= 9) {
        return "0" + i;
    } else {
        return i;
    }
}

interface translatorConfig {
    Name: string
    src: string
    dist: string,
    Mods: [
        {
            Path: string,
            Type: "CP" | "JA" | "MFM"
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
            this.checkEmpty(projectFolder)
        })
        this.config.Mods.forEach((mod) => {
            const projectFolder = join(
                this.config.src,
                mod.Translation.Project
            )
            const src = join(this.config.src, mod.Path)
            const from = join(this.config.src, mod.Translation.From)
            if (mod.Type == "CP") {
                const dictOri: DictKV = {}

                const trav = new TravCP(join(this.config.src, mod.Path))
                TRAV_INIT()

                // 使用traverseFile遍历检查原模组是否存在错误
                trav.traverseFile("content.json")
                TRAV_INIT()


                trav.tranverse()
                Object.assign(dictOri, TRAV_RESULT_DICT)
                TRAV_INIT()

                trav.src = from
                trav.lang = mod.Translation.Lang
                trav.tranverse()

                trav.src = src
                trav.lang = mod.Translation.Lang
                trav.tranverse()

                mergeDict(dictOri, TRAV_RESULT_DICT).toTranslationProject(projectFolder)
            } else if (mod.Type == "JA") {
                const dictOri: DictKV = {}

                const trav = new TravJA(src)
                TRAV_INIT()
                trav.traverse()
                Object.assign(dictOri, TRAV_RESULT_DICT)
                TRAV_INIT()

                trav.src = from
                trav.lang = mod.Translation.Lang
                trav.traverse()

                // 优先考虑本版本的汉化
                trav.src = src
                trav.lang = mod.Translation.Lang
                trav.traverse()
                mergeDict(dictOri, TRAV_RESULT_DICT).toTranslationProject(projectFolder)
            } else if (mod.Type == "MFM") {
                const dictOri: DictKV = {}

                const trav = new TravMFM(src)
                TRAV_INIT()
                trav.traverse()
                Object.assign(dictOri, TRAV_RESULT_DICT)
                TRAV_INIT()

                trav.src = from
                trav.lang = mod.Translation.Lang
                trav.traverse()

                // 优先考虑本版本的汉化
                trav.src = src
                trav.lang = mod.Translation.Lang
                trav.traverse()
                mergeDict(dictOri, TRAV_RESULT_DICT).toTranslationProject(projectFolder)
            }
        })
    }
    public translate(zip = false) {
        this.checkEmpty(this.config.dist)
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
            } else if (mod.Type == "MFM") {
                mfmTranslate(src, dist, dict, Lang.zh)
            }
        })
        const cmd =
            `cd '${resolve(this.config.dist)}'`
            + " && zip -q -r -9"
            + ` '${this.config.Name + "-" + getCurrentTime()}.zip' *`
            + " -x '*.DS_Store'"
            + " && open ."
        if (zip) {
            exec(cmd)
            Starlog.info("正在制作压缩包...")
        }
    }
    private checkEmpty(dir: string) {
        try {
            if (existsSync(dir)) { rmdirSync(dir) }
        } catch (error) {
            Starlog.warnning(`${dir} not empty`)
            // throw new Error(`${dir} not empty`);
        }
    }
}