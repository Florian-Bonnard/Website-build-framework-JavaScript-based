import {Utilities} from "./import.js";
import WebElement from "./webElement.class.js";
import {build as webAnchorRoot} from "./webAnchorRoot.build.js";

const build = WebElement.combineBuilds(webAnchorRoot,{
	isType: ["anchor"]
});

export {build};