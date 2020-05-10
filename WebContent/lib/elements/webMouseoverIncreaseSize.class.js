import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import WebInlineAbstract from "./abstracts/webInlineAbstract.class.js";

export default class WebMouseoverIncreaseSize extends WebInlineAbstract {
    constructor() {
        super();
    }
}

function over(event) {
	WebElement.setAttribute(this,"font-size---",this.fontSizeIncreased);
}

function out(event) {
	WebElement.setAttribute(this,"font-size---","100%");
}

WebElement.build({
	type: WebMouseoverIncreaseSize,
	observedAttributes: ["font-size-increased"],
	defaultValue: {
		"font-size-increased": "150%"
	},
	connectedCallback: function() {
    	this.addEventListener("mouseover",over);
    	this.addEventListener("mouseout",out);
	}
});