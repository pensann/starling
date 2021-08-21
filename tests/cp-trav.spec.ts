import { TRAVERSE_DICT } from "../src/libs/traversor";
import { TravStr } from "../src/libs/content-patcher/trav-str";
import { TravEntries } from "../src/libs/content-patcher/trav-entries";

describe("trav-str.ts testing", () => {
    // it("throw error when different values using a same id", () => {
    //     for (const key in TRAVERSE_DICT) {
    //         delete TRAVERSE_DICT[key]
    //     }
    //     const trav = new TravStr("aloha", "baseID")
    //     const trav2 = new TravStr("aloha2", "baseID")
    //     trav.plainText()
    //     expect(() => { trav2.plainText() }).toThrowError("Multiple values(aloha,aloha2) using a same id(baseID)!")
    // })
    it("won't extract duplicated value by default.", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const trav = new TravStr("aloha", "baseID1")
        const trav2 = new TravStr("aloha", "baseID2")
        trav.plainText()
        trav2.plainText()
        expect(["aloha"]).toStrictEqual(Object.values(TRAVERSE_DICT))
    })
    it("traverse plain text, extract text only", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const trav = new TravStr("aloha", "baseID")
        trav.getID = (s) => s
        trav.plainText()
        expect({ "baseID": "aloha" }).toStrictEqual(TRAVERSE_DICT)
    })
    it("traverse plain text, handle and extract text", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const trav = new TravStr("aloha", "baseID")
        trav.getID = (s) => s
        trav.textHandler = (_) => "hiya!"
        expect("hiya!").toEqual(trav.plainText())
        expect({ "baseID": "aloha" }).toStrictEqual(TRAVERSE_DICT)
    })
    it("traverse events-like text, extract text only", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const trav = new TravStr("/speak someone \"aloha\"", "baseID")
        trav.getID = (s) => s
        trav.eventsLike()
        expect({ "baseID.0": "aloha" }).toStrictEqual(TRAVERSE_DICT)
    })
    it("traverse events-like text, handle and extract text", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const trav = new TravStr("/speak someone \"aloha\"", "baseID")
        trav.getID = (s) => s
        trav.textHandler = (_) => "hiya!"
        expect("/speak someone \"hiya!\"").toEqual(trav.eventsLike())
        expect({ "baseID.0": "aloha" }).toStrictEqual(TRAVERSE_DICT)
    })
    it("traverse npc gift tastes text, extract text only", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const trav = new TravStr(
            "aloha//aloha//aloha/2/aloha/3/aloha.4/4/",
            "baseID"
        )
        trav.getID = (s) => s
        trav.npcGiftTastes()
        expect({
            "baseID.0": "aloha",
            "baseID.1": "aloha",
            "baseID.2": "aloha",
            "baseID.3": "aloha",
            "baseID.4": "aloha.4"
        }).toStrictEqual(TRAVERSE_DICT)
    })
    it("traverse npc gift tastes text, handle and extract text", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const trav = new TravStr(
            "aloha//aloha//aloha/2/aloha/3/aloha.4/4/",
            "baseID"
        )
        trav.getID = (s) => s
        trav.textHandler = (_) => "hiya!"
        expect("hiya!//hiya!//hiya!/2/hiya!/3/hiya!/4/").toEqual(trav.npcGiftTastes())
        expect({
            "baseID.0": "aloha",
            "baseID.1": "aloha",
            "baseID.2": "aloha",
            "baseID.3": "aloha",
            "baseID.4": "aloha.4"
        }).toStrictEqual(TRAVERSE_DICT)
    })
    it("traverse npc dispositions text, extract text only", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const trav = new TravStr("/hi//////////Someone", "baseID")
        trav.getID = (s) => s
        trav.npcDispositions()
        expect({ "baseID": "Someone" }).toStrictEqual(TRAVERSE_DICT)
    })
    it("traverse npc dispositions text, handle and extract text", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const trav = new TravStr("/hi//////////Someone", "baseID")
        trav.getID = (s) => s
        trav.textHandler = (_) => "hiya!"
        expect("/hi//////////hiya!").toEqual(trav.npcDispositions())
        expect({ "baseID": "Someone" }).toStrictEqual(TRAVERSE_DICT)
    })
})

