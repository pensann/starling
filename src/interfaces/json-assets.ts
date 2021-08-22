interface JsonAssets {
    // Common
    Name: string
    Description: string
    NameLocalization?: DictKV
    DescriptionLocalization?: DictKV
    // Crops
    SeedName?: string
    SeedDescription: string
    SeedNameLocalization?: DictKV
    SeedDescriptionLocalization?: DictKV
    // Saplings
    SaplingName?: string
    SaplingDescription?: string
    SaplingNameLocalization?: DictKV
    SaplingDescriptionLocalization?: DictKV
    [index: string]: string | DictKV | undefined
}