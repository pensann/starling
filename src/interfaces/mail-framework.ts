interface Mail {
    Id: string
    GroupID: string
    Title: string // 可以提取
    Text: string // 可以提取
    WhichBG: number
    Date: string
    Repeatable: boolean
    MailNotReceived: string[]
}