describe("trav-entries.ts testing", () => {
    it("loads i18n value before traverse", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const entries = { "key": "{{i18n:some-key}}" }
        const trav = new TravEntries("Characters/Dialogue/Someone", entries, "[baseID]")
        trav.i18n = { "some-key": "value" }
        trav.getID = (s) => s
        trav.textHandler = (_) => "hiya!"
        expect({ 'key': 'hiya!' }).toStrictEqual(trav.traverse())
        expect({ '[baseID]key': 'value' }).toStrictEqual(TRAVERSE_DICT)
    });
    it("handles id when calling text handler", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const entries = { "key": "value" }
        const trav = new TravEntries("Characters/Dialogue/Someone", entries, "[baseID]")
        trav.getID = (s) => s
        trav.textHandler = (_, id) => `{{i18n:${id}}}`
        expect({ 'key': '{{i18n:[baseID]key}}' }).toStrictEqual(trav.traverse())
        expect({ '[baseID]key': 'value' }).toStrictEqual(TRAVERSE_DICT)
    });
    it("traverse plain text entries, handle and extract text", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const entries = { "key": "value" }
        const trav = new TravEntries("Characters/Dialogue/Someone", entries, "[baseID]")
        trav.getID = (s) => s
        trav.textHandler = (_) => "hiya!"
        expect({ 'key': 'hiya!' }).toStrictEqual(trav.traverse())
        expect({ '[baseID]key': 'value' }).toStrictEqual(TRAVERSE_DICT)
    });
    it("traverse events entries, handle and extract text", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const entries = { "key": 'any string/speak someone "hi"/end dialogue someone "bye"' }
        const trav = new TravEntries("Data/Events/Someone", entries, "[baseID]")
        trav.getID = (s) => s
        trav.textHandler = (_) => "hiya!"
        expect({ "key": 'any string/speak someone "hiya!"/end dialogue someone "hiya!"' }).toStrictEqual(trav.traverse())
        expect({ "[baseID]key.0": "hi", "[baseID]key.1": "bye" }).toStrictEqual(TRAVERSE_DICT)
    });
    it("traverse festival entries, handle and extract text", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const entries = {
            "set-up": "any string will be ignored...",
            "key1": "this is a dialogue.",
            "key2": 'any string/speak someone "hi"/end dialogue someone "bye"',
            "key3": null
        }
        const trav = new TravEntries("Data/Festivals/Any", entries, "[baseID]")
        trav.getID = (s) => s
        trav.textHandler = (_) => "hiya!"
        expect({
            "set-up": "any string will be ignored...",
            "key1": "hiya!",
            "key2": 'any string/speak someone "hiya!"/end dialogue someone "hiya!"',
            "key3": null
        }).toStrictEqual(trav.traverse())
        expect({
            "[baseID]key1": "this is a dialogue.",
            "[baseID]key2.0": "hi",
            "[baseID]key2.1": "bye",
        }).toStrictEqual(TRAVERSE_DICT)
    });
    it("traverse movies reactions entries on script and text, handle and extract text", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const entries: Entries = {
            "Someone": {
                "NPCName": "Someone",
                "Reactions": [
                    {
                        "Tag": "any-tag",
                        "Response": "love",
                        "Whitelist": [],
                        "SpecialResponses": {
                            "BeforeMovie": {
                                "ResponsePoint": null,
                                "Script": "/message \"hi\"",
                                "Text": "any text"
                            },
                        },
                        "ID": "reaction_0"
                    }
                ]
            }
        }
        const trav = new TravEntries("Data/MoviesReactions", entries, "[baseID]")
        trav.getID = (s) => s
        trav.textHandler = (_) => "hiya!"
        expect({
            "Someone": {
                "NPCName": "Someone",
                "Reactions": [
                    {
                        "Tag": "any-tag",
                        "Response": "love",
                        "Whitelist": [],
                        "SpecialResponses": {
                            "BeforeMovie": {
                                "ResponsePoint": null,
                                "Script": "/message \"hiya!\"",
                                "Text": "hiya!"
                            },
                        },
                        "ID": "reaction_0"
                    }
                ]
            }
        }).toStrictEqual(trav.traverse())
        expect({
            "[baseID]SomeoneBeforeMovie.Script.0.0": "hi",
            "[baseID]SomeoneBeforeMovie.Text.0": "any text"
        }).toStrictEqual(TRAVERSE_DICT)
    });
    it("traverse npc dispositions entries, handle and extract text", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const entries = { "Someone": "//////null/////Someone" }
        const trav = new TravEntries("Data/NPCDispositions", entries, "[baseID]")
        trav.getID = (s) => s
        trav.textHandler = (_) => "hiya!"
        expect({ "Someone": "//////null/////hiya!" }).toStrictEqual(trav.traverse())
        expect({ "[baseID]Someone": "Someone" }).toStrictEqual(TRAVERSE_DICT)
    });
    it("traverse npc gift tastes entries, handle and extract text", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const entries = { "Someone": "aloha0//aloha1//aloha2//aloha3//aloha4/4/" }
        const trav = new TravEntries("Data/NPCGiftTastes", entries, "[baseID]")
        trav.getID = (s) => s
        trav.textHandler = (_) => "hiya!"
        expect({ "Someone": "hiya!//hiya!//hiya!//hiya!//hiya!/4/" }).toStrictEqual(trav.traverse())
        expect({
            "[baseID]Someone.0": "aloha0",
            "[baseID]Someone.1": "aloha1",
            "[baseID]Someone.2": "aloha2",
            "[baseID]Someone.3": "aloha3",
            "[baseID]Someone.4": "aloha4",
        }).toStrictEqual(TRAVERSE_DICT)
    });
});