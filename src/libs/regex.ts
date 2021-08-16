// --------------------Target--------------------
// 特殊格式
const regexp_events = /Data(\/|\\\\)Events(\/|\\\\).*/i
const regexp_festivals = /Data(\/|\\\\)Festivals(\/|\\\\).*/i // 节日对话虽然包含set-up入口，但貌似可以归类到events

// 直接提取文本
const regexp_mail = /Data(\/|\\\\)Mail/i
const regexp_dialogue = /Characters(\/|\\\\)Dialogue(\/|\\\\).*/i
const regexp_engagement_dialogue = /Data(\/|\\\\)EngagementDialogue/i
const regexp_strings_from_csfiles = /Strings(\/|\\\\)StringsFromCSFiles/i
const regexp_strings_from_maps = /Strings(\/|\\\\)StringsFromMaps/i
const regexp_strings_schedules = /Strings(\/|\\\\)Schedules(\/|\\\\).*/i

// "/"隔开的格式
const regexp_npc_dispositions = /Data(\/|\\\\)NPCDispositions/i
const regexp_npc_gift_tastes = /Data(\/|\\\\)NPCGiftTastes/i

// 据说需要处理，但我没发现
const regexp_animation_descriptions = /Data(\/|\\\\)AnimationDescriptions/i

// 目前不处理的
const regexp_schedules = /Characters(\/|\\\\)Schedules(\/|\\\\).*/i
const regexp_fish = /Data(\/|\\\\)(Aquarium)?Fish/i
const regexp_data_locations = /Data(\/|\\\\)Locations/i
const regexp_antisocial_npcs = /Data(\/|\\\\)AntiSocialNPCs/i
const regexp_npcmaplocations = /Mods(\/|\\\\)Bouhm\.NPCMapLocations(\/|\\\\)(NPCs|Locations)/i
const regexp_custom_npc_exclusions = /Data(\/|\\\\)CustomNPCExclusions/i
const regexp_special_order_strings = /Strings(\/|\\\\)SpecialOrderStrings/i
const regexp_special_orders = /Data(\/|\\\\)SpecialOrders/i
const regexp_big_craftables_information = /Data(\/|\\\\)BigCraftablesInformation/i
const regexp_strings_ui = /Strings(\/|\\\\)UI/i
const regexp_strings_locations = /Strings(\/|\\\\)Locations/i
const regexp_extra_dialogue = /Data(\/|\\\\)ExtraDialogue/i
const regexp_custom_wedding_guest_positions = /Data(\/|\\\\)CustomWeddingGuestPositions/i
const regexp_object_context_tags = /Data(\/|\\\\)ObjectContextTags/i
const regexp_speech_bubbles = /Strings(\/|\\\\)SpeechBubbles/i
const regexp_strings_events = /Strings(\/|\\\\)Events/i
const regexp_chair_tiles = /Data(\/|\\\\)ChairTiles/i
const regexp_strings_characters = /Strings(\/|\\\\)Characters/i
// * Do more here...

// 铁定不需要处理
const regexp_objectinformation = /Data(\/|\\\\)objectinformation/i


// --------------------Marks--------------------


export {
    regexp_events,
    regexp_festivals,
    regexp_dialogue,
    regexp_engagement_dialogue,
    regexp_mail,
    regexp_strings_from_csfiles,
    regexp_strings_from_maps,
    regexp_npc_dispositions,
    regexp_npc_gift_tastes,
    regexp_strings_schedules,
    regexp_schedules,
    regexp_animation_descriptions,
    regexp_fish,
    regexp_data_locations,
    regexp_antisocial_npcs,
    regexp_npcmaplocations,
    regexp_custom_npc_exclusions,
    regexp_special_order_strings,
    regexp_big_craftables_information,
    regexp_strings_ui,
    regexp_strings_locations,
    regexp_extra_dialogue,
    regexp_custom_wedding_guest_positions,
    regexp_object_context_tags,
    regexp_speech_bubbles,
    regexp_special_orders,
    regexp_strings_events,
    regexp_chair_tiles,
    regexp_strings_characters,
    regexp_objectinformation
}