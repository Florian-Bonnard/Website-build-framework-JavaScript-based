import {Utilities} from "./import.js";
import WebElement from "./webElement.class.js";

const namespace = Utilities.buildNamespace();

const build = {
	connectedCallback: function() {
        const shadowDocument = this.attachShadow({mode:"closed"});
        const {result,update} = window.web.templates[this.constructor.URL];
        shadowDocument.appendChild(result.cloneNode(true));
        namespace(this).update = update(shadowDocument);
	},
	changedCallback: function(name,value) {
		const update = namespace(this).update;
		
		if(update) {
			update({[name]:value});
		}
		
		return true;
	}
};

export {build,namespace};