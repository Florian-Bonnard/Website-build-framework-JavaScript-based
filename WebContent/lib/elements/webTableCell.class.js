import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";
import {instances} from "./parser/export.js";

export default class WebTableCell extends WebElement {
    constructor() {
        super();
    }
}

WebElement.build({
	type: WebTableCell,
	observedAttributes: ["padding","text-align","width"],
	defaultValue: {
		"padding-top": "10px",
		"padding-right": "10px",
		"padding-bottom": "10px",
		"padding-left": "10px",
		"text-align": "inherit"
	},
	initStyle: {
		"border": "1px solid #000000",
		"place-self": "stretch"
	},
	connectedCallback: function() {
		if(Utilities.DEBUG) {
			if(!Utilities.hasTagName(this.parentNode,"web-table-row")) {
				throw("The parent of a web-table-cell must have the tag web-row");
			}
		}
	},
	changedCallback: function(name,value) {
		switch(name) {
			case "width": {
				if(Utilities.DEBUG) {
					if(!instances["width"].parse(value).res) {
						throw(`invalid value for ${name} (found ${value})`);
					}
				}
				this.parentNode.setCellWidth();
				return true;
			}
		}
	}
});