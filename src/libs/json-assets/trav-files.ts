import { basename, extname, join, relative, resolve } from "path"
import { buildTarget } from "../builder"
import { Starlog } from "../log"
import { parseJSON } from "../parser"
import { Lang, travel, Traversor, TRAV_RESULT_DICT } from "../traversor"

const keywords = {
    "Name": "NameLocalization",
    "Description": "DescriptionLocalization",
    "SeedName": "SeedNameLocalization",
    "SeedDescription": "SeedDescriptionLocalization",
    "SaplingName": "SaplingNameLocalization",
    "SaplingDescription": "SaplingDescriptionLocalization",
}

export class TravFiles extends Traversor {
    constructor(modfolder: string) {
        super()
        this.src = modfolder
    }
    /** extract text only */
    public traverse(): void {
        travel(this.src, (file, from) => {
            if (
                extname(file) == ".json"
                && basename(file) != "manifest.json"
            ) {
                const targetFile = join(this.dist, relative(from, file))
                const content: JsonAssets = parseJSON(file)
                for (const [key, text] of Object.entries(content)) {
                    for (const [keyStr, LocKeyStr] of Object.entries(keywords)) {
                        if (key == keyStr && typeof (text) == "string") {
                            /**
                             * key: 需要提取的文本key
                             * text: 需要提取的文本text
                             * LocKeyStr: 本地化字典的key
                             */
                            let locale
                            const textLoc: string | undefined = (() => {
                                if (this.lang == Lang.zh && (locale = content[LocKeyStr] as DictKV)) {
                                    return locale[this.lang]
                                }
                            })()
                            // 提取文本
                            if (this.lang == Lang.default) {
                                TRAV_RESULT_DICT[text] = text
                            } else if (textLoc && this.re.test(textLoc)) {
                                TRAV_RESULT_DICT[text] = textLoc
                                // 使用textHandler处理文本
                            }
                            if (this.textHandler) {
                                const textHandled = this.textHandler(text)
                                const locale: DictKV = {}
                                if (content[LocKeyStr]) {
                                    // 如果已包含本地化，则读取当前本地化
                                    Object.assign(locale, content[LocKeyStr])
                                }
                                if (textHandled) {
                                    // 处理后文本添加进Locale，并写入文件
                                    locale[this.lang] = textHandled
                                    content[LocKeyStr] = locale
                                }
                            }
                        }
                    }
                }
                if (this.textHandler) {
                    buildTarget(targetFile, JSON.stringify(content, undefined, 2))
                }
            }
        })
    }
}