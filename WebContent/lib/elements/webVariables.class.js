import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";

export default class WebVariables extends WebElement {
    constructor() {
        super();
    }
}

WebElement.build({
	type: WebVariables,
	initStyle: {
		"display": "none"
	}
});