import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import WebInlineAbstract from "./abstracts/webInlineAbstract.class.js";

export default class WebInline extends WebInlineAbstract {
    constructor() {
        super();
    }
}

WebElement.build({
	type: WebInline
});