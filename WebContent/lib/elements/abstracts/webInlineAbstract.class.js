import {Utilities} from "./import.js";
import WebElement from "./webElement.class.js";
import {build as webInline} from "./webInline.build.js";

export default class WebInlineAbstract extends WebElement {
    constructor() {
        super();
        if(this.constructor === WebInlineAbstract) {
        	throw("can't instantiate abstract class WebInlineAbstract");
        }
    }
}

const build = WebElement.combineBuilds(webInline);
build.type = WebInlineAbstract;
WebElement.build(build);