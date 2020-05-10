import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import {build as webListElement} from "./abstracts/webListElement.build.js";
import WebListElementStructure from "./webListElementStructure.class.js";

export default class WebListElement extends WebListElementStructure {
    constructor() {
        super();
    }
}

const build = WebElement.combineBuilds(webListElement);
build.type = WebListElement;
WebElement.build(build);