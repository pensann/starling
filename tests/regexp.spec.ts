import { regex_dialogue_target, regex_event_target, } from "../src/utils/traversor";


describe("Parser Testing", () => {
    const answer = { key: { 0: 0.75 } }
    it("matches all dialogue path in different os", () => {
        // dialogues
        expect(regex_dialogue_target.test("Characters/dialogue/Kent")).toBe(true)
        expect(regex_dialogue_target.test("Characters\\Dialogue\\Jodi")).toBe(true)
        // events
        expect(regex_event_target.test("Data/Events/Farm")).toBe(true)
        expect(regex_event_target.test("data\\events/SamHouse")).toBe(true)
        // 
    });
});
