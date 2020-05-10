import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import {build as webList} from "./abstracts/webList.build.js";
import {build as webShadowDOM} from "./abstracts/webShadowDOM.build.js";

export default class WebList extends WebElement {
    constructor() {
        super();
    }
    
    static get URL() {
    	return "webList";
    }
}

const build = WebElement.combineBuilds(webShadowDOM,webList,{
	observedAttributes: ["line-height","padding-left"],
	defaultValue: {
		"padding-left": "20px"
	}
});
build.type = WebList;
WebElement.build(build);