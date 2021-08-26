interface QuestFramework {
    Format: string
    Quests: []
    Offers: []
}

interface Quest {
    Name: string // 作为id
    Type: "LostItem" | "ItemDelivery" | "Monster" | "Location"// and more ...(Vanilla quest type)
    Title: string // 可以提取，支持i18n
    Description: string // 可以提取，支持i18n
    Objective: string // 可以提取，支持i18n
    Reward: number // 150g
    Cancelable: boolean
    Trigger: string // 任务触发器，不能提取
    ReactionText: string // 可以提取，支持i18n
}