import { parseJSON } from "../src/utils/parser";


describe("Parser Testing", () => {
    const answer = { key: { 0: 0.75 } }
    it("can parse none-standard JSON file", () => {
        const content = parseJSON('./tests/case/none-standard_json.json')
        expect(content).toEqual(answer);
    });
});
