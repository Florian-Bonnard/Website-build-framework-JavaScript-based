import {Utilities} from "./import.js";
import {ExtendedSet,RegularExpression} from "./../parser/export.js";
import WebElement from "./webElement.class.js";

const namespace = Utilities.buildNamespace();

const check = Utilities.DEBUG ? new RegularExpression("[a-zA-Z0-9\\-]{,}") : null;

const build = {
	observedAttributes: ["anchor-id"],
	connectedCallback: function() {
		const state = namespace(this);
		state.children = new ExtendedSet();
		const parent = Utilities.getParentWithType(this,["anchor","anchor-target"]);
		state.parent = parent;
		
		if(parent !== null) {
			namespace(parent).children.add(this);
		}
	},
	disconnectedCallback: function() {
		const parent = namespace(this).parent;
		
		if(parent !== null) {
			const parentState = namespace(parent);
			parentState.children.delete(this);
		}
	},
	changedCallback: function(name,value) {
		switch(name) {
			case "anchor-id": {
				if(Utilities.DEBUG) {
					if(!check.test(value)) {
						throw(`invalid value for ${name} (found ${value})`);
					}
				}
				
				const {children,parent} = namespace(this);
				WebElement.setAttribute(this,"anchor-id-effective---",((parent !== null) ? `${WebElement.getAttribute(parent,"anchor-id-effective---")}::${value}` : value));
		    	
				for(const e of children) {
		    		e.anchorId = e.anchorId;
		    	}
				
		    	break;
			}
		}
	}
};

export {build,namespace};