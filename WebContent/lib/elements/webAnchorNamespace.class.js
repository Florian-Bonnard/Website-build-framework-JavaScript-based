import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import WebInlineAbstract from "./abstracts/webInlineAbstract.class.js";
import {build as webAnchor} from "./abstracts/webAnchor.build.js";

export default class WebAnchorNamespace extends WebInlineAbstract {
    constructor() {
        super();
    }
}

const build = WebElement.combineBuilds(webAnchor);
build.type = WebAnchorNamespace;
WebElement.build(build);