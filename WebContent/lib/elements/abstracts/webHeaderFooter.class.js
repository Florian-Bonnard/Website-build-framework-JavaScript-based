import {Utilities} from "./import.js";
import WebElement from "./webElement.class.js";
import {build as webShadowDOM} from "./webShadowDOM.build.js";

export default class WebHeaderFooter extends WebElement {
	constructor() {
        super();
        if(this.constructor === WebHeaderFooter) {
        	throw("can't instantiate abstract class WebHeaderFooter");
        }
    }
}

const build = WebElement.combineBuilds(webShadowDOM,{
	observedAttributes: ["height","width"],
	defaultValue: {
		"width": "100%"
	}
});
build.type = WebHeaderFooter;
WebElement.build(build);