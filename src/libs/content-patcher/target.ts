import { basename } from "path";

// Entries为数据列表，但可能需要单独处理
const data_movies_reactions = /Data(\/|\\\\)MoviesReactions/i

// PlainText: 直接提取
const characters_dialogue = /Characters(\/|\\\\)Dialogue(\/|\\\\).*/i
const data_engagement_dialogue = /Data(\/|\\\\)EngagementDialogue/i
const data_extra_dialogue = /Data(\/|\\\\)ExtraDialogue/i
const strings_special_order_strings = /Strings(\/|\\\\)SpecialOrderStrings/i
const strings_speech_bubbles = /Strings(\/|\\\\)SpeechBubbles/i
const strings_characters = /Strings(\/|\\\\)Characters/i
const strings_from_csfiles = /Strings(\/|\\\\)StringsFromCSFiles/i
const strings_from_maps = /Strings(\/|\\\\)StringsFromMaps/i
const strings_locations = /Strings(\/|\\\\)Locations/i
const strings_schedules = /Strings(\/|\\\\)Schedules(\/|\\\\).*/i
const strings_ui = /Strings(\/|\\\\)UI/i
const strings_events = /Strings(\/|\\\\)Events/i

// Mail
const data_mail = /Data(\/|\\\\)Mail/i

// EventsLike
const data_events = /Data(\/|\\\\)Events(\/|\\\\).*/i

// Plain or EventsLike and not include "set-up"
const data_festivals = /Data(\/|\\\\)Festivals(\/|\\\\).*/i // 节日对话包含set-up入口，格式需要根据文本本身特征区分

// "/"隔开, 格式1
const data_npc_dispositions = /Data(\/|\\\\)NPCDispositions/i

// "/"隔开, 格式2
const data_npc_gift_tastes = /Data(\/|\\\\)NPCGiftTastes/i

// 不处理
const schedules = /Characters(\/|\\\\)Schedules(\/|\\\\).*/i
const fish = /Data(\/|\\\\)(Aquarium)?Fish/i
const data_locations = /Data(\/|\\\\)Locations/i
const antisocial_npcs = /Data(\/|\\\\)AntiSocialNPCs/i
const npcmaplocations = /Mods(\/|\\\\)Bouhm\.NPCMapLocations(\/|\\\\)(NPCs|Locations)/i
const custom_npc_exclusions = /Data(\/|\\\\)CustomNPCExclusions/i
const special_orders = /Data(\/|\\\\)SpecialOrders/i
const big_craftables_information = /Data(\/|\\\\)BigCraftablesInformation/i
const custom_wedding_guest_positions = /Data(\/|\\\\)CustomWeddingGuestPositions/i
const object_context_tags = /Data(\/|\\\\)ObjectContextTags/i
const chair_tiles = /Data(\/|\\\\)ChairTiles/i
const warp_network_destinations = /Data(\/|\\\\)WarpNetwork(\/|\\\\)Destinations/i
const objectinformation = /Data(\/|\\\\)objectinformation/i

const animation_descriptions = /Data(\/|\\\\)AnimationDescriptions/i // 据说需要处理，但我没发现
const strings_animation_descriptions = /Strings(\/|\\\\)AnimationDescriptions/i // 据说需要处理，但我没发现
// * Do more here...

export enum TarFmt {
    PlainText = 1,
    EventsLike,
    Festivals,
    NPCDispositions,
    NPCGiftTastes,
    MoviesReactions, // Entries为数据列表
    Mail,
    Unknown = 0
}

export class Target {
    public str: string
    public get strWithoutPath() {
        return basename(this.str)
    }
    public get type(): TarFmt {
        if (this.test(
            characters_dialogue,
            data_engagement_dialogue,
            data_extra_dialogue,
            strings_special_order_strings,
            strings_speech_bubbles,
            strings_characters,
            strings_from_csfiles,
            strings_from_maps,
            strings_locations,
            strings_schedules,
            strings_ui,
            strings_events,
        )) {
            return TarFmt.PlainText
        } else if (this.test(data_events)) {
            return TarFmt.EventsLike
        } else if (this.test(data_festivals)) {
            return TarFmt.Festivals
        } else if (this.test(data_npc_dispositions)) {
            return TarFmt.NPCDispositions
        } else if (this.test(data_npc_gift_tastes)) {
            return TarFmt.NPCGiftTastes
        } else if (this.test(data_movies_reactions)) {
            return TarFmt.MoviesReactions
        } else if (this.test(data_mail)) {
            return TarFmt.Mail
        }
        return TarFmt.Unknown
    }
    constructor(str: string) {
        this.str = str
    }
    /** 从形如"tar,tar2..."的字符串加载Target列表 */
    public static fromStr(str: string): Target[] {
        const strLi = str.split(/\s*,\s*/g)
        const result = []
        for (let index = 0; index < strLi.length; index++) {
            result.push(new Target(strLi[index]))
        }
        return result
    }
    private test(...res: RegExp[]): boolean {
        for (let index = 0; index < res.length; index++) {
            const re = res[index];
            if (re.test(this.str)) {
                return true
            }
        }
        return false
    }
}