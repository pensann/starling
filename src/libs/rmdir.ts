import { existsSync, readdirSync, statSync, unlinkSync, rmdirSync } from "fs";


export function rmDir(path: string) {
    let files = [];
    if (existsSync(path)) {
        files = readdirSync(path);
        files.forEach((file, _) => {
            let curPath = path + "/" + file;
            if (statSync(curPath).isDirectory()) {
                rmDir(curPath); //递归删除文件夹
            } else {
                unlinkSync(curPath); //删除文件
            }
        });
        rmdirSync(path);
    }
}