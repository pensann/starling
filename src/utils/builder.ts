import { dirname, resolve } from "path";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { LOG, StarLog } from "./log"

function mkdirSyncP(folderPath: string) {
    if (existsSync(folderPath)) {
        return true;
    } else {
        if (mkdirSyncP(dirname(folderPath))) {
            StarLog(LOG.INFO, "创建文件夹: ", resolve(folderPath))
            mkdirSync(folderPath);
            return true;
        }
    }
}

function buildTarget(target: string, content: string) {
    const dir = dirname(target)
    if (!existsSync(dir)) mkdirSyncP(dir)
    if (existsSync(target)) {
        StarLog(LOG.WARN, "目标存在，覆盖文件: ", resolve(target))
    }
    writeFileSync(target, content)
}

export { buildTarget }