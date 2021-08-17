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
});
