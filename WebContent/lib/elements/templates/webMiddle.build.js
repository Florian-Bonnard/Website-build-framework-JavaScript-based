import {Utilities} from "./import.js";
import WebElement from "./../abstracts/webElement.class.js";
import {build as state} from "./state.build.js";

function build(id) {
	return state((name,value,state) => {
		switch(name) {
			case "display":
			case "width": {
				id[name] = value;
				break;
			}
		}
	});
}

export {build};