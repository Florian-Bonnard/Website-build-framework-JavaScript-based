import {Utilities} from "./import.js";
import WebElement from "./../abstracts/webElement.class.js";
import {build as state} from "./state.build.js";

const template = `
	<web-inline id="id">
	</web-inline>
`;

function update(shadowDocument) {
	const id = shadowDocument.querySelector("#id");
	
	return state((name,value,state) => {
		switch(name) {
			case "author": {
				id.innerHTML = `\u00A9 Copyright ${(new Date()).getFullYear()}, ${value}`;
				break;
			}
		}
	});
}

export {template,update};