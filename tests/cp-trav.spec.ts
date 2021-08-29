import { TravStr } from "../src/libs/content-patcher/trav-str";
import { TravEntries } from "../src/libs/content-patcher/trav-entries";
import { TRAV_RESULT_DICT, TRAV_INIT } from "../src/libs/traversor";

describe("trav-str.ts testing", () => {
    it("won't extract duplicated value by default.", () => {
        const trav = new TravStr("aloha", "baseID1")
        const trav2 = new TravStr("aloha", "baseID2")
        TRAV_INIT()
        trav.plainText()
        trav2.plainText()
        expect(["aloha"]).toStrictEqual(Object.values(TRAV_RESULT_DICT))
    })
    it("traverse plain text, extract text only", () => {
        const trav = new TravStr("aloha", "baseID")
        TRAV_INIT()
        trav.getTextID = (s) => s
        trav.plainText()
        expect({ "baseID": "aloha" }).toStrictEqual(TRAV_RESULT_DICT)
    })
    it("traverse plain text, handle and extract text", () => {
        const trav = new TravStr("aloha", "baseID")
        TRAV_INIT()
        trav.getTextID = (s) => s
        trav.textHandler = (_) => "hiya!"
        expect("hiya!").toEqual(trav.plainText())
        expect({ "baseID": "aloha" }).toStrictEqual(TRAV_RESULT_DICT)
    })
    it("traverse events-like text, extract text only", () => {
        const trav = new TravStr("/speak someone \"aloha\"", "baseID")
        TRAV_INIT()
        trav.getTextID = (s) => s
        trav.eventsLike()
        expect({ "baseID.0": "aloha" }).toStrictEqual(TRAV_RESULT_DICT)
    })
    it("traverse events-like text, handle and extract text", () => {
        const trav = new TravStr("/speak someone \"aloha\"", "baseID")
        TRAV_INIT()
        trav.getTextID = (s) => s
        trav.textHandler = (_) => "hiya\""
        expect("/speak someone \"hiya'\"").toEqual(trav.eventsLike())
        expect({ "baseID.0": "aloha" }).toStrictEqual(TRAV_RESULT_DICT)
    })
    it("traverse npc gift tastes text, extract text only", () => {
        const trav = new TravStr(
            "aloha//aloha//aloha/2/aloha/3/aloha.4/4/",
            "baseID"
        )
        TRAV_INIT()
        trav.getTextID = (s) => s
        trav.npcGiftTastes()
        expect({
            "baseID.0": "aloha",
            "baseID.1": "aloha",
            "baseID.2": "aloha",
            "baseID.3": "aloha",
            "baseID.4": "aloha.4"
        }).toStrictEqual(TRAV_RESULT_DICT)
    })
    it("traverse npc gift tastes text, handle and extract text", () => {
        const trav = new TravStr(
            "aloha//aloha//aloha/2/aloha/3/aloha.4/4/",
            "baseID"
        )
        TRAV_INIT()
        trav.getTextID = (s) => s
        trav.textHandler = (_) => "hiya!"
        expect("hiya!//hiya!//hiya!/2/hiya!/3/hiya!/4/").toEqual(trav.npcGiftTastes())
        expect({
            "baseID.0": "aloha",
            "baseID.1": "aloha",
            "baseID.2": "aloha",
            "baseID.3": "aloha",
            "baseID.4": "aloha.4"
        }).toStrictEqual(TRAV_RESULT_DICT)
    })
    it("traverse npc dispositions text, extract text only", () => {
        const trav = new TravStr("/hi//////////Someone", "baseID")
        TRAV_INIT()
        trav.getTextID = (s) => s
        trav.npcDispositions()
        expect({ "baseID": "Someone" }).toStrictEqual(TRAV_RESULT_DICT)
    })
    it("traverse npc dispositions text, handle and extract text", () => {
        const trav = new TravStr("/hi//////////Someone", "baseID")
        TRAV_INIT()
        trav.getTextID = (s) => s
        trav.textHandler = (_) => "hiya!"
        expect("/hi//////////hiya!").toEqual(trav.npcDispositions())
        expect({ "baseID": "Someone" }).toStrictEqual(TRAV_RESULT_DICT)
    })
    it("traverse mail text, extract text only", () => {
        const trav = new TravStr("@,^some text.^ -Someone%item quest 120 %%[#]Someone's Request", "baseID")
        TRAV_INIT()
        trav.getTextID = (s) => s
        trav.mail()
        expect({
            "baseID.name": "Someone's Request",
            "baseID.text": "@,^some text.^ -Someone"
        }).toStrictEqual(TRAV_RESULT_DICT)
    })
    it("traverse mail text, handle and extract text", () => {
        const trav = new TravStr("@,^some text.^ -Someone%item quest 120 %%[#]Someone's Request", "baseID")
        TRAV_INIT()
        trav.getTextID = (s) => s
        trav.textHandler = (_) => "hiya!"
        expect("hiya!%item quest 120 %%[#]hiya!").toEqual(trav.mail())
        expect({
            "baseID.name": "Someone's Request",
            "baseID.text": "@,^some text.^ -Someone"
        }).toStrictEqual(TRAV_RESULT_DICT)
    })
    // "Location/Meet The Wizard/You received a letter from the local wizard. He claims to have information regarding the old community center./Enter the wizard's tower./WizardHouse/-1/0/-1/false"
    it("traverse quest text, extract text only", () => {
        const trav = new TravStr("/title/details/hint////reward description//reaction", "baseID")
        TRAV_INIT()
        trav.getTextID = (s) => s
        trav.textHandler = (_) => "hiya!"
        trav.quests()
        expect({
            "baseID.1": "title",
            "baseID.2": "details",
            "baseID.3": "hint",
            "baseID.7": "reward description",
            "baseID.9": "reaction"
        }).toStrictEqual(TRAV_RESULT_DICT)
    })
    it("traverse quest text, handle and extract text", () => {
        const trav = new TravStr("/title/details/hint////reward description/", "baseID")
        TRAV_INIT()
        trav.getTextID = (s) => s
        trav.textHandler = (_) => "hiya!"
        expect("/hiya!/hiya!/hiya!////hiya!/").toEqual(trav.quests())
        expect({
            "baseID.1": "title",
            "baseID.2": "details",
            "baseID.3": "hint",
            "baseID.7": "reward description",
        }).toStrictEqual(TRAV_RESULT_DICT)
    })
})

describe("trav-entries.ts testing", () => {
    it("loads i18n value before traverse", () => {
        const entries = { "key": "{{i18n:some-key}}" }
        const trav = new TravEntries("Characters/Dialogue/Someone", entries, "[baseID]")
        TRAV_INIT()
        trav.i18n = { "some-key": "value" }
        trav.getTextID = (s) => s
        trav.textHandler = (_) => "hiya!"
        expect({ 'key': 'hiya!' }).toStrictEqual(trav.traverse())
        expect({ '[baseID]key': 'value' }).toStrictEqual(TRAV_RESULT_DICT)
    });
    it("handles id when calling text handler", () => {
        const entries = { "key": "value" }
        const trav = new TravEntries("Characters/Dialogue/Someone", entries, "[baseID]")
        TRAV_INIT()
        trav.getTextID = (s) => s
        trav.textHandler = (_, id) => `{{i18n:${id}}}`
        expect({ 'key': '{{i18n:[baseID]key}}' }).toStrictEqual(trav.traverse())
        expect({ '[baseID]key': 'value' }).toStrictEqual(TRAV_RESULT_DICT)
    });
    it("traverse plain text entries, handle and extract text", () => {
        const entries = { "key": "value" }
        const trav = new TravEntries("Characters/Dialogue/Someone", entries, "[baseID]")
        TRAV_INIT()
        trav.getTextID = (s) => s
        trav.textHandler = (_) => "hiya!"
        expect({ 'key': 'hiya!' }).toStrictEqual(trav.traverse())
        expect({ '[baseID]key': 'value' }).toStrictEqual(TRAV_RESULT_DICT)
    });
    it("traverse events entries, handle and extract text", () => {
        const entries = { "key": 'any string/speak someone "hi"/end dialogue someone "bye"' }
        const trav = new TravEntries("Data/Events/Someone", entries, "[baseID]")
        TRAV_INIT()
        trav.getTextID = (s) => s
        trav.textHandler = (_) => "hiya!"
        expect({ "key": 'any string/speak someone "hiya!"/end dialogue someone "hiya!"' }).toStrictEqual(trav.traverse())
        expect({ "[baseID]key.0": "hi", "[baseID]key.1": "bye" }).toStrictEqual(TRAV_RESULT_DICT)
    });
    it("traverse festival entries, handle and extract text", () => {
        const entries = {
            "set-up": "any string will be ignored...",
            "key1": "this is a dialogue.",
            "key2": 'any string/speak someone "hi"/end dialogue someone "bye"',
            "key3": null
        }
        const trav = new TravEntries("Data/Festivals/Any", entries, "[baseID]")
        TRAV_INIT()
        trav.getTextID = (s) => s
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
        }).toStrictEqual(TRAV_RESULT_DICT)
    });
    it("traverse movies reactions entries on script and text, handle and extract text", () => {
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
        TRAV_INIT()
        trav.getTextID = (s) => s
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
        }).toStrictEqual(TRAV_RESULT_DICT)
    });
    it("traverse npc dispositions entries, handle and extract text", () => {
        const entries = { "Someone": "//////null/////Someone" }
        const trav = new TravEntries("Data/NPCDispositions", entries, "[baseID]")
        TRAV_INIT()
        trav.getTextID = (s) => s
        trav.textHandler = (_) => "hiya!"
        expect({ "Someone": "//////null/////hiya!" }).toStrictEqual(trav.traverse())
        expect({ "[baseID]Someone": "Someone" }).toStrictEqual(TRAV_RESULT_DICT)
    });
    it("traverse npc gift tastes entries, handle and extract text", () => {
        const entries = { "Someone": "aloha0//aloha1//aloha2//aloha3//aloha4/4/" }
        const trav = new TravEntries("Data/NPCGiftTastes", entries, "[baseID]")
        TRAV_INIT()
        trav.getTextID = (s) => s
        trav.textHandler = (_) => "hiya!"
        expect({ "Someone": "hiya!//hiya!//hiya!//hiya!//hiya!/4/" }).toStrictEqual(trav.traverse())
        expect({
            "[baseID]Someone.0": "aloha0",
            "[baseID]Someone.1": "aloha1",
            "[baseID]Someone.2": "aloha2",
            "[baseID]Someone.3": "aloha3",
            "[baseID]Someone.4": "aloha4",
        }).toStrictEqual(TRAV_RESULT_DICT)
    });
});