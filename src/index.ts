import { Translator } from "./libs/translator";

let translator

const transLi = [
    // "res/SVE/translator.json",
    // "res/RSV/translator.json"
    "res/MNF/translator.json"
]

transLi.forEach(s => {
    translator = new Translator(s)
    translator.buildProject()
    // translator.translate()
})