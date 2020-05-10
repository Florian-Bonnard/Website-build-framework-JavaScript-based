import {Utilities} from "./import.js";
import WebElement from "./webElement.class.js";

export default class WebInlineBlockBlock extends WebElement {
    constructor() {
        super();
        if(this.constructor === WebInlineBlockBlock) {
        	throw("can't instantiate abstract class WebInlineBlockBlock");
        }
    }
}

WebElement.build({
	type: WebInlineBlockBlock,
	observedAttributes: ["float","height","line-height","padding","text-align","vertical-align","white-space","width"],
	defaultValue: {
		"line-height": "inherit",
		"text-align": "inherit",
		"vertical-align": "inherit",
		"white-space": "inherit"
	}
});