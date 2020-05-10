import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import WebBlockAbstract from "./abstracts/webBlockAbstract.class.js";

export default class WebBlock extends WebBlockAbstract {
    constructor() {
        super();
    }
}

WebElement.build({
	type: WebBlock
});