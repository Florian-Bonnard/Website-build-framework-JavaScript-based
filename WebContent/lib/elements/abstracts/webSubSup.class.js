import {Utilities} from "./import.js";
import WebElement from "./webElement.class.js";
import WebInlineAbstract from "./webInlineAbstract.class.js";

export default class WebSubSup extends WebInlineAbstract {
    constructor() {
        super();
        if(this.constructor === WebSubSup) {
        	throw("can't instantiate abstract class WebSubSup");
        }
    }
}

WebElement.build({
	type: WebSubSup,
	observedAttributes: ["font-size","top"],
	defaultValue: {
		"font-size": "75%"
	},
	initStyle: {
		"position": "relative"
	}
});