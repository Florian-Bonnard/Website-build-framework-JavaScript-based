import {Utilities} from "./import.js";
import WebElement from "./webElement.class.js";
import {build as webShadowDOM} from "./webShadowDOM.build.js";

export default class WebShadowDOM extends WebElement {
	constructor() {
        super();
        if(this.constructor === WebShadowDOM) {
        	throw("can't instantiate abstract class WebShadowDOM");
        }
    }
}

const build = WebElement.combineBuilds(webShadowDOM);
build.type = WebShadowDOM;
WebElement.build(build);