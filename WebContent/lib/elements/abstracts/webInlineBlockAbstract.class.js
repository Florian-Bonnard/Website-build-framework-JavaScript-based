import {Utilities} from "./import.js";
import WebElement from "./webElement.class.js";
import WebInlineBlockBlock from "./webInlineBlockBlock.class.js";
import {build as webInlineBlock} from "./webInlineBlock.build.js";

export default class WebInlineBlockAbstract extends WebInlineBlockBlock {
    constructor() {
        super();
        if(this.constructor === WebInlineBlockAbstract) {
        	throw("can't instantiate abstract class WebInlineBlockAbstract");
        }
    }
}

const build = WebElement.combineBuilds(webInlineBlock);
build.type = WebInlineBlockAbstract;
WebElement.build(build);