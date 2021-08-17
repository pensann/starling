interface BaseChange {
    Action: "Load" | "EditImage" | "EditData" | "EditMap" | "Include",
}
/**
 * 相当于从文件粘贴代码
 */
interface Include extends BaseChange {
    Action: "Include",
    FromFile: string
}
/**
 * 实际生效的Change入口
 */
interface CommonFields extends BaseChange {
    Action: "Load" | "EditImage" | "EditData" | "EditMap",
    Target: string,
    When?: { [i: string]: string },
    LogName?: string,
    Enabled?: boolean,
    Update?: string
}

interface Load extends CommonFields {
    Action: "Load",
    FromFile: string
}

interface EditData extends CommonFields {
    Action: "EditData",
    Fields?: any,
    Entries?: Entries,
    MoveEntries?: { [i: string]: string },
    TextOperations?: TextOperations[]
}

interface EditImage extends CommonFields {
    Action: "EditImage",
    FromFile: string,
    FromArea?: Coordinate,
    ToArea?: Coordinate,
    PatchMode?: "Replace" | "Overlay"
}

interface EditMap extends CommonFields {
    Action: "EditMap",
    FromFile: string,
    FromArea?: Coordinate,
    ToArea?: Coordinate,
    PatchMode?: "Replace" | "Overlay" | "ReplaceByLayer",
    MapProperties?: any,
    AddWarps?: any,
    TextOperations?: TextOperations[],
    MapTiles?: any
}


// ---sub class---
interface TextOperations {
    Operation: "Append" | "Prepend",
    Target: string[], // breadcrumb path
    Value: string,
    Delimiter?: string
}

interface Coordinate {
    X: number,
    Y: number,
    Width: number,
    Height: number,
}

interface Entries {
    [i: string]: string | null | MoviesReactionValue // EntriesMoviesModel | EntriesListAssets
}

interface MoviesReactionValue {
    NPCName: string,
    Reactions: {
        ID: string,
        Tag: string,
        Response: string
        Whitelist: any[],
        SpecialResponses: null | {
            [i: string]: {
                Text?: string
                [i: string]: string | undefined | null
            }
        },
    }[]
}