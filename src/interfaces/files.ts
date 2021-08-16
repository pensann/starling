interface CommonContent {
    Changes: BaseChange[]
}

interface ContentPack extends CommonContent {
    Format: string,
    ConfigSchema?: any[] // ignore
    CustomLocations?: any[] // ignore
}