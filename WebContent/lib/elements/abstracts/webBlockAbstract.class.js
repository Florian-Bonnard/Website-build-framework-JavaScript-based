import {Utilities} from "./import.js";
import WebElement from "./webElement.class.js";
import WebInlineBlockBlock from "./webInlineBlockBlock.class.js";
import {build as webBlock} from "./webBlock.build.js";

export default class WebBlockAbstract extends WebInlineBlockBlock {
    constructor() {
        super();
        if(this.constructor === WebBlockAbstract) {
        	throw("can't instantiate abstract class WebBlockAbstract");
        }
    }
}

const build = WebElement.combineBuilds(webBlock);
build.type = WebBlockAbstract;
WebElement.build(build);