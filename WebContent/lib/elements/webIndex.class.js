import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import {build as webAnchor} from "./abstracts/webAnchor.build.js";
import {build as webShadowDOM} from "./abstracts/webShadowDOM.build.js";

export default class WebIndex extends WebElement {
    constructor() {
        super();
    }
    
    static get URL() {
    	return "webIndex";
    }
}

const build = WebElement.combineBuilds(webShadowDOM,webAnchor,{
	observedAttributes: ["font-size","line-height"]
});
build.type = WebIndex;
WebElement.build(build);