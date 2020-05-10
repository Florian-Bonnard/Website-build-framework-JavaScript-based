import {Utilities} from "./import.js";
import WebElement from "./../abstracts/webElement.class.js";
import {build as webHeaderFooter} from "./webHeaderFooter.build.js";

const template = `
<web-layout id="id">
	<web-layout-block height="100%" border-color="#540D01" border-width="8px">
		<web-grid grid-template-columns="repeat(5,1fr)" grid-template-rows="repeat(2,1fr)">
			<web-grid-item grid-column-start="1" grid-row="1/span 2" place-self="start">
				<slot name="web-siteName"></slot>
			</web-grid-item>
			<web-grid-item grid-column-start="2" grid-row-start="2" place-self="end center">
				<web-header-title>
			 		<slot name="web-title1"></slot>
			 	</web-header-title>
			</web-grid-item>
			<web-grid-item grid-column-start="3" grid-row-start="2" place-self="end center">
				<web-header-title>
			 		<slot name="web-title2"></slot>
			 	</web-header-title>
			</web-grid-item>
			<web-grid-item grid-column-start="4" grid-row-start="2" place-self="end center">
				<web-header-title>
			 		<slot name="web-title3"></slot>
			 	</web-header-title>
			</web-grid-item>
			<web-grid-item grid-column-start="5" grid-row-start="2" place-self="end center">
				<web-header-title>
			 		<slot name="web-title4"></slot>
			 	</web-header-title>
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