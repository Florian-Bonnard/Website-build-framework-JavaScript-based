import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import WebHeaderFooter from "./abstracts/webHeaderFooter.class.js";

export default class WebFooter extends WebHeaderFooter {
    constructor() {
        super();
    }

    static get URL() {
    	return "webFooter";
    }
}

WebElement.build({
	type: WebFooter,
	defaultValue: {
		"height": "100px"
	}
});