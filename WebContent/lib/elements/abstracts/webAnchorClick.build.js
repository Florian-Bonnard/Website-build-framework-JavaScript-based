import {Utilities} from "./import.js";
import WebElement from "./webElement.class.js";

function click(event) {
    const targets = window.document.querySelectorAll(`*[anchor-id-effective---="${WebElement.getAttribute(this,"anchor-id-effective---")}"]`);
    
    for(const e of targets) {
    	if(Utilities.hasType(e,"anchor-target")) {
    	    e.scrollIntoView();
    	    break;
    	}
    }
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