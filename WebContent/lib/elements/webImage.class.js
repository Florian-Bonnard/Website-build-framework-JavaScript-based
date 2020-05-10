import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import WebImageVideo from "./abstracts/webImageVideo.class.js";

export default class WebImage extends WebImageVideo {
    constructor() {
        super();
    }
    
    static get URL() {
    	return "webImage";
    }
}

WebElement.build({
	type: WebImage
});