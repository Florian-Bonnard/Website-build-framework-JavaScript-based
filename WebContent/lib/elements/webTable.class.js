import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";

const namespace = Utilities.buildNamespace();

export default class WebTable extends WebElement {
    constructor() {
        super();
    }
}

function setup(elem) {
	const state = namespace(elem);
	
	if(!state.lock) {
		state.lock = 1;
		
    	for(const e of Array.from(elem.childNodes)) {
    		if(e.nodeType === 1) {
	    		if(Utilities.DEBUG) {
	    			if(!Utilities.hasTagName(e,"web-table-row")) {
	    				throw("The children of a web-table must have the tag web-table-row");
	    			}
	    		}
    		} else {
    			elem.removeChild(e);
    		}
		}
    	
    	state.lock = 0;
	}
}

WebElement.build({
	type: WebTable,
	observedAttributes: ["width"],
	defaultValue: {
		"width": "100%"
	},
	initStyle: {
		"border": "1px solid #000000",
		"display": "grid",
		"text-align": "center"
	},
	connectedCallback: function() {
		setup(this);
	},
	changedEnvironmentCallback: function() {
		setup(this);
	}
});

export {namespace};