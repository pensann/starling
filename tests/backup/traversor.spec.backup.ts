import { parseJSON } from "../src/utils/parser";
import { ChangeTraversor } from "../src/utils/traversor";
import { CommonFields } from "../src/libs/base_types";


describe("Traversor Testing", () => {
    it("read EditData Obj without missing.", () => {
        const obj1 = parseJSON('tests/case/edit_data.json')
        const obj2 = parseJSON('tests/case/edit_data2.json')
        expect(obj1).toEqual(answer_json1);
        expect(obj2).toEqual(answer_json2);
    });
    it("traverse EditData Obj and return ChangeObj", () => {
        const obj = parseJSON('tests/case/edit_data.json')
        const t = new ChangeTraversor(obj)
        const result = t.traverse()
        // expect(obj).toEqual(answer_str);
    });
});

const answer_json1 = {
    Action: "EditData",
    Target: "data/events/farm",
    When: { "Spouse |contains=Wizard": false, "HasFlag": "galaxySword", "HasSeenEvent |contains=7502582": true, "HasSeenEvent |contains=8050109": true, "HasSeenEvent |contains=6951319": true }, //player has galaxy sword, cleared the railroad boulder, saw Alesia's event, beat the volcano dungeon
    Entries: {
        "908070/t 600 900": "continue/95 49/farmer 21 20 1 Wizard 20 20 0/skippable/pause 1000/speak Wizard \"Good morning, @. I bring important news from the Ferngill Republic Ministry of Magic.$0#$b#It would appear a high-ranking council member has expressed interest in developing your arcane potential, which isn't a common occurrence...$0\"/pause 500/emote farmer 8 true/pause 800/speak Wizard \"My colleagues have tasked me with teaching you warp magic. Meet me at my tower at your earliest convenience.$0\"/pause 850/faceDirection Wizard 1 true/pause 225/faceDirection Wizard 2 true/pause 650/showFrame Wizard 16 true/pause 400/shake Wizard 500/pause 500/screenFlash 1/playSound wand/warp Wizard -50 -50/pause 1000/end"
    }
}
const answer_json2 =
{
    "Action": "EditData",
    "Target": "Data/Monsters",
    "Fields": {
        "Green Slime": { 0: 30, 1: 12 },
        "Dust Spirit": { 0: 25, 1: 8 },
        "Bat": { 0: 18, 1: 13 },
        "Frost Bat": { 0: 36, 1: 18 },
        "Lava Bat": { 0: 80, 1: 25 },
        "Iridium Bat": { 0: 300, 1: 40 },
        "Stone Golem": { 0: 50, 1: 20 },
        "Wilderness Golem": { 0: 40, 1: 20 },
        "Grub": { 0: 20, 1: 8 },
        "Fly": { 0: 22, 1: 13 },
        "Frost Jelly": { 0: 80, 1: 15 },
        "Sludge": { 0: 180, 1: 30 },
        "Shadow Guy": { 0: 185, 1: 50 },
        "Ghost": { 0: 96, 1: 40 },
        "Carbon Ghost": { 0: 190, 1: 60 },
        "Rock Crab": { 0: 30, 1: 13 },
        "Lava Crab": { 0: 120, 1: 30 },
        "Iridium Crab": { 0: 260, 1: 40 },
        "Squid Kid": { 0: 1, 1: 50 },
        "Skeleton Warrior": { 0: 300, 1: 25 },
        "Shadow Brute": { 0: 220, 1: 50 },
        "Shadow Shaman": { 0: 100, 1: 40 },
        "Skeleton": { 0: 140, 1: 25 },
        "Skeleton Mage": { 0: 60, 1: 20 },
        "Metal Head": { 0: 150, 1: 30 },
        "Spiker": { 0: 1, 1: 50 },
        "Bug": { 0: 1, 1: 15 },
        "Mummy": { 0: 350, 1: 60 },
        "Big Slime": { 0: 150, 1: 35 },
        "Serpent": { 0: 150, 1: 30 },
        "Pepper Rex": { 0: 550, 1: 65 },
        "Tiger Slime": { 0: 350, 1: 40 },
        "Lava Lurk": { 0: 220, 1: 35 },
        "Hot Head": { 0: 250, 1: 30 },
        "Magma Sprite": { 0: 220, 1: 20 },
        "Magma Sparker": { 0: 310, 1: 25 },
        "False Magma Cap": { 0: 290, 1: 25 },
        "Dwarvish Sentry": { 0: 300, 1: 35 },
        "Putrid Ghost": { 0: 500, 1: 55 },
        "Shadow Sniper": { 0: 300, 1: 38 },
        "Spider": { 0: 150, 1: 25 },
        "Royal Serpent": { 0: 600, 1: 45 },
        "Blue Squid": { 0: 80, 1: 30 },
    },
    "When": { "StrongerMonsters": true }
}
