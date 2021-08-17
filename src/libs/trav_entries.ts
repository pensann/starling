import { Starlog } from "./log";

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
    public entries: Entries
    public target: Target
    private baseID: string
    private reText: RegExp
    private rei18n = /{{i18n:.*}}/
    private i18n: DictKV
    private result: EntriesTravResult
    private strHandler: {
        func?: (str: string, ...args: any[]) => string,
        args: any[]
    } = { args: [] }
    constructor(target: string, entries: Entries, baseID: string, reText: RegExp = /./m, i18n: DictKV = {}) {
        this.target = new Target(target)
        this.entries = entries
        this.reText = reText
        this.i18n = i18n
        this.baseID = baseID
        this.result = {
            alter: {} as Entries,
            dict: {} as DictKV
        }
        Object.assign(this.result.alter, this.entries)
    }
    private getValue(value: string) {
        if (this.i18n && this.rei18n.test(value)) {
            const result = this.i18n[value.slice(7, -2)]
            if (result) {
                value = result
            }
        }
        return value
    }
    /**
     * traverse
     */
    public traverse(
        strHandler?: (str: string, ...args: any[]) => string,
        ...args: any[]
    ): EntriesTravResult {
        this.strHandler.func = strHandler
        this.strHandler.args = args
        for (let [key, value] of Object.entries(this.entries)) {
            // 首先根据Target区分Entries的遍历器
            switch (this.target.type) {
                case EntriesType.PlainText:
                    if (value = value as string) {
                        this.plainTextTrav(key, value)
                    }
                    break;
                case EntriesType.EventsLike:
                    if (value = value as string) {
                        this.eventsLikeTrav(key, value)
                    }
                    break;
                case EntriesType.Festivals:
                    // TODO 
                    if (value = value as string) {
                        if (key == "set-up") {
                            // DO NOTHING
                        }
                        else if (/"\s*\//.test(value)) {
                            this.eventsLikeTrav(key, value)
                        } else {
                            this.plainTextTrav(key, value)
                        }
                    }
                    break;
                case EntriesType.MoviesReactions:
                    if (value = value as MoviesReactionValue) {
                        this.moviesReactionsTrav(key, value)
                    }
                    break;
                case EntriesType.NPCDispositions:
                    if (value = value as string) {
                        this.npcDispositionsTrav(key, value)
                    }
                    break;
                case EntriesType.NPCGiftTastes:
                    if (value = value as string) {
                        this.npcGiftTastsTrav(key, value, strHandler, ...args)
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
    ) {
        value = this.getValue(value)
        if (this.strHandler.func) {
            this.result.alter[key] = this.strHandler.func!(value, ...this.strHandler.args)
        }
        if (this.reText.test(value)) {
            this.result.dict[this.baseID + key] = value
        }
    }
    private eventsLikeTrav(
        key: string,
        value: string,
    ) {
        const qtMarkNum = (() => {
            const matchList = value.match(/\"/g)
            return matchList ? matchList.length : 0
        })()
        if (qtMarkNum % 2) {
            Starlog.warnning(`文本包含未闭合引号，使用全字匹配模式...\n\x1B[38;5;65m${value}\x1B[0m`)
            // 处理包含奇数引号的文本
            this.plainTextTrav(key, value)
        }
        else {
            // 处理Events文本
            const re = /\".*?\"/g
            let arr;
            let index = 0
            while ((arr = re.exec(value)) !== null) {
                index += 1
                const str = arr[0]
                if (this.reText.test(str)) {
                    let value = str.substring(1, str.length - 1)
                    if (this.rei18n.test(value)) {
                        value = this.i18n[value.slice(7, -2)]
                    }
                    this.result.dict[this.baseID + key + "." + index] = value
                }
            }
            if (this.strHandler.func) {
                this.result.alter[key] = value.replace(/\".*?\"/g, (s) => {
                    const str = s.substring(1, s.length - 1)
                    return "\"" + this.strHandler.func!(str, ...this.strHandler.args) + "\""
                })
            }
        }
    }
    private moviesReactionsTrav(
        key: string,
        value: MoviesReactionValue,
    ) {
        let n = 0
        value.Reactions.forEach((reaction) => {
            if (reaction.SpecialResponses) {
                for (const [keySPR, valueSPR] of Object.entries(reaction.SpecialResponses)) {
                    if (valueSPR && valueSPR.Text) {
                        // 将字符串提取至字典
                        valueSPR.Text = this.getValue(valueSPR.Text)
                        if (this.reText.test(valueSPR.Text)) {
                            this.result.dict[this.baseID + key + keySPR + "." + n] = valueSPR.Text
                        }
                        // 处理字符串
                        if (this.strHandler.func) {
                            const o = this.result.alter[key] as MoviesReactionValue
                            o["Reactions"][n]["SpecialResponses"]![keySPR]["Text"] =
                                this.strHandler.func!(valueSPR.Text, ...this.strHandler.args)
                            this.result.alter[key] = o
                        }
                    }
                }
            }
            n += 1
        })
    }
    private npcDispositionsTrav(
        key: string,
        value: string,
    ) {
        const strLi = value.split(/\s*\/\s*/)
        if (strLi.length) {
            const index = strLi.length - 1
            // 原字符串提取到字典
            if (strLi[index]) {
                strLi[index] = this.getValue(strLi[index])
                if (this.reText.test(strLi[index])) {
                    this.result.dict[this.baseID + key] = strLi[index]
                }
                if (this.strHandler.func) {
                    // 处理字符串
                    strLi[index] = this.strHandler.func!(strLi[index], ...this.strHandler.args)
                }
            }
        }
        // ? （可能有问题）处理后的字符串输出到alter
        this.result.alter[key] = strLi.join("/")
    }
    private npcGiftTastsTrav(
        key: string,
        value: string,
        strHandler?: (str: string, ...args: any[]) => string, ...args: any
    ) {
        const strLi = value.split(/\s*\/\s*/)
        if (strLi.length) {
            let n = 0
            // 遍历字符串文字，其中模2片段为需要翻译的字符串
            while (n < strLi.length) {
                if (!(n % 2)) {
                    if (strLi[n]) {
                        strLi[n] = this.getValue(strLi[n])
                        // 原字符串提取到字典
                        if (this.reText.test(strLi[n])) {
                            this.result.dict[this.baseID + key + "." + n] = strLi[n]
                        }
                        // 处理字符串
                        if (strHandler) {
                            strLi[n] = strHandler(strLi[n], ...args)
                        }
                    }
                }
                n += 1
            }
            this.result.alter[key] = strLi.join("/")
        }
    }
}
