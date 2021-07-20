import { exec } from "child_process"
import { basename, join, dirname, extname, resolve } from "path"
import { readdirSync, statSync } from "fs";
import { extractModStr, loadTranslationProject, mergeDict } from "./utils/extrator"
import { LOG, starlog } from "./utils/log"
import { parseJSON } from "./utils/parser"
import { getContentPath, translate } from "./utils/translator"
import { buildTarget } from "./utils/builder";

interface TransManifest {
    Name: string
    Mods2BTrans: {
        Path: string,
        Type: "ContentPack" | "JsonAssets",
        TranslationProject: string,
        FromMod?: string
    }[],
    PackagePath: string,
    Target: string
}

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

function buildTranslationProject(path: string) {
    const manifest: TransManifest = parseJSON(path)
    for (let index = 0; index < manifest.Mods2BTrans.length; index++) {
        const mod = manifest.Mods2BTrans[index]
        if (mod.Type == "ContentPack") {
            starlog(LOG.DEBUG, mod)
            const dictOrigin = {}
            const dictAlter = {}
            const contentPath = getContentPath(mod.Path)
            if (contentPath) {
                // 解压原模组
                Object.assign(dictOrigin, extractModStr(contentPath))
                // 如果当前模组有翻译,解压Alter
                if (basename(contentPath) == "content-backup.json") {
                    const path = join(dirname(contentPath), "content.json")
                    Object.assign(dictAlter, extractModStr(path))
                }
                // 如果有FromMod，解压Alter
                // !这里有Hardcode
                if (mod.FromMod) {
                    const content = extractModStr(join(mod.FromMod, "content.json"), /[\u4e00-\u9fa5]/gm)
                    if (content) {
                        Object.assign(dictAlter, content)
                    }
                }

            }
            // 合并字典,制作翻译工程
            mergeDict(dictOrigin, dictAlter).toTranslationProject(mod.TranslationProject)
        }
        // TODO 扩展JA
    }
}

function translateMod(path: string, zip: boolean = false) {
    const manifest: TransManifest = parseJSON(path)
    for (let index = 0; index < manifest.Mods2BTrans.length; index++) {
        const mod = manifest.Mods2BTrans[index]
        // * CP
        if (mod.Type == "ContentPack") {
            // 工程文件加载为字典
            const dict = loadTranslationProject(mod.TranslationProject)
            // 翻译模组
            translate(mod.Path, dict)
        }
        // * JA
        else if (mod.Type == "JsonAssets") {
            // 解包字典
            const dict: { [index: string]: any } = {}
            travel(mod.TranslationProject, (m: any) => {
                const ext = extname(m)
                if (ext == ".json") {
                    starlog(LOG.DEBUG, m)
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
            travel(mod.Path, (m: any) => {
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
    }
    const targetFolder = dirname(manifest.Target)
    const target = basename(manifest.Target)
    const srcFolder = dirname(manifest.PackagePath)
    const srcName = basename(manifest.PackagePath)
    const cmd =
        "cd '" + srcFolder + "'"
        + " && zip -q -r -9 '" + target + "' '" + srcName + "' -x '*.DS_Store'"
        + " && mv '" + target + "' '" + targetFolder + "'"
    if (zip) {
        exec(cmd)
        starlog(LOG.INFO, "正在制作压缩包...")
    }
}

export { buildTranslationProject, translateMod }