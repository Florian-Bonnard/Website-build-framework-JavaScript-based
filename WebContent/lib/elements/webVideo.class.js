import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import WebImageVideo from "./abstracts/webImageVideo.class.js";

export default class WebVideo extends WebImageVideo {
    constructor() {
        super();
    }
    
    static get URL() {
    	return "webVideo";
    }
}

WebElement.build({
	type: WebVideo
});