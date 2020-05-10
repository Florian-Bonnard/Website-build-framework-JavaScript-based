import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import WebShadowDOM from "./abstracts/webShadowDOM.class.js";

export default class WebCopyright extends WebShadowDOM {
    constructor() {
        super();
    }
    
    static get URL() {
    	return "webCopyright";
    }
}

WebElement.build({
	type: WebCopyright,
	observedAttributes: ["author"]
});