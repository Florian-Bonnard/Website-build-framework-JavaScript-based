import {Utilities} from "./import.js";
import WebElement from "./../abstracts/webElement.class.js";
import {build as webMiddle} from "./webMiddle.build.js";

const count2 = 2;

const template = `
	<web-layout id="id">
		<web-layout-block border-color="#000000" border-width="1px">
			<web-grid grid-template-columns="5% repeat(${count2},${90/count2}%) 5%" grid-template-rows="50px repeat(3,auto 100px)">
				<web-grid-item grid-column="2/span ${count2}" grid-row-start="2">
					<web-title>
						<slot name="web-section1"></slot>
					</web-title>
				</web-grid-item>
				<web-grid-item grid-column-start="2" grid-row-start="4">
					<web-layout width="100%" box-shadow-color="#D43F04">
						<web-text-block padding-top="50px" padding-bottom="50px">
							<slot name="web-section2-1"></slot>
						</web-text-block>
					</web-layout>
				</web-grid-item>
				<web-grid-item grid-column-start="3" grid-row-start="4">
					<slot name="web-section2-2"></slot>
				</web-grid-item>
				<web-grid-item grid-column="2/span ${count2}" grid-row-start="6">
					<web-text-block>
						<slot name="web-section3"></slot>
					</web-text-block>
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