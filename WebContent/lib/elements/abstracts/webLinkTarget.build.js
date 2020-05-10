import {Utilities} from "./import.js";
import WebElement from "./webElement.class.js";
import {build as webLinkRoot} from "./webLinkRoot.build.js";

const build = WebElement.combineBuilds(webLinkRoot,{
	isType: ["link-target"]
});

export {build};