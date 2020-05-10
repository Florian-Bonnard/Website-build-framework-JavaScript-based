import {Utilities} from "./import.js";
import {ExtendedSet} from "./../parser/export.js";
import WebElement from "./webElement.class.js";

const namespace = Utilities.buildNamespace();

function listItem(elem) {
	switch(elem.listType) {
		case "bullet": {
			return "\u2022";
		}
		case "bibliography": {
			return `[${namespace(elem).numeric.next().value}.]`;
		}
		case "numeric": {
			return `${namespace(elem).numeric.next().value}.`;
		}
	}
}
const listTypes = new ExtendedSet(["bullet","bibliography","numeric"]);

function resetState(elem) {
	namespace(elem).numeric = Utilities.numericBuilder();
}

const build = {
	isType: ["list"],
	observedAttributes: ["list-type"],
	defaultValue: {
		"list-type": "bullet"
	},
	connectedCallback: function() {
		const state = namespace(this);
		state.children = new ExtendedSet();
		state.parent = Utilities.getParentWithType(this,"list");
	},
	changedCallback: function(name,value) {
		switch(name) {
			case "list-type": {
				if(Utilities.DEBUG) {
					if(!listTypes.has(value)) {
						throw(`wrong value input (${value}) for a ${name} attribute`);
					}
				}
				
				resetState(this);
				
				for(const e of namespace(this).children) {
					WebElement.setAttribute(e,"list-element-start---",listItem(this));
		    	}
    			
				break;
			}
		}
	}
};

export {build,namespace};