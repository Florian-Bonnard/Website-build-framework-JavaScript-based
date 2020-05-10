import {Utilities} from "./import.js";
import WebElement from "./../abstracts/webElement.class.js";
import {build as webMiddle} from "./webMiddle.build.js";

const count3 = 3;

const template = `
	<web-layout id="id">
		<web-layout-block border-color="#000000" border-width="1px">
			<web-grid grid-template-columns="5% repeat(${count3},${90/count3}%) 5%" grid-template-rows="100px repeat(3,auto 100px)">
				<web-grid-item grid-column="2/span ${count3}" grid-row-start="2">
					<slot name="web-section1"></slot>
				</web-grid-item>
				<web-grid-item grid-column="2/span ${count3}" grid-row-start="4">
					<slot name="web-section2"></slot>
				</web-grid-item>
				<web-grid-item grid-column-start="2" grid-row-start="6">
					<slot name="web-section3-1"></slot>
				</web-grid-item>
				<web-grid-item grid-column-start="3" grid-row-start="6">
					<slot name="web-section3-2"></slot>
				</web-grid-item>
				<web-grid-item grid-column-start="4" grid-row-start="6">
					<slot name="web-section3-3"></slot>
				</web-grid-item>
			</web-grid>
		</web-layout-block>
	</web-layout>
`;

function update(shadowDocument) {
	const id = shadowDocument.querySelector("#id");
    return webMiddle(id);
}

export {template,update};