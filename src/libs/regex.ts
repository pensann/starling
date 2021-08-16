// EventsLike
const regexp_events = /Data(\/|\\\\)Events(\/|\\\\).*/i
const regexp_festivals = /Data(\/|\\\\)Festivals(\/|\\\\).*/i // 节日对话虽然包含set-up入口，格式需要根据文本本身是否包含"/"区分

// PlainText: 直接提取
const regexp_dialogue = /Characters(\/|\\\\)Dialogue(\/|\\\\).*/i
const regexp_engagement_dialogue = /Data(\/|\\\\)EngagementDialogue/i
const regexp_extra_dialogue = /Data(\/|\\\\)ExtraDialogue/i
const regexp_mail = /Data(\/|\\\\)Mail/i
const regexp_special_order_strings = /Strings(\/|\\\\)SpecialOrderStrings/i
const regexp_speech_bubbles = /Strings(\/|\\\\)SpeechBubbles/i
const regexp_strings_characters = /Strings(\/|\\\\)Characters/i
const regexp_strings_from_csfiles = /Strings(\/|\\\\)StringsFromCSFiles/i
const regexp_strings_from_maps = /Strings(\/|\\\\)StringsFromMaps/i
const regexp_strings_locations = /Strings(\/|\\\\)Locations/i
const regexp_strings_schedules = /Strings(\/|\\\\)Schedules(\/|\\\\).*/i
const regexp_strings_ui = /Strings(\/|\\\\)UI/i
const regexp_strings_events = /Strings(\/|\\\\)Events/i

// "/"隔开的格式
const regexp_npc_dispositions = /Data(\/|\\\\)NPCDispositions/i
const regexp_npc_gift_tastes = /Data(\/|\\\\)NPCGiftTastes/i

// 不处理
const regexp_schedules = /Characters(\/|\\\\)Schedules(\/|\\\\).*/i
const regexp_fish = /Data(\/|\\\\)(Aquarium)?Fish/i
const regexp_data_locations = /Data(\/|\\\\)Locations/i
const regexp_antisocial_npcs = /Data(\/|\\\\)AntiSocialNPCs/i
const regexp_npcmaplocations = /Mods(\/|\\\\)Bouhm\.NPCMapLocations(\/|\\\\)(NPCs|Locations)/i
const regexp_custom_npc_exclusions = /Data(\/|\\\\)CustomNPCExclusions/i
const regexp_special_orders = /Data(\/|\\\\)SpecialOrders/i
const regexp_big_craftables_information = /Data(\/|\\\\)BigCraftablesInformation/i
const regexp_custom_wedding_guest_positions = /Data(\/|\\\\)CustomWeddingGuestPositions/i
const regexp_object_context_tags = /Data(\/|\\\\)ObjectContextTags/i
const regexp_chair_tiles = /Data(\/|\\\\)ChairTiles/i
const regexp_warp_network_destinations = /Data(\/|\\\\)WarpNetwork(\/|\\\\)Destinations/i
const regexp_objectinformation = /Data(\/|\\\\)objectinformation/i

const regexp_animation_descriptions = /Data(\/|\\\\)AnimationDescriptions/i // 据说需要处理，但我没发现
const regexp_strings_animation_descriptions = /Strings(\/|\\\\)AnimationDescriptions/i // 据说需要处理，但我没发现
// * Do more here...


class EntriesTrav {
    public targetList: string[]
    public entries: Entries
    private re: RegExp
    private i18n: DictKV
    constructor(target: string, entries: Entries, extra?: { re?: RegExp, i18n?: DictKV }) {
        this.targetList = target.split(/,\s*/g)
        this.entries = entries
        this.re = extra?.re ? extra.re : /./m
        this.i18n = extra?.i18n ? extra.i18n : {}
    }
}