import {Utilities} from "./import.js";
import WebElement from "./webElement.class.js";

function click(event) {
	const targets = window.document.querySelectorAll("*[link-id]");
	
	for(const e of targets) {
    	if(Utilities.hasType(e,"link-target")) {
    		e.display = "none";
    	}
	}
	
	const targetsDisplay = window.document.querySelectorAll(`*[link-id="${this.linkId}"]`);
	
	for(const e of targetsDisplay) {
    	if(Utilities.hasType(e,"link-target")) {
    		e.display = "inline-block";
    		break;
    	}
	}
	
	window.scrollTo(0,0);
}

const build = {
	initStyle: {
		"cursor": "pointer"
	},
	connectedCallback: function() {
    	this.addEventListener("click",click);
	}
};

export {build};