import { parseJSON } from "./utils/parser";
import { CommonFields, EditData } from "./libs/base_types";
const c: CommonFields = parseJSON("res/commonchange.json")
console.log(c)