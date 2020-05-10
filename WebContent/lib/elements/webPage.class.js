import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import WebMiddle from "./abstracts/webMiddle.class.js";

export default class WebPage extends WebMiddle {
    constructor() {
        super();
    }
    
    static get URL() {
    	return "webPage";
    }
}

WebElement.build({
	type: WebPage
});