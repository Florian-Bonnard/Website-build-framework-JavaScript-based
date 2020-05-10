import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import {build as webShadowDOM} from "./abstracts/webShadowDOM.build.js";
import {build as webStyle} from "./abstracts/webStyle.build.js";

export default class WebListElementStructure extends WebElement {
    constructor() {
        super();
    }
    
    static get URL() {
    	return "webListElement";
    }
}

const build = WebElement.combineBuilds(webShadowDOM,webStyle);
build.type = WebListElementStructure;
WebElement.build(build);