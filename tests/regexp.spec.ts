import { Traversor4Entries } from "../src/libs/trav_entries";


describe("traverse Testing", () => {
    it("traverse plain text", () => {
        const entries = { "key": "value" }
        const r = new Traversor4Entries("Characters/Dialogue/Andy", entries, "[baseID]")
            .traverse((s: string) => "hiya!")
        expect({ '[baseID]key': 'value' }).toStrictEqual(r.dict)
        expect({ 'key': 'hiya!' }).toStrictEqual(r.alter)
    });
    it("traverse text in events", () => {
        const entries = { "key": 'hiya/speak Jodi "hi"/end dialogue jodi "bye"' }
        const r = new Traversor4Entries("Data/Events/SamHouse", entries, "[baseID]")
            .traverse((s: string) => "hiya!")
        expect({ '[baseID]key.1': 'hi', '[baseID]key.2': 'bye' }).toStrictEqual(r.dict)
        expect({ 'key': 'hiya/speak Jodi "hiya!"/end dialogue jodi "hiya!"' }).toStrictEqual(r.alter)
    });
    it("traverse text in festivals", () => {
        const entries = {
            "set-up": "any string will be ignored...",
            "key1": "this is a dialogue.",
            "key2": 'hiya/speak Jodi "hi"/end dialogue jodi "bye"',
            "key3": null
        }
        const r = new Traversor4Entries("Data/Festivals/Any", entries, "[baseID]")
            .traverse((s: string) => "hiya!")
        expect({
            '[baseID]key1': 'this is a dialogue.',
            '[baseID]key2.1': 'hi',
            '[baseID]key2.2': 'bye',
        }).toStrictEqual(r.dict)
        expect({
            "set-up": "any string will be ignored...",
            "key1": "hiya!",
            "key2": 'hiya/speak Jodi "hiya!"/end dialogue jodi "hiya!"',
            "key3": null
        }).toStrictEqual(r.alter)
    });
    it("traverse text in movies reactions", () => {
        const entries: Entries = {
            "Victor": {
                "NPCName": "Victor",
                "Reactions": [
                    {
                        "Tag": "sci-fi",
                        "Response": "love",
                        "Whitelist": [],
                        "SpecialResponses": {
                            "BeforeMovie": {
                                "ResponsePoint": null,
                                "Script": "",
                                "Text": "I love sci-fi films!$1"
                            },
                            "DuringMovie": {
                                "ResponsePoint": null,
                                "Script": "",
                                "Text": "Whoa!$1"
                            },
                            "AfterMovie": {
                                "ResponsePoint": null,
                                "Script": "",
                                "Text": "Let's see another movie sometime.$3"
                            }
                        },
                        "ID": "reaction_0"
                    }
                ]
            }
        }
        const r = new Traversor4Entries("Data/MoviesReactions", entries, "[baseID]")
            .traverse((s: string) => "hiya!")
        expect({
            "[baseID]VictorAfterMovie.0": "Let's see another movie sometime.$3",
            "[baseID]VictorBeforeMovie.0": "I love sci-fi films!$1",
            "[baseID]VictorDuringMovie.0": "Whoa!$1"
        }).toStrictEqual(r.dict)
        expect({
            "Victor": {
                "NPCName": "Victor",
                "Reactions": [
                    {
                        "Tag": "sci-fi",
                        "Response": "love",
                        "Whitelist": [],
                        "SpecialResponses": {
                            "BeforeMovie": {
                                "ResponsePoint": null,
                                "Script": "",
                                "Text": "hiya!"
                            },
                            "DuringMovie": {
                                "ResponsePoint": null,
                                "Script": "",
                                "Text": "hiya!"
                            },
                            "AfterMovie": {
                                "ResponsePoint": null,
                                "Script": "",
                                "Text": "hiya!"
                            }
                        },
                        "ID": "reaction_0"
                    }
                ]
            }
        }).toStrictEqual(r.alter)
    });
    it("traverse text in npc dispositions", () => {
        const entries: Entries = { "Olivia": "adult/polite/neutral/positive/female/datable/null/Town/spring 15//Custom_JenkinsHouse 18 5/Olivia" }
        const r = new Traversor4Entries("Data/NPCDispositions", entries, "[baseID]")
            .traverse((s: string) => "hiya!")
        expect({ "[baseID]Olivia": "Olivia" })
            .toStrictEqual(r.dict)
        expect({ "Olivia": "adult/polite/neutral/positive/female/datable/null/Town/spring 15//Custom_JenkinsHouse 18 5/hiya!" })
            .toStrictEqual(r.alter)
    });
    it("traverse text in npc gift tasts", () => {
        const entries: Entries = {
            "Olivia": "Oh, my! For me? This is truly an exquisite gift. Thank you, dear!/124 125 348 220 221/This is so thoughtful of you, sweetie! Thank you./336 432 276 608 421/Oh? I don't like this.../18 16 20 22 24 408 80 416 414 412 296 398 410 152 396 397 399/This really isn't appropriate. I'll promptly throw this out!/330 284 149 151 459 346 304/This is a thoughtful gift, dear. Thank you./446 402 418/"
        }
        const r = new Traversor4Entries("Data/NPCGiftTastes", entries, "[baseID]")
            .traverse((s: string) => "hiya!")
        expect({
            "[baseID]Olivia.0": "Oh, my! For me? This is truly an exquisite gift. Thank you, dear!",
            "[baseID]Olivia.2": "This is so thoughtful of you, sweetie! Thank you.",
            "[baseID]Olivia.4": "Oh? I don't like this...",
            "[baseID]Olivia.6": "This really isn't appropriate. I'll promptly throw this out!",
            "[baseID]Olivia.8": "This is a thoughtful gift, dear. Thank you.",
        })
            .toStrictEqual(r.dict)
        expect({ 
            "Olivia": "hiya!/124 125 348 220 221/hiya!/336 432 276 608 421/hiya!/18 16 20 22 24 408 80 416 414 412 296 398 410 152 396 397 399/hiya!/330 284 149 151 459 346 304/hiya!/446 402 418/"
        })
            .toStrictEqual(r.alter)
    });
});
