import { Lang } from "../traversor"
import { TravFiles } from "./trav-files"

export function jaTranslate(jaPath: string, dist: string, dict: DictKV, lang: Lang) {
    const translator = (text: string) => {
        const textHandled = dict[text]
        return textHandled
    }
    const trav = new TravFiles(jaPath)
    trav.textHandler = translator
    trav.lang = lang
    trav.dist = dist
    trav.traverse()
}