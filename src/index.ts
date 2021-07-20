// * mergeDict验证通过
// import { mergeDict } from "./utils/extrator";
// import { parseJSON } from "./utils/parser";
// import { buildTarget } from "./utils/builder";

import { buildTranslationProject, translateMod } from "./tools"

// const eng_file = "res/dict_eng.json"
// const chs_file = "res/dict_chs.json"
// const dict_eng = parseJSON(eng_file)
// const dict_chs = parseJSON(chs_file)
// const da = mergeDict(dict_eng, dict_chs)
// buildTarget("res/dict.json", JSON.stringify(da.toDictKV(), undefined, 4))
// da.toTranslationProject("res/temp")


// * translate验证通过
// import { translate } from "./utils/translator";
// const mod = "res/[CP] Stardew Valley Expanded"
// translate(mod, parseJSON("res/dict.json"))


// * toTranslationProject测试通过
// import { mergeDict } from "./utils/extrator";
// import { parseJSON } from "./utils/parser";
// const eng_file = "res/dict_eng.json"
// const chs_file = "res/dict_chs.json"
// const dict_eng = parseJSON(eng_file)
// const dict_chs = parseJSON(chs_file)
// const da = mergeDict(dict_eng, dict_chs)
// da.toTranslationProject("res/temp")

// * 验证loadTranslationProject通过，可加载为Dict
// import { buildTarget } from "./utils/builder";
// import { loadTranslationProject } from "./utils/extrator";

// buildTarget("res/dict_translated.json", JSON.stringify(loadTranslationProject("res/temp"), undefined, 2))


const path = "res/translator.json"
// buildTranslationProject(path)
translateMod(path)