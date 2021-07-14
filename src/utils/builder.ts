import { dirname, resolve } from "path";
import { existsSync, mkdirSync, writeFileSync } from "fs";

function mkdirSync_P(folderPath: string) {
    if (existsSync(folderPath)) {
        return true;
    } else {
        if (mkdirSync_P(dirname(folderPath))) {
            console.log("[\x1B[38;5;44mINFO\x1B[0m] 创建文件夹: ", resolve(folderPath))
            mkdirSync(folderPath);
            return true;
        }
    }
}

function buildTarget(target: string, content: string) {
    const dir = dirname(target)
    if (!existsSync(dir)) mkdirSync_P(dir)
    if (existsSync(target)) { console.log("[\x1B[38;5;208mWARNING\x1B[0m] 目标存在，覆盖文件: ", resolve(target)) }
    writeFileSync(target, content)
}

export { buildTarget }