import { extractModStr } from "./utils/extrator";
const mod = "res/-Stardew Valley Expanded--3753-1-13-8-1625195234/Stardew Valley Expanded/[CP] Stardew Valley Expanded/content.json"

extractModStr(mod, "res/dict_eng.json")
// extractModStr(mod, "res/dict_chs.json", /[\u4e00-\u9fa5]/gm)


// const oj = {
//     "Action": "EditData",
//     "Target": "Data/MoviesReactions",
//     "When": { "HasSeenEvent |contains=191393": false, "HasMod |contains=Tanpoponoko.SeasonalOutfits": false },
//     "Entries": {
//         "MorrisTod": {
//             "NPCName": "MorrisTod",
//             "Reactions": [
//                 {
//                     "Tag": "classic",
//                     "Response": "love",
//                     "Whitelist": [],
//                     "SpecialResponses": null,
//                     "ID": "reaction_0"
//                 },
//                 {
//                     "Tag": "horror",
//                     "Response": "dislike",
//                     "Whitelist": [],
//                     "SpecialResponses": null,
//                     "ID": "reaction_1"
//                 },
//                 {
//                     "Tag": "winter_movie_1",
//                     "Response": "like",
//                     "Whitelist": [],
//                     "SpecialResponses": {
//                         "BeforeMovie": {
//                             "ResponsePoint": null,
//                             "Script": "",
//                             "Text": "Ah, @. This film in particular strikes my interest! Shall we procure seats?$1"
//                         },
//                         "DuringMovie": {
//                             "ResponsePoint": null,
//                             "Script": "",
//                             "Text": "Haha! Fantastic!$1"
//                         },
//                         "AfterMovie": {
//                             "ResponsePoint": null,
//                             "Script": "",
//                             "Text": "I felt youthful again watching that film! Certainly a gratifying experience!$1"
//                         }
//                     },
//                     "ID": "reaction_2"
//                 },
//                 {
//                     "Tag": "winter_movie_0",
//                     "Response": "like",
//                     "Whitelist": [],
//                     "SpecialResponses": {
//                         "BeforeMovie": {
//                             "ResponsePoint": null,
//                             "Script": "",
//                             "Text": "Thank you for inviting me to the cinema, @. Best to get use out of the theater you paid for.$1"
//                         },
//                         "DuringMovie": {
//                             "ResponsePoint": null,
//                             "Script": "",
//                             "Text": "Haha! Splendid!$1"
//                         },
//                         "AfterMovie": {
//                             "ResponsePoint": null,
//                             "Script": "",
//                             "Text": "That film presented a... unique perspective. Perahps I should follow it by example?$0"
//                         }
//                     },
//                     "ID": "reaction_3"
//                 },
//                 {
//                     "Tag": "love",
//                     "Response": "like",
//                     "Whitelist": [],
//                     "SpecialResponses": {
//                         "BeforeMovie": {
//                             "ResponsePoint": null,
//                             "Script": "",
//                             "Text": "It's good to present yourself at the cinema, @. Everyone knows you single-handely paid for the establishment!$1"
//                         },
//                         "DuringMovie": {
//                             "ResponsePoint": null,
//                             "Script": "/shake MorrisTod 2000/pause 500/message \"Morris is laughing.\"",
//                             "Text": "Haha! Quite the show this is!$1"
//                         },
//                         "AfterMovie": {
//                             "ResponsePoint": null,
//                             "Script": "",
//                             "Text": "Well, I must say that was quite entertaining. Until next time, @.$0"
//                         }
//                     },
//                     "ID": "reaction_4"
//                 },
//                 {
//                     "Tag": "like",
//                     "Response": "like",
//                     "Whitelist": [],
//                     "SpecialResponses": {
//                         "BeforeMovie": {
//                             "ResponsePoint": null,
//                             "Script": "",
//                             "Text": "After the countless hours I've put into work, I'm looking forward to this delightful film.$0"
//                         },
//                         "DuringMovie": null,
//                         "AfterMovie": {
//                             "ResponsePoint": null,
//                             "Script": "",
//                             "Text": "A magnificent film that certainly was. Thank you for the invite.$1"
//                         }
//                     },
//                     "ID": "reaction_5"
//                 },
//                 {
//                     "Tag": "dislike",
//                     "Response": "like",
//                     "Whitelist": [],
//                     "SpecialResponses": {
//                         "BeforeMovie": {
//                             "ResponsePoint": null,
//                             "Script": "",
//                             "Text": "Ah, yes. I've heard... poor reviews of this movie but never had the chance to inspect it yet...$0"
//                         },
//                         "DuringMovie": {
//                             "ResponsePoint": null,
//                             "Script": "",
//                             "Text": "What. No! That makes no sense!$3"
//                         },
//                         "AfterMovie": {
//                             "ResponsePoint": null,
//                             "Script": "",
//                             "Text": "I will look into removing this movie from the master show list. Can't have poor films ruining our establishment!$3"
//                         }
//                     },
//                     "ID": "reaction_6"
//                 }
//             ]
//         }
//     }
// }
