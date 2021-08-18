import { parseJSON } from "./libs/parser"
import { Lang, Traversor4Mod } from "./libs/trav-mod"
import { mergeDict } from "./libs/stardict";
import { buildTarget } from "./libs/builder";
import { Traversor4Entries } from "./libs/trav-entries";
import { Starlog } from "./libs/log";

const dict = {}
const t = new Traversor4Mod("res/RSV/Ridgeside Village/[CP] Ridgeside Village")
t.loadFile("content.json")
Object.assign(dict, t.extractText())

const dictch = {}
const t2 = new Traversor4Mod("res/RSV/Ridgeside Village Mod 1.2.7/[CP] Ridgeside Village")
t2.loadFile("content.json")
Object.assign(dictch, t2.extractText(Lang.zh))

buildTarget("res/RSV/dict1.json", JSON.stringify(mergeDict(dict, dictch).toDictKV(), undefined, 2))

// const str = "playful/14 22/farmer 10 23 1 Ian 13 16 2/skippable/addTemporaryActor RSVCart1 16 32 13 17 2 false/addTemporaryActor RSVCart2 16 32 14 17 2 false/pause 500/emote farmer 8/move Ian 0 5 2 true/move RSVCart1 0 5 2 true/pause 2000/speak Ian \"{{i18n:event-75160146.01}}\"/faceDirection farmer 0/move Ian 0 -5 1/move Ian 1 0 2/move Ian 0 5 2 true/move RSVCart2 0 5 2 true/pause 2000/speak Ian \"{{i18n:event-75160146.02}}\"/emote Ian 28/move farmer 2 0 1/emote farmer 8/speak Ian \"{{i18n:event-75160146.03}}\"/move farmer 2 0 0/emote farmer 8/speak Ian \"{{i18n:event-75160146.04}}\"/emote farmer 40/speak Ian \"$q 75160146 null \"#{{i18n:event-75160146.05}}#$r 75160146 0 ian1_1#{{i18n:event-75160146.06}}#$r 75160146 0 ian1_2#{{i18n:event-75160146.07}}\"/fork IanSolo/emote farmer 32/emote Ian 28/speak Ian \"{{i18n:event-75160146.08}}\"/emote farmer 56/speak Ian \"{{i18n:event-75160146.09}}\"/move farmer 1 0 0/move Ian -1 0 2/move farmer 0 -2 3/move farmer -1 0 2/emote Ian 56/speak Ian \"{{i18n:event-75160146.10}}\"/advancedMove RSVCart1 false 0 1 11 0/advancedMove Ian false 0 2 11 0/pause 2000/advancedMove RSVCart2 false 0 1 10 0/advancedMove farmer false 0 2 10 0/pause 4000/globalFade/viewport -1000 -1000/message \"{{i18n:event-75160146.11}}\"/speak Ian \"{{i18n:event-75160146.12}}\"/end dialogue Ian \"{{i18n:event-75160146.13}}\""
// const i18n = parseJSON("res/RSV/Ridgeside Village/[CP] Ridgeside Village/i18n/default.json")
// Starlog.debug(i18n)
// Starlog.debug(Traversor4Entries.getValuei18n(str, i18n))
