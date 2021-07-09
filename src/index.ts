import { parseJSON } from "./utils/parser";
import { ChangeTraversor } from "./utils/traversor";
import { CommonFields, EditData } from "./libs/base_types";

const c = new ChangeTraversor(parseJSON("tests/case/dialogue.json"))
console.log(c.traverse((_, arg) => arg, "hiya"))


console.log(["EditData", "Load"].includes("EditData"))