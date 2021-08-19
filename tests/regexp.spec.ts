import { parseJSON } from "../src/libs/parser";
import { Trav4Str, TRAVERSE_DICT } from "../src/libs/trav-str";

describe("traverse testing", () => {
    it("will check values do not share a same id", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const trav = new Trav4Str("aloha", "baseID")
        const trav2 = new Trav4Str("aloha2", "baseID")
        trav.travPlainText()
        expect(()=>{trav2.travPlainText()}).toThrowError("Multiple values(aloha,aloha2) use a same id(baseID)!")
    })
    it("will not extract duplicated value by default.", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const trav = new Trav4Str("aloha", "baseID1")
        const trav2 = new Trav4Str("aloha", "baseID2")
        trav.travPlainText()
        trav2.travPlainText()
        expect(["aloha"]).toStrictEqual(Object.values(TRAVERSE_DICT))
    })
    it("traverse plain text, extract text only", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const trav = new Trav4Str("aloha", "baseID")
        trav.getID = (s) => s
        trav.travPlainText()
        expect({ "baseID": "aloha" }).toStrictEqual(TRAVERSE_DICT)
    })
    it("traverse plain text, handle and extract text", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const trav = new Trav4Str("aloha", "baseID")
        trav.getID = (s) => s
        trav.textHandler = (_: string) => {
            return "hiya!"
        }
        expect("hiya!").toEqual(trav.travPlainText())
        expect({ "baseID": "aloha" }).toStrictEqual(TRAVERSE_DICT)
    })
    it("traverse events-like text, extract text only", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const trav = new Trav4Str("/speak someone \"aloha\"", "baseID")
        trav.getID = (s) => s
        trav.travEventsLike()
        expect({ "baseID.0": "aloha" }).toStrictEqual(TRAVERSE_DICT)
    })
    it("traverse events-like text, handle and extract text", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const trav = new Trav4Str("/speak someone \"aloha\"", "baseID")
        trav.getID = (s) => s
        trav.textHandler = (_: string) => {
            return "hiya!"
        }
        expect("/speak someone \"hiya!\"").toEqual(trav.travEventsLike())
        expect({ "baseID.0": "aloha" }).toStrictEqual(TRAVERSE_DICT)
    })
    it("traverse npc gift tastes text, extract text only", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const trav = new Trav4Str(
            "aloha//aloha//aloha/2/aloha/3/aloha.4/4/",
            "baseID"
        )
        trav.getID = (s) => s
        trav.travNpcGiftTastes()
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
        const trav = new Trav4Str(
            "aloha//aloha//aloha/2/aloha/3/aloha.4/4/",
            "baseID"
        )
        trav.getID = (s) => s
        trav.textHandler = (_: string) => {
            return "hiya!"
        }
        expect("hiya!//hiya!//hiya!/2/hiya!/3/hiya!/4/").toEqual(trav.travNpcGiftTastes())
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
        const trav = new Trav4Str("/hi//////////Victor", "baseID")
        trav.getID = (s) => s
        trav.travNpcDispositions()
        expect({ "baseID": "Victor" }).toStrictEqual(TRAVERSE_DICT)
    })
    it("traverse npc dispositions text, handle and extract text", () => {
        for (const key in TRAVERSE_DICT) {
            delete TRAVERSE_DICT[key]
        }
        const trav = new Trav4Str("/hi//////////Victor", "baseID")
        trav.getID = (s) => s
        trav.textHandler = (_: string) => {
            return "hiya!"
        }
        expect("/hi//////////hiya!").toEqual(trav.travNpcDispositions())
        expect({ "baseID": "Victor" }).toStrictEqual(TRAVERSE_DICT)
    })
})

