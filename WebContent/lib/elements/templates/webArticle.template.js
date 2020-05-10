import {Utilities} from "./import.js";
import WebElement from "./../abstracts/webElement.class.js";
import {build as state} from "./state.build.js";

const template = `
	<web-text-block>
		<slot></slot>
	</web-text-block>
`;

function update(shadowDocument) {
	return state((name,value,state) => {});
}

export {template,update};