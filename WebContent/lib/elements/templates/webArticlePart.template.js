import {Utilities} from "./import.js";
import {RegularExpression,instances} from "./../parser/export.js";
import WebElement from "./../abstracts/webElement.class.js";
import {builder as webStyleBuilder} from "./../abstracts/webStyle.build.js";
import {build as state} from "./state.build.js";

const parseRegex = new RegularExpression("<[^]{,}><px|%>");

const template = `
	<web-block>
		<web-grid grid-template-columns="repeat(1,1fr)" grid-template-rows="repeat(2,auto)">
			<web-grid-item grid-column-start="1" grid-row-start="1" place-self="start">
				<web-block id="id">
					<web-list-element-structure id="id1">
						<slot name="title"></slot>
					</web-list-element-structure>
				</web-block>
			</web-grid-item>
			<web-grid-item grid-column-start="1" grid-row-start="2" place-self="start">
				<web-block>
					<slot name="content"></slot>
				<web-block>
			</web-grid-item>
		</web-grid>
	</web-block>
`;

function update(shadowDocument) {
	const id = shadowDocument.querySelector("#id");
	const id1 = shadowDocument.querySelector("#id1");
	
	return state((name,value,state) => {
		if(webStyleBuilder("effective-").observedAttributes.includes(name)) {
			id1[name.substring(10,name.length)] = value;
		} else {
			switch(name) {
				case "list-depth":
				case "padding-left-factor": {
					if(Utilities.hasProperty(state,"list-depth") && Utilities.hasProperty(state,"padding-left-factor")) {
						const paddingLeftFactor = state["padding-left-factor"].value;
						
						if(Utilities.DEBUG) {
							if(!instances["padding-left"].parse(paddingLeftFactor).res) {
								throw(`invalid value for padding-left-factor (found ${value})`);
							}
						}
						
						const content = parseRegex.match(paddingLeftFactor).children;
						const [numberItem,unitItem] = content;
						const number = paddingLeftFactor.substring(numberItem.start,numberItem.end);
						const unit = paddingLeftFactor.substring(unitItem.start,unitItem.end);
						
						id.paddingLeft = `${Number.parseInt(state["list-depth"].value)*Number.parseFloat(number)}${unit}`;
					}
					
					break;
				}
				case "list-element-start": {
					WebElement.setAttribute(id1,`${name}---`,value);
					break;
				}
			}
		}
	});
}

export {template,update};