import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import WebInlineAbstract from "./abstracts/webInlineAbstract.class.js";
import {build as webAnchorTarget} from "./abstracts/webAnchorTarget.build.js";

export default class WebAnchorTarget extends WebInlineAbstract {
    constructor() {
        super();
    }
}

const build = WebElement.combineBuilds(webAnchorTarget);
build.type = WebAnchorTarget;
WebElement.build(build);