import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import WebInlineAbstract from "./abstracts/webInlineAbstract.class.js";
import {build as webLink} from "./abstracts/webLink.build.js";
import {build as webLinkClick} from "./abstracts/webLinkClick.build.js";

export default class WebLink extends WebInlineAbstract {
    constructor() {
        super();
    }
}

const build = WebElement.combineBuilds(webLink,webLinkClick);
build.type = WebLink;
WebElement.build(build);