import { existsSync } from "fs";
import { basename, join } from "path";
import { buildTarget } from "../builder";
import { Starlog } from "../log";
import { parseJSON } from "../parser";
import { Traversor, TRAV_RESULT_DICT } from "../traversor";

export class TravFiles extends Traversor {
    constructor(src: string) {
        super()
        this.src = src

        // 加载i18n
    }
    public traverse() {
        const srcFile = join(this.src, "mail.json")
        const distFile = join(this.dist, basename(srcFile))
        const content: Mail[] = parseJSON(srcFile)
        Starlog.debug(srcFile)
        content.forEach(mail => {
            const title = mail.Title
            const text = mail.Text
            if (this.re.test(mail.Title)) {
                TRAV_RESULT_DICT[mail.Id + "Title"] = title
            }
            if (this.re.test(mail.Text)) {
                TRAV_RESULT_DICT[mail.Id + "Text"] = text
            }

            if (this.textHandler) {
                mail.Title = this.textHandler(title, undefined, ...this.args)
                mail.Text = this.textHandler(text, undefined, ...this.args)
            }
        })
        if (this.textHandler) {
            buildTarget(
                distFile,
                JSON.stringify(content, undefined, 2)
            )
        }
    }
}