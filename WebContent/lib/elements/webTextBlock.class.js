import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import WebBlockAbstract from "./abstracts/webBlockAbstract.class.js";

export default class WebTextBlock extends WebBlockAbstract {
    constructor() {
        super();
    }
}

WebElement.build({
	type: WebTextBlock,
	defaultValue: {
		"text-align": "left",
		"white-space": "pre-wrap"
	}
});