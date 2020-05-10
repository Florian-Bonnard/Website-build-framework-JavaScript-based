import {Utilities} from "./import.js";
import WebElement from "./../abstracts/webElement.class.js";
import {build as state} from "./state.build.js";

const template = `
	<video id="id">
		<source type="video/mp4" id="id1" />
	</video>
`;

function update(shadowDocument) {
	const id = shadowDocument.querySelector("#id");
	const id1 = shadowDocument.querySelector("#id1");
	
	return state((name,value,state) => {
		switch(name) {
			case "height":
	    	case "width": {
	    		id.style[name] = value;
	            return true;
	    	}
			case "src": {
				id1[name] = value;
				return true;
			}
		}
	});
}

export {template,update};