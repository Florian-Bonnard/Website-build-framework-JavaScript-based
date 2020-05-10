import {Utilities} from "./import.js";
import WebElement from "./../abstracts/webElement.class.js";
import {build as state} from "./state.build.js";

const template = `
	<web-mouseover-increase-size>
		<web-menu-item>
			<slot></slot>
		</web-menu-item>
	</web-mouseover-increase-size>
`;

function update(shadowDocument) {
	return state((name,value,state) => {});
}

export {template,update};