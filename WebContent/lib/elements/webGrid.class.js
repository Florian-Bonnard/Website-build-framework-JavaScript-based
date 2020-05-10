import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";

export default class WebGrid extends WebElement {
    constructor() {
        super();
    }
}

WebElement.build({
	type: WebGrid,
	observedAttributes: ["grid-template-columns","grid-template-rows"],
	initStyle: {
		"display": "grid",
	  	"height": "100%",
		"width": "100%"
	}
});