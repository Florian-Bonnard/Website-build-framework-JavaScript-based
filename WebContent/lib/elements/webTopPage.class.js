import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import WebMiddle from "./abstracts/webMiddle.class.js";

export default class WebTopPage extends WebMiddle {
    constructor() {
        super();
    }
    
    static get URL() {
    	return "webTopPage";
    }
}

WebElement.build({
	type: WebTopPage
});