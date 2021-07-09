interface CommonFields {
    Action: "Load" | "EditImage" | "EditData" | "EditMap" | "Include",
    Target: string,
    When?: { [index: string]: string },
    LogName?: string,
    Enabled?: boolean,
    Update?: "OnDayStart" | "OnLocationChange" | "OnTimeChange" | string
}

interface Load extends CommonFields {
    Action: "Load",
    FromFile: string
}

interface EditData extends CommonFields {
    Action: "EditData",
    Fields?: string, // TODO!
    Entries?: { [index: string]: string | null | EntriesMoviesModel | EntriesListAssets },
    MoveEntries?: { [index: string]: string },
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

interface Include extends CommonFields {
    Action: "Include",
    FromFile: string
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

interface EntriesMoviesModel {
    [index: string]: any // TODO
}

interface EntriesListAssets {
    [index: string]: any // TODO
}

export {
    CommonFields,
    EditData,
    EditImage,
    EditMap,
    Load,
    Include,
    // ---sub class---
    EntriesMoviesModel,
    EntriesListAssets,
    TextOperations
}