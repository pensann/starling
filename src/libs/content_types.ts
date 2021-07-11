interface ContentPack {
    Format: string,
    Changes: (CommonFields | Include)[],
    ConfigSchema?: { [index: string]: string }
    CustomLocations?: any[] // ignore
}