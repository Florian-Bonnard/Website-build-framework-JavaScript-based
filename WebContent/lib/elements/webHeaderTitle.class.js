import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import WebShadowDOM from "./abstracts/webShadowDOM.class.js";

export default class WebHeaderTitle extends WebShadowDOM {
	constructor() {
        super();
    }
	
	static get URL() {
    	return "webHeaderTitle";
    }
}

WebElement.build({
	type: WebHeaderTitle
});