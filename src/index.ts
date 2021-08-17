const content = "tests/case/content.json"
import { parseJSON } from "./libs/parser"
import { Traversor4Files } from "./libs/trav_changes"


const o = parseJSON(content)
o.Changes.forEach((change: EditData) => {
    if (change.Entries) {
        const t = new Traversor4Files("res/RSV/Ridgeside Village/[CP] Ridgeside Village")
        t.load("content.json")
        console.log(t.extractText())
    }
})
