import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import WebStyleAbstract from "./abstracts/webStyleAbstract.class.js";

export default class WebStyle extends WebStyleAbstract {
    constructor() {
        super();
    }
}

WebElement.build({
	type: WebStyle
});