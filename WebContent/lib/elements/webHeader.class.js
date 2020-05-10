import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import WebHeaderFooter from "./abstracts/webHeaderFooter.class.js";

export default class WebHeader extends WebHeaderFooter {
    constructor() {
        super();
    }

    static get URL() {
    	return "webHeader";
    }
}

WebElement.build({
	type: WebHeader,
	defaultValue: {
		"height": "200px"
	}
});