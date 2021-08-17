const content = "tests/case/content.json"
import { parseJSON } from "./libs/parser"
import { Traversor4Entries } from "./libs/trav_entries"


const o = parseJSON(content)
o.Changes.forEach((change: EditData) => {
    if (change.Entries){
        const t = new Traversor4Entries(change.Target, change.Entries,"[baseID]")
        console.log(t.traverse((s:string)=>"[hiya!]"))
    }
})
