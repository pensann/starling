// Entries为数据列表
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

enum EntriesType {
    // 数据列表
    PlainText = 1,
    EventsLike,
    Festivals,
    NPCDispositions,
    NPCGiftTastes,
    MoviesReactions, // Entries为数据列表
    Unknown = 0
}

class Target {
    public get type(): EntriesType {
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
            return EntriesType.PlainText
        } else if (regexp_events.test(this.str)) {
            return EntriesType.EventsLike
        } else if (regexp_festivals.test(this.str)) {
            return EntriesType.Festivals
        } else if (regexp_npc_dispositions.test(this.str)) {
            return EntriesType.NPCDispositions
        } else if (regexp_npc_gift_tastes.test(this.str)) {
            return EntriesType.NPCGiftTastes
        } else if (regexp_movies_reactions.test(this.str)) {
            return EntriesType.MoviesReactions
        }
        return EntriesType.Unknown
    }
    public str: string
    constructor(str: string) {
        this.str = str
    }
    public static parseString(str: string): Target[] {
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

export class Traversor4Entries {
    public target: Target
    public entries: Entries
    private re: RegExp
    private i18n: DictKV
    private baseID: string
    private result: EntriesTravResult
    constructor(target: string, entries: Entries, baseID: string, re: RegExp = /./m, i18n: DictKV = {}) {
        this.target = new Target(target)
        this.entries = entries
        this.re = re
        this.i18n = i18n
        this.baseID = baseID
        this.result = {
            alter: {} as Entries,
            dict: {} as DictKV
        }
        Object.assign(this.result.alter, this.entries)
    }
    /**
     * traverse
     */
    public traverse(
        strHandler?: (str: string, ...args: any[]) => string,
        ...args: any[]
    ): EntriesTravResult {
        for (let [key, value] of Object.entries(this.entries)) {
            // 首先根据Target区分Entries的遍历器
            switch (this.target.type) {
                case EntriesType.PlainText:
                    if (value = value as string) {
                        this.plainTextTrav(key, value, strHandler, ...args)
                    }
                    break;
                case EntriesType.EventsLike:
                    if (value = value as string) {
                        this.eventsLikeTrav(key, value, strHandler, ...args)
                    }
                    break;
                case EntriesType.Festivals:
                    // TODO 
                    if (value = value as string) {
                        if (key == "set-up") {
                            // DO NOTHING
                        }
                        else if (/"\s*\//.test(value)) {
                            this.eventsLikeTrav(key, value, strHandler, ...args)
                        } else {
                            this.plainTextTrav(key, value, strHandler, ...args)
                        }
                    }
                    break;
                case EntriesType.MoviesReactions:
                    if (value = value as MoviesReactionValue) {
                        this.moviesReactionsTrav(key, value, strHandler, ...args)
                    }
                    break;
                // Do more here...
                default:
                    break;
            }
        }
        return this.result
    }
    private plainTextTrav(
        key: string, value: string,
        strHandler?: (str: string, ...args: any[]) => string, ...args: any
    ) {
        if (/{{i18n:.*}}/.test(value)) {
            value = this.i18n[value.slice(7, -2)]
        }
        if (this.re.test(value)) {
            this.result.dict[this.baseID + key] = value
        }
        if (strHandler) {
            this.result.alter[key] = strHandler(value, ...args)
        }
    }
    private eventsLikeTrav(
        key: string,
        value: string,
        strHandler?: (str: string, ...args: any[]) => string, ...args: any
    ) {
        const qtMarkNum = (() => {
            const matchList = value.match(/\"/g)
            return matchList ? matchList.length : 0
        })()
        if (qtMarkNum % 2) {
            Starlog.warnning(`文本包含未闭合引号，使用全字匹配模式...\n\x1B[38;5;65m${value}\x1B[0m`)
            // TODO 处理包含奇数引号的文本
            this.result.dict[this.baseID + key] = value
            if (strHandler) {
                this.result.alter[key] = strHandler(value, ...args)
            }
        }
        else {
            // TODO 处理Events文本
            const re = /\".*?\"/g
            let arr;
            let index = 0
            while ((arr = re.exec(value)) !== null) {
                index += 1
                const str = arr[0]
                if (this.re.test(str)) {
                    this.result.dict[this.baseID + key + "." + index] = str.substring(1, str.length - 1)
                }
            }
            if (strHandler) {
                this.result.alter[key] = value.replace(/\".*?\"/g, (s) => {
                    const str = s.substring(1, s.length - 1)
                    return "\"" + strHandler(str, ...args) + "\""
                })
            }
        }
    }
    private moviesReactionsTrav(
        key: string,
        value: MoviesReactionValue,
        strHandler?: (str: string, ...args: any[]) => string, ...args: any
    ) {
        let n = 0
        value.Reactions.forEach((reaction) => {
            if (reaction.SpecialResponses) {
                for (const [keySPR, valueSPR] of Object.entries(reaction.SpecialResponses)) {
                    if (valueSPR && valueSPR.Text) {
                        // 将字符串提取至字典
                        this.result.dict[this.baseID + key + keySPR + "." + n] = valueSPR.Text
                        // 处理字符串
                        if (strHandler) {
                            const o = this.result.alter[key] as MoviesReactionValue
                            o["Reactions"][n]["SpecialResponses"]![keySPR]["Text"] = strHandler(valueSPR.Text, ...args)
                            this.result.alter[key] = o
                        }
                    }
                }
            }
            n += 1
        })
    }
}
