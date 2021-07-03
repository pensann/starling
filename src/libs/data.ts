import { CommonFields, EditData, EditImage, EditMap, Load, Include } from "./cp_base";

interface ContentPack {
    Format: string,
    Changes: (CommonFields | EditData | EditImage | EditMap | Load | Include)[],
    ConfigSchema?: { [index: string]: string }
    CustomLocations?: any[] // ignore
}

interface strMain {
    ID: string,
    Eng: string,
    Chs: string[]
}[]
