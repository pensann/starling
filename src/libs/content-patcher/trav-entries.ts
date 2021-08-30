import { Target, TarFmt } from "./target";
import { Traversor } from "../traversor";
import { TravStr } from "./trav-str";
import { Starlog } from "../log";
export class TravEntries extends Traversor {
    public entries: Entries
    public target: Target
    public i18n: DictKV = {}
    constructor(target: string, entries: Entries, baseID: string) {
        super(baseID)
        this.target = new Target(target)
        this.entries = entries
    }
    private strTrav(str: string, baseID: string): TravStr {
        const trav = new TravStr(
            str.replace(/{{i18n:.*?}}/g, (s) => {
                const result = this.i18n[s.slice(7, -2)]
                return result ? result : s
            })
            , baseID)
        trav.textHandler = this.textHandler
        trav.textHArgs = this.textHArgs
        trav.lang = this.lang
        trav.getTextID = this.getTextID
        return trav
    }
    public traverse(): Entries {
        for (const [key, value] of Object.entries(this.entries)) {
            if (value) {
                if (this.target.type == TarFmt.PlainText) {
                    this.entries[key] = this
                        .strTrav(value as string, this.baseID + key)
                        .plainText()
                } else if (this.target.type == TarFmt.EventsLike) {
                    this.entries[key] = this
                        .strTrav(value as string, this.baseID + key)
                        .eventsLike()
                } else if (this.target.type == TarFmt.Festivals) {
                    if (key == "set-up") {
                        // DO NOTHING
                    }
                    else if (/"\s*\//.test(value as string)) {
                        this.entries[key] = this
                            .strTrav(value as string, this.baseID + key)
                            .eventsLike()
                    } else {
                        this.entries[key] = this
                            .strTrav(value as string, this.baseID + key)
                            .plainText()
                    }
                } else if (this.target.type == TarFmt.MoviesReactions) {
                    let index = 0
                    const valueObject = value as MoviesReactionValue
                    valueObject.Reactions.forEach((reaction) => {
                        if (reaction["SpecialResponses"]) {
                            for (const [keySPR, valueSPR] of Object.entries(reaction.SpecialResponses)) {
                                if (valueSPR && valueSPR.Script) {
                                    // 处理字符串
                                    valueObject["Reactions"][index]["SpecialResponses"]![keySPR]["Script"] = this
                                        .strTrav(valueSPR.Script, this.baseID + key + keySPR + ".Script." + index)
                                        .eventsLike()
                                }
                                if (valueSPR && valueSPR.Text) {
                                    // 处理字符串
                                    valueObject.Reactions[index]["SpecialResponses"]![keySPR]["Text"] = this
                                        .strTrav(valueSPR.Text, this.baseID + key + keySPR + ".Text." + index)
                                        .plainText()
                                }
                                this.entries[key] = valueObject
                            }
                        }
                        index++
                    })
                } else if (this.target.type == TarFmt.NPCDispositions) {
                    this.entries[key] = this
                        .strTrav(value as string, this.baseID + key)
                        .npcDispositions()
                } else if (this.target.type == TarFmt.NPCGiftTastes) {
                    this.entries[key] = this
                        .strTrav(value as string, this.baseID + key)
                        .npcGiftTastes()
                } else if (this.target.type == TarFmt.Mail) {
                    this.entries[key] = this
                        .strTrav(value as string, this.baseID + key)
                        .mail()
                } else if (this.target.type == TarFmt.Quests) {
                    this.entries[key] = this
                        .strTrav(value as string, this.baseID + key)
                        .quests()
                }
            }
        }
        return this.entries
    }

//     public fixEvents(): Entries {
//         if (this.target.type == TarFmt.EventsLike) {
//             for (const [key, value] of Object.entries(this.entries as DictKV)) {
//                 // fix for RSV!
//                 if(value){
//                     this.entries[key] = value.replace(/"\s*#/g, _ => {
//                         Starlog.debug(`fixed : ${key}`)
//                         return "#"
//                     })
//                 }
//             }
//         }
//         return this.entries
//     }
}
