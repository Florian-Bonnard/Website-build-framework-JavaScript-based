import {Utilities} from "./import.js";
import WebElement from "./webElement.class.js";

export default class WebLayoutAbstract extends WebElement {
    constructor() {
        super();
        if(this.constructor === WebLayoutAbstract) {
        	throw("can't instantiate abstract class WebLayoutAbstract");
        }
    }
}

WebElement.build({
	type: WebLayoutAbstract,
	observedAttributes: ["background-color","border-color","border-width","box-shadow-color","box-sizing","display","height","width"],
	initStyle: {
		"border-style": "solid",
		"box-shadow-blur-radius": "30px",
		"text-align": "center"
	}
});