// --------------------Target--------------------
// 特殊格式
const regexp_events = /Data(\/|\\\\)Events(\/|\\\\).*/i
const regexp_festivals = /Data(\/|\\\\)Festivals(\/|\\\\).*/i // 节日对话虽然包含set-up入口，但貌似可以归类到events

// 直接提取文本
const regexp_dialogue = /Characters(\/|\\\\)Dialogue(\/|\\\\).*/i
const regexp_strings_from_csfiles = /Strings(\/|\\\\)StringsFromCSFiles/i
const regexp_data_mail = /Data(\/|\\\\)Mail/i
const regexp_data_strings_from_maps = /Strings(\/|\\\\)StringsFromMaps/i

// "/"隔开的格式
const regexp_npc_dispositions = /Data(\/|\\\\)NPCDispositions/i
const regexp_data_npc_gift_tastes = /Data(\/|\\\\)NPCGiftTastes/i

// ? 据说含有dialogue，但SVE没有
const regexp_strings_schedule = /Strings(\/|\\\\)Schedules(\/|\\\\).*/i
const regexp_animation = /Data(\/|\\\\)AnimationDescriptions/i
// * Do more here...


// --------------------Marks--------------------


export {
    regexp_events,
    regexp_festivals,
    regexp_dialogue,
    regexp_data_mail,
    regexp_strings_from_csfiles,
    regexp_data_strings_from_maps,
    regexp_npc_dispositions,
    regexp_data_npc_gift_tastes
}