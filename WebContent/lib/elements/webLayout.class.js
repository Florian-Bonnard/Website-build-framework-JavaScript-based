import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import WebLayoutAbstract from "./abstracts/webLayoutAbstract.class.js";

export default class WebLayout extends WebLayoutAbstract {
    constructor() {
        super();
    }
}

WebElement.build({
	type: WebLayout
});