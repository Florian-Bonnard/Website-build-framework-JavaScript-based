import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import WebInlineAbstract from "./abstracts/webInlineAbstract.class.js";
import {build as webAnchor} from "./abstracts/webAnchor.build.js";
import {build as webAnchorClick} from "./abstracts/webAnchorClick.build.js";

export default class WebAnchor extends WebInlineAbstract {
    constructor() {
        super();
    }
}

const build = WebElement.combineBuilds(webAnchor,webAnchorClick);
build.type = WebAnchor;
WebElement.build(build);