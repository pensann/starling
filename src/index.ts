import { buildTranslationProject, translateMod } from "./tools"

const path = "res/translator.json"
// buildTranslationProject(path)
translateMod(path, { zip: true })