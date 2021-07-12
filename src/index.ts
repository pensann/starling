import { extractModStr } from "./utils/extrator";
const mod = "res/-Stardew Valley Expanded--3753-1-13-8-1625195234/Stardew Valley Expanded/[CP] Stardew Valley Expanded/content.json"
// const mod = "res/-Stardew Valley Expanded--3753-1-13-8-1625195234/Stardew Valley Expanded/[CP] Stardew Valley Expanded/content_test.json"

extractModStr(mod, "res/dict_eng.json")
// extractModStr(mod, "res/dict_chs.json", /[\u4e00-\u9fa5]/gm)

