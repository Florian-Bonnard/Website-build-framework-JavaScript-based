import {Utilities} from "./import.js";
import WebElement from "./../abstracts/webElement.class.js";
import {build as webHeaderFooter} from "./webHeaderFooter.build.js";

const template = `
	<web-layout id="id">
		<web-layout-block height="100%" border-color="#000000" border-width="1px">
			<web-grid grid-template-columns="repeat(2,1fr)" grid-template-rows="repeat(1,1fr)">
				<web-grid-item grid-column-start="1" grid-row-start="1" place-self="center start">
					<slot name="web-siteLogo"></slot>
				</web-grid-item>
				<web-grid-item grid-column-start="2" grid-row-start="1" place-self="center">
		 			<slot name="web-footer"></slot>
				</web-grid-item>
			</web-grid>
		</web-layout-block>
	</web-layout>
`;

function update(shadowDocument) {
	const id = shadowDocument.querySelector("#id");
	return webHeaderFooter(id);
}

export {template,update};