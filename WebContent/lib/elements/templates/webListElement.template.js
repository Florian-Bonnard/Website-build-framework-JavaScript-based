import {Utilities} from "./import.js";
import WebElement from "./../abstracts/webElement.class.js";
import {build as webStyle} from "./../abstracts/webStyle.build.js";
import {build as state} from "./state.build.js";

const template = `
<web-block>
	<web-style id="id">
		<web-grid grid-template-columns="auto 1fr" grid-template-rows="repeat(1,1fr)">
			<web-grid-item grid-column-start="1" grid-row-start="1" place-self="start end">
				<web-inline-block id="id1" padding-right="8px" white-space="nowrap">
				</web-inline-block>
			</web-grid-item>
			<web-grid-item grid-column-start="2" grid-row-start="1" place-self="start">
				<slot></slot>
			</web-grid-item>
		</web-grid>
	</web-style>
</web-block>
`;

function update(shadowDocument) {
	const id = shadowDocument.querySelector("#id");
	const id1 = shadowDocument.querySelector("#id1");
	
	return state((name,value,state) => {
		if(webStyle.observedAttributes.includes(name)) {
			id[name] = value;
		} else {
			switch(name) {
				case "list-element-start": {
					id1.innerHTML = value;
					break;
				}
				default: {
					id[name.substring(6,name.length)] = value;
					break;
				}
			}
		}
	});
}

export {template,update};