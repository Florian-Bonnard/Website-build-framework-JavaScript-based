import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import WebStyleAbstract from "./abstracts/webStyleAbstract.class.js";

export default class WebMenuItem extends WebStyleAbstract {
    constructor() {
        super();
    }
}

WebElement.build({
	type: WebMenuItem,
	defaultValue: {
		"color": "#D43F04",
		"font-size": "150%",
		"font-weight": "bold"
	}
});