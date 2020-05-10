import {Utilities} from "./import.js";
import {RegularExpression} from "./../parser/export.js";
import WebElement from "./webElement.class.js";

const check = Utilities.DEBUG ? new RegularExpression("[a-zA-Z0-9\\-]{,}") : null;

const build = {
	observedAttributes: ["link-id"],
	changedCallback: function(name,value) {
		switch(name) {
			case "link-id": {
				if(Utilities.DEBUG) {
					if(!check.test(value)) {
						throw(`invalid value for ${name} (found ${value})`);
					}
				}
				
		    	break;
			}
		}
	}
};

export {build};