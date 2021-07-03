import { EditData, EntriesMoviesModel, EntriesListAssets, TextOperations } from "./cp_base";
import {  } from "./data";

class MyEditData implements EditData {
    public Action: "EditData"
    public Target: string
    private Change: EditData
    constructor(change: EditData) {
        this.Change = change
        this.Action = change.Action
        this.Target = change.Target
    }
    public iterator(msg_handler: CallableFunction, dict_obj: {}) {

    }
}