// describe("traverse testing", () => {
//     it("traverse plain text", () => {
//         const entries = { "key": "value" }
//         const r = new Traversor4Entries("Characters/Dialogue/Andy", entries, "[baseID]")
//             .traverse((s: string) => "hiya!")
//         expect({ '[baseID]key': 'value' }).toStrictEqual(r.dict)
//         expect({ 'key': 'hiya!' }).toStrictEqual(r.alter)
//     });
//     it("traverse text in events", () => {
//         const entries = { "key": 'hiya/speak Jodi "hi"/end dialogue jodi "bye"' }
//         const r = new Traversor4Entries("Data/Events/SamHouse", entries, "[baseID]")
//             .traverse((s: string) => "hiya!")
//         expect({ '[baseID]key.1': 'hi', '[baseID]key.2': 'bye' }).toStrictEqual(r.dict)
//         expect({ 'key': 'hiya/speak Jodi "hiya!"/end dialogue jodi "hiya!"' }).toStrictEqual(r.alter)
//     });
//     it("traverse text in festivals", () => {
//         const entries = {
//             "set-up": "any string will be ignored...",
//             "key1": "this is a dialogue.",
//             "key2": 'hiya/speak Jodi "hi"/end dialogue jodi "bye"',
//             "key3": null
//         }
//         const r = new Traversor4Entries("Data/Festivals/Any", entries, "[baseID]")
//             .traverse((s: string) => "hiya!")
//         expect({
//             '[baseID]key1': 'this is a dialogue.',
//             '[baseID]key2.1': 'hi',
//             '[baseID]key2.2': 'bye',
//         }).toStrictEqual(r.dict)
//         expect({
//             "set-up": "any string will be ignored...",
//             "key1": "hiya!",
//             "key2": 'hiya/speak Jodi "hiya!"/end dialogue jodi "hiya!"',
//             "key3": null
//         }).toStrictEqual(r.alter)
//     });
//     it("traverse text in movies reactions", () => {
//         const entries: Entries = {
//             "Victor": {
//                 "NPCName": "Victor",
//                 "Reactions": [
//                     {
//                         "Tag": "sci-fi",
//                         "Response": "love",
//                         "Whitelist": [],
//                         "SpecialResponses": {
//                             "BeforeMovie": {
//                                 "ResponsePoint": null,
//                                 "Script": "",
//                                 "Text": "I love sci-fi films!$1"
//                             },
//                             "DuringMovie": {
//                                 "ResponsePoint": null,
//                                 "Script": "",
//                                 "Text": "Whoa!$1"
//                             },
//                             "AfterMovie": {
//                                 "ResponsePoint": null,
//                                 "Script": "",
//                                 "Text": "Let's see another movie sometime.$3"
//                             }
//                         },
//                         "ID": "reaction_0"
//                     }
//                 ]
//             }
//         }
//         const r = new Traversor4Entries("Data/MoviesReactions", entries, "[baseID]")
//             .traverse((s: string) => "hiya!")
//         expect({
//             "[baseID]VictorAfterMovie.0": "Let's see another movie sometime.$3",
//             "[baseID]VictorBeforeMovie.0": "I love sci-fi films!$1",
//             "[baseID]VictorDuringMovie.0": "Whoa!$1"
//         }).toStrictEqual(r.dict)
//         expect({
//             "Victor": {
//                 "NPCName": "Victor",
//                 "Reactions": [
//                     {
//                         "Tag": "sci-fi",
//                         "Response": "love",
//                         "Whitelist": [],
//                         "SpecialResponses": {
//                             "BeforeMovie": {
//                                 "ResponsePoint": null,
//                                 "Script": "",
//                                 "Text": "hiya!"
//                             },
//                             "DuringMovie": {
//                                 "ResponsePoint": null,
//                                 "Script": "",
//                                 "Text": "hiya!"
//                             },
//                             "AfterMovie": {
//                                 "ResponsePoint": null,
//                                 "Script": "",
//                                 "Text": "hiya!"
//                             }
//                         },
//                         "ID": "reaction_0"
//                     }
//                 ]
//             }
//         }).toStrictEqual(r.alter)
//     });
//     it("traverse text in npc dispositions", () => {
//         const entries: Entries = { "Olivia": "adult/polite/neutral/positive/female/datable/null/Town/spring 15//Custom_JenkinsHouse 18 5/Olivia" }
//         const r = new Traversor4Entries("Data/NPCDispositions", entries, "[baseID]")
//             .traverse((s: string) => "hiya!")
//         expect({ "[baseID]Olivia": "Olivia" })
//             .toStrictEqual(r.dict)
//         expect({ "Olivia": "adult/polite/neutral/positive/female/datable/null/Town/spring 15//Custom_JenkinsHouse 18 5/hiya!" })
//             .toStrictEqual(r.alter)
//     });
//     it("traverse text in npc gift tasts", () => {
//         const entries: Entries = {
//             "Olivia": "Oh, my! For me? This is truly an exquisite gift. Thank you, dear!/124 125 348 220 221/This is so thoughtful of you, sweetie! Thank you./336 432 276 608 421/Oh? I don't like this.../18 16 20 22 24 408 80 416 414 412 296 398 410 152 396 397 399/This really isn't appropriate. I'll promptly throw this out!/330 284 149 151 459 346 304/This is a thoughtful gift, dear. Thank you./446 402 418/"
//         }
//         const r = new Traversor4Entries("Data/NPCGiftTastes", entries, "[baseID]")
//             .traverse((s: string) => "hiya!")
//         expect({
//             "[baseID]Olivia.0": "Oh, my! For me? This is truly an exquisite gift. Thank you, dear!",
//             "[baseID]Olivia.2": "This is so thoughtful of you, sweetie! Thank you.",
//             "[baseID]Olivia.4": "Oh? I don't like this...",
//             "[baseID]Olivia.6": "This really isn't appropriate. I'll promptly throw this out!",
//             "[baseID]Olivia.8": "This is a thoughtful gift, dear. Thank you.",
//         })
//             .toStrictEqual(r.dict)
//         expect({
//             "Olivia": "hiya!/124 125 348 220 221/hiya!/336 432 276 608 421/hiya!/18 16 20 22 24 408 80 416 414 412 296 398 410 152 396 397 399/hiya!/330 284 149 151 459 346 304/hiya!/446 402 418/"
//         })
//             .toStrictEqual(r.alter)
//     });
// });

