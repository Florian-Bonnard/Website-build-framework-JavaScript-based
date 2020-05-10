import {Utilities} from "./import.js";
import WebElement from "./webElement.class.js";
import WebInlineAbstract from "./webInlineAbstract.class.js";
import {build as webStyle} from "./webStyle.build.js";

export default class WebStyleAbstract extends WebInlineAbstract {
    constructor() {
        super();
        if(this.constructor === WebStyleAbstract) {
        	throw("can't instantiate abstract class WebStyleAbstract");
        }
    }
}

const build = WebElement.combineBuilds(webStyle);
build.type = WebStyleAbstract;
WebElement.build(build);