import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import WebSubSup from "./abstracts/webSubSup.class.js";

export default class WebSup extends WebSubSup {
    constructor() {
        super();
    }
}

WebElement.build({
	type: WebSup,
	defaultValue: {
		"top": "-10px"
	}
});