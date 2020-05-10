import {Utilities} from "./import.js";
import WebElement from "./webElement.class.js";
import {namespace as listNamespace} from "./webList.build.js";

const namespace = Utilities.buildNamespace();

const build = {
	isType: ["list-element"],
	connectedCallbackEnd: function() {
		const parent = Utilities.getParentWithType(this,"list");
		namespace(this).parent = parent;
		
		if(Utilities.DEBUG) {
			if(parent === null) {
				throw("a list-element should be a descendant of an element which is of type list");
			}
		}
	    
	    listNamespace(parent).children.add(this);
	    parent.listType = parent.listType;
	},
	disconnectedCallback: function() {
	    const parentState = listNamespace(namespace(this).parent);
		parentState.children.delete(this);
	}
};

export {build,namespace};