// describe("i18n testing", () => {
//     it("loads i18n in event", () => {
//         const str = "playful/14 22/farmer 10 23 1 Ian 13 16 2/skippable/addTemporaryActor RSVCart1 16 32 13 17 2 false/addTemporaryActor RSVCart2 16 32 14 17 2 false/pause 500/emote farmer 8/move Ian 0 5 2 true/move RSVCart1 0 5 2 true/pause 2000/speak Ian \"{{i18n:event-75160146.01}}\"/faceDirection farmer 0/move Ian 0 -5 1/move Ian 1 0 2/move Ian 0 5 2 true/move RSVCart2 0 5 2 true/pause 2000/speak Ian \"{{i18n:event-75160146.02}}\"/emote Ian 28/move farmer 2 0 1/emote farmer 8/speak Ian \"{{i18n:event-75160146.03}}\"/move farmer 2 0 0/emote farmer 8/speak Ian \"{{i18n:event-75160146.04}}\"/emote farmer 40/speak Ian \"$q 75160146 null \"#{{i18n:event-75160146.05}}#$r 75160146 0 ian1_1#{{i18n:event-75160146.06}}#$r 75160146 0 ian1_2#{{i18n:event-75160146.07}}\"/fork IanSolo/emote farmer 32/emote Ian 28/speak Ian \"{{i18n:event-75160146.08}}\"/emote farmer 56/speak Ian \"{{i18n:event-75160146.09}}\"/move farmer 1 0 0/move Ian -1 0 2/move farmer 0 -2 3/move farmer -1 0 2/emote Ian 56/speak Ian \"{{i18n:event-75160146.10}}\"/advancedMove RSVCart1 false 0 1 11 0/advancedMove Ian false 0 2 11 0/pause 2000/advancedMove RSVCart2 false 0 1 10 0/advancedMove farmer false 0 2 10 0/pause 4000/globalFade/viewport -1000 -1000/message \"{{i18n:event-75160146.11}}\"/speak Ian \"{{i18n:event-75160146.12}}\"/end dialogue Ian \"{{i18n:event-75160146.13}}\""
//         const i18n = parseJSON("res/RSV/Ridgeside Village/[CP] Ridgeside Village/i18n/default.json")
//         Traversor4Entries.getValuei18n(str, i18n)
//     })
// })