import {Utilities} from "./import.js";
import WebElement from "./webElement.class.js";
import WebShadowDOM from "./webShadowDOM.class.js";

export default class WebImageVideo extends WebShadowDOM {
    constructor() {
        super();
        if(this.constructor === WebImageVideo) {
        	throw("can't instantiate abstract class WebImageVideo");
        }
    }
}

WebElement.build({
	type: WebImageVideo,
	observedAttributes: ["height","width","src"]
});