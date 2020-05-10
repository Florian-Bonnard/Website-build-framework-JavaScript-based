import {Utilities} from "./import.js";
import WebElement from "./../abstracts/webElement.class.js";
import {build as state} from "./state.build.js";

const template = `
	<img id="id" />
`;

function update(shadowDocument) {
	const id = shadowDocument.querySelector("#id");
	
	return state((name,value,state) => {
		switch(name) {
	    	case "height":
	    	case "width": {
	    		id.style[name] = value;
	            return true;
	    	}
			case "src": {
				id[name] = value;
				return true;
			}
		}
	});
}

export {template,update};