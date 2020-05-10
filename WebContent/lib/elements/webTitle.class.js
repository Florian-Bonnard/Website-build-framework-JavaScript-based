import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import WebStyleAbstract from "./abstracts/webStyleAbstract.class.js";

export default class WebTitle extends WebStyleAbstract {
    constructor() {
        super();
    }
}

WebElement.build({
	type: WebTitle,
	defaultValue: {
		"color": "#D43F04",
		"font-size": "200%",
		"font-weight": "bold"
	}
});