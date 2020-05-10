import {Utilities} from "./import.js";
import WebElement from "./../abstracts/webElement.class.js";
import {build as state} from "./state.build.js";

const template = `
	<web-block id="id">
		<slot></slot>
	<web-block>
`;

function update(shadowDocument) {
	const id = shadowDocument.querySelector("#id");
	
	return state((name,value,state) => {
		switch(name) {
			case "line-height":
			case "padding-left": {
				id[name] = value;
				break;
			}
		}
	});
}

export {template,update};