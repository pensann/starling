import { Target, TarFmt } from "./target";
import { Traversor } from "../traversor";
import { TravStr } from "./trav-str";
export class TravEntries extends Traversor {
    public entries: Entries
    public target: Target
    public i18n: DictKV | undefined
    constructor(target: string, entries: Entries, baseID: string) {
        super(baseID)
        this.target = new Target(target)
        this.entries = entries
    }
    private load(value: string): string {
        const i18n = this.i18n
        if (i18n) {
            return value.replace(/{{i18n:.*?}}/g, (s) => {
                const result = i18n[s.slice(7, -2)]
                return result ? result : s
            })
        }
        return value
    }
    private textTrav(str: string, baseID: string): TravStr {
        const trav = new TravStr(str, baseID)
        trav.textHandler = this.textHandler
        trav.textHArgs = this.textHArgs
        trav.lang = this.lang
        trav.getTextID = this.getTextID
        return trav
    }
    public traverse(): Entries {
        const result: Entries = {}
        Object.assign(result, this.entries)
        for (const [key, value] of Object.entries(result as DictKV)) {
            if (value) {
                if (this.target.type == TarFmt.PlainText) {
                    result[key] = this
                        .textTrav(this.load(value), this.baseID + key)
                        .plainText()
                } else if (this.target.type == TarFmt.EventsLike) {
                    result[key] = this
                        .textTrav(this.load(value), this.baseID + key)
                        .eventsLike()
                } else if (this.target.type == TarFmt.Festivals) {
                    if (key == "set-up") {
                        // DO NOTHING
                    }
                    else if (/"\s*\//.test(value)) {
                        result[key] = this
                            .textTrav(this.load(value), this.baseID + key)
                            .eventsLike()
                    } else {
                        result[key] = this
                            .textTrav(this.load(value), this.baseID + key)
                            .plainText()
                    }
                } else if (this.target.type == TarFmt.MoviesReactions) {
                    let index = 0
                    const valueObject = result[key] as MoviesReactionValue
                    valueObject.Reactions.forEach((reaction) => {
                        if (reaction["SpecialResponses"]) {
                            for (const [keySPR, valueSPR] of Object.entries(reaction.SpecialResponses)) {
                                if (valueSPR && valueSPR.Script) {
                                    // 处理字符串
                                    valueSPR.Script = this.load(valueSPR.Script)
                                    valueObject["Reactions"][index]["SpecialResponses"]![keySPR]["Script"] = this
                                        .textTrav(valueSPR.Script, this.baseID + key + keySPR + ".Script." + index)
                                        .eventsLike()
                                }
                                if (valueSPR && valueSPR.Text) {
                                    // 处理字符串
                                    valueSPR.Text = this.load(valueSPR.Text)
                                    valueObject.Reactions[index]["SpecialResponses"]![keySPR]["Text"] = this
                                        .textTrav(valueSPR.Text, this.baseID + key + keySPR + ".Text." + index)
                                        .plainText()
                                }
                                result[key] = valueObject
                            }
                        }
                        index++
                    })
                } else if (this.target.type == TarFmt.NPCDispositions) {
                    result[key] = this
                        .textTrav(this.load(value), this.baseID + key)
                        .npcDispositions()
                } else if (this.target.type == TarFmt.NPCGiftTastes) {
                    result[key] = this
                        .textTrav(this.load(value), this.baseID + key)
                        .npcGiftTastes()
                } else if (this.target.type == TarFmt.Mail) {
                    result[key] = this
                        .textTrav(this.load(value), this.baseID + key)
                        .mail()
                }
            }
        }
        return result
    }
}
