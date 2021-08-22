import { basename } from "path";

// Entries为数据列表，但可能需要单独处理
const regexp_movies_reactions = /Data(\/|\\\\)MoviesReactions/i

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

// EventsLike
const regexp_events = /Data(\/|\\\\)Events(\/|\\\\).*/i

// Plain or EventsLike and not include "set-up"
const regexp_festivals = /Data(\/|\\\\)Festivals(\/|\\\\).*/i // 节日对话包含set-up入口，格式需要根据文本本身特征区分

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

export enum TargetType {
    // 数据列表
    PlainText = 1,
    EventsLike,
    Festivals,
    NPCDispositions,
    NPCGiftTastes,
    MoviesReactions, // Entries为数据列表
    Unknown = 0
}

export class Target {
    public get type(): TargetType {
        if (this.regTest([
            regexp_dialogue,
            regexp_engagement_dialogue,
            regexp_extra_dialogue,
            regexp_mail,
            regexp_special_order_strings,
            regexp_speech_bubbles,
            regexp_strings_characters,
            regexp_strings_from_csfiles,
            regexp_strings_from_maps,
            regexp_strings_locations,
            regexp_strings_schedules,
            regexp_strings_ui,
            regexp_strings_events,
        ])) {
            return TargetType.PlainText
        } else if (regexp_events.test(this.str)) {
            return TargetType.EventsLike
        } else if (regexp_festivals.test(this.str)) {
            return TargetType.Festivals
        } else if (regexp_npc_dispositions.test(this.str)) {
            return TargetType.NPCDispositions
        } else if (regexp_npc_gift_tastes.test(this.str)) {
            return TargetType.NPCGiftTastes
        } else if (regexp_movies_reactions.test(this.str)) {
            return TargetType.MoviesReactions
        }
        return TargetType.Unknown
    }
    public str: string
    public get strWithoutPath() {
        return basename(this.str)
    }
    constructor(str: string) {
        this.str = str
    }
    public static fromStr(str: string): Target[] {
        const strLi = str.split(/\s*,\s*/g)
        const result = []
        for (let index = 0; index < strLi.length; index++) {
            result.push(new Target(strLi[index]))
        }
        return result
    }
    private regTest(regLi: RegExp[]): boolean {
        for (let index = 0; index < regLi.length; index++) {
            const re = regLi[index];
            if (re.test(this.str)) {
                return true
            }
        }
        return false
    }
}