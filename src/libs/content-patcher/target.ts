import { basename } from "path";
import { Starlog } from "../log";

export enum TarFmt {
    PlainText = 1,
    EventsLike,
    Festivals,
    NPCDispositions,
    NPCGiftTastes,
    MoviesReactions, // Entries为数据列表
    Quests,
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
            /Strings\/Characters/i,
            /Characters\/Dialogue\/.*/i,
            /Data\/EngagementDialogue/i,
            /Data\/ExtraDialogue/i,
            /Strings\/Events/i,
            /Strings\/StringsFromCSFiles/i,
            /Strings\/StringsFromMaps/i,
            /Strings\/Locations/i,
            /Strings\/SpecialOrderStrings/i,
            /Strings\/SpeechBubbles/i,
            /Strings\/Schedules\/.*/i,
            /Strings\/UI/i,
            /Data\/TV\/TipChannel/i,
        )) {
            return TarFmt.PlainText
        } else if (this.test(/Data\/Events\/.*/i)) {
            return TarFmt.EventsLike
        } else if (this.test(/Data\/Festivals\/.*/i)/** PlainText or EventsLike not include "set-up" */) {
            return TarFmt.Festivals
        } else if (this.test(/Data\/NPCDispositions/i)) {
            return TarFmt.NPCDispositions
        } else if (this.test(/Data\/NPCGiftTastes/i)) {
            return TarFmt.NPCGiftTastes
        } else if (this.test(/Data\/MoviesReactions/i)) {
            return TarFmt.MoviesReactions
        } else if (this.test(/Data\/Mail/i)) {
            return TarFmt.Mail
        } else if (this.test(/Data\/Quests/i)) {
            return TarFmt.Quests
        } else if (this.test(
            /Characters\/Schedules\/.*/i,
            /Data\/(Aquarium)?Fish/i,
            /Data\/Locations/i,
            /Data\/AntiSocialNPCs/i,
            /Data\/CustomNPCExclusions/i,
            /Data\/SpecialOrders/i,
            /Data\/BigCraftablesInformation/i,
            /Data\/CustomWeddingGuestPositions/i,
            /Data\/ObjectContextTags/i,
            /Data\/ChairTiles/i,
            /Data\/WarpNetwork\/Destinations/i,
            /Data\/ObjectInformation/i,
            /Data\/CraftingRecipes/i,
            /Mods\/Bouhm\.NPCMapLocations\/(NPCs|Locations)/i,
            /Data\/ConcessionTastes/i,
            /Data\/AnimationDescriptions/i, // 据说需要处理
            /Strings\/AnimationDescriptions/i, // 据说需要处理
        )) {
            return TarFmt.Unknown
        } else {
            Starlog.warnning(`未知target:${this.str}`)
            throw new Error(`未知target:${this.str}`);
            return TarFmt.Unknown
        }
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