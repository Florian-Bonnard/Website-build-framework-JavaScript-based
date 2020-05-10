import {Utilities} from "./import.js";
import {ExtendedSet} from "./parser/export.js";
import WebElement from "./abstracts/webElement.class.js";
import {build as webAnchorTarget} from "./abstracts/webAnchorTarget.build.js";
import {build as webList} from "./abstracts/webList.build.js";
import {build as webShadowDOM} from "./abstracts/webShadowDOM.build.js";
import {builder as webStyleBuilder} from "./abstracts/webStyle.build.js";

const namespace = Utilities.buildNamespace();

export default class WebArticle extends WebElement {
    constructor() {
        super();
    }
    
    static get URL() {
    	return "webArticle";
    }
}

const build = WebElement.combineBuilds(webShadowDOM,webAnchorTarget,webList,webStyleBuilder("title-",true),webStyleBuilder("title-children-"),{
	isType: ["article"],
	observedAttributes: ["padding-left-factor"],
	defaultValue: {
		"list-type": "numeric",
		"padding-left-factor": "20px",
		"title-color": "#D43F04",
		"title-font-size": "150%",
		"title-font-weight": "bold"
	},
	connectedCallback: function() {
		namespace(this).children = new ExtendedSet();
	},
	changedCallback: function(name,value) {
		if(webStyleBuilder("title-children-").observedAttributes.includes(name)) {
			const base = name.substring(15,name.length);
			
			for(const e of namespace(this).children) {
	    		e[`title-${base}`] = e[`title-${base}`];
	    	}
		} else if(webStyleBuilder("title-").observedAttributes.includes(name)) {
			const base = name.substring(6,name.length);
			
			if(Utilities.DEBUG) {
				if(value === "inherit") {
					throw(`wrong attribute input ${value} for ${name}`);
				}
			}
			
			WebElement.setAttribute(this,`effective-${base}---`,value);
			
			if(this[`title-children-${base}`] === "inherit") {
				for(const e of namespace(this).children) {
		    		e[`title-${base}`] = e[`title-${base}`];
		    	}
			}
		} else {
			switch(name) {
				case "padding-left-factor": {
					for(const e of namespace(this).children) {
						WebElement.setAttribute(e,"padding-left-factor---",value);
					}
					
					break;
				}
			}
		}
	}
});
build.type = WebArticle;
WebElement.build(build);

export {namespace};