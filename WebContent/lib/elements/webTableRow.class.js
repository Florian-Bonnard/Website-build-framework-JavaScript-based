import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";

const namespace = Utilities.buildNamespace();

export default class WebTableRow extends WebElement {
    constructor() {
        super();
    }
    
    setCellWidth() {
    	const build = [];
    	
    	for(const e of Array.from(this.childNodes)) {
    		if(!e.isConnected()) {
    			return;
    		} else {
    			build.push(e.width === "auto" ? "1fr" : e.width);
    		}
		}
    	
    	WebElement.setAttribute(this,"grid-template-columns---",`${build.join(" ")}`);
    }
}

function setup(elem) {
	const state = namespace(elem);
	
	if(!state.lock) {
		state.lock = 1;
		
		for(const e of Array.from(elem.childNodes)) {
			if(e.nodeType !== 1) {
    			elem.removeChild(e);
    		}
		}
		
		if(Utilities.DEBUG) {
	    	for(const e of Array.from(elem.childNodes)) {
		    	if(!Utilities.hasTagName(e,"web-table-cell")) {
		    		throw("The children of a web-table-row must have the tag web-table-cell");
		    	}
		    }
		}
	}
}

WebElement.build({
	type: WebTableRow,
	initStyle: {
		"display": "grid",
		"place-self": "stretch",
		"width": "100%"
	},
	connectedCallback: function() {
		if(Utilities.DEBUG) {
			if(!Utilities.hasTagName(this.parentNode,"web-table")) {
				throw("The parent of a web-table-row must have the tag web-table");
			}
		}
		
		setup(this);
	},
	changedEnvironmentCallback: function() {
		setup(this);
	}
});

export {namespace};