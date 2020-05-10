import {Utilities} from "./import.js";
import WebElement from "./webElement.class.js";
import {build as webLinkTarget} from "./webLinkTarget.build.js";
import {build as webShadowDOM} from "./webShadowDOM.build.js";

export default class WebMiddle extends WebElement {
    constructor() {
        super();
        if(this.constructor === WebMiddle) {
        	throw("can't instantiate abstract class WebMiddle");
        }
    }
}

const build = WebElement.combineBuilds(webShadowDOM,webLinkTarget,{
	observedAttributes: ["display","width"],
	defaultValue: {
		"width": "100%"
	}
});
build.type = WebMiddle;
WebElement.build(build);