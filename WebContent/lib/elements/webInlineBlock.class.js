import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import WebInlineBlockAbstract from "./abstracts/webInlineBlockAbstract.class.js";

export default class WebInlineBlock extends WebInlineBlockAbstract {
    constructor() {
        super();
    }
}

WebElement.build({
	type: WebInlineBlock
});