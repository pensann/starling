import { parseJSON } from "./utils/parser";
import { CommonFields, EditData } from "./libs/cp_base";

const content = parseJSON("res/[CP] Stardew Valley Expanded/content.json")

const changes: CommonFields[] = content["Changes"]

let n = 0;

changes.forEach((change_common) => {
    switch (change_common.Action) {
        case "EditData":
            const change = change_common as EditData
            // TODO 在这里实现迭代器功能


            break;

        default:
            break;
    }
    n += 1
    if (n > 100) {
        return
    }
})
