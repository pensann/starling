import { Lang } from "../traversor"
import { TravFiles } from "./trav-files"

export function mfmTranslate(jaPath: string, dist: string, dict: DictKV, lang: Lang) {
    const translator = (text: string) => {
        const textHandled = dict[text]
        return textHandled ? textHandled : text
    }
    const trav = new TravFiles(jaPath)
    trav.textHandler = translator
    trav.lang = lang
    trav.dist = dist
    trav.traverse()
}