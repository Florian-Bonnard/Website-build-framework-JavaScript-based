import {Utilities} from "./import.js";
import {ExtendedSet} from "./parser/export.js";
import WebElement from "./abstracts/webElement.class.js";
import {build as webAnchorTarget} from "./abstracts/webAnchorTarget.build.js";
import {build as webList} from "./abstracts/webList.build.js";
import {build as webListElement} from "./abstracts/webListElement.build.js";
import {build as webShadowDOM} from "./abstracts/webShadowDOM.build.js";
import {builder as webStyleBuilder} from "./abstracts/webStyle.build.js";
import {namespace as articleNamespace} from "./webArticle.class.js";

const namespace = Utilities.buildNamespace();

export default class WebArticlePart extends WebElement {
    constructor() {
        super();
    }
    
    static get URL() {
    	return "webArticlePart";
    }
}

function triggerChange(elem) {
	const article = namespace(elem).article;
	const targets = window.document.querySelectorAll(`web-index[anchor-id-effective---="${WebElement.getAttribute(article,"anchor-id-effective---")}"]`);
    
	for(const e of targets) {
    	if(Utilities.instanceOf(e,WebElement)) {
    		e.anchorId = e.anchorId;
    	}
    }
}

const build = WebElement.combineBuilds(webShadowDOM,webAnchorTarget,webList,webListElement,webStyleBuilder("title-"),webStyleBuilder("title-children-"),{
	isType: ["article-part"],
	observedAttributes: ["title-font-size"],
	defaultValue: {
		"list-type": "numeric"
	},
	connectedCallback: function() {
		const state = namespace(this);
		state.children = new ExtendedSet();
		const parent = Utilities.getParentWithType(this,["article","article-part"]);
		state.parent = parent;
		
		if(Utilities.DEBUG) {
			if(parent === null) {
				throw("a web-article-part should be a descendant of an element which is of type article");
			}
		}
	    
	    if(Utilities.hasType(parent,"article")) {
	    	const parentState = articleNamespace(parent);
	    	parentState.children.add(this);
	    	state.article = parent;
	    } else {
	    	const parentState = namespace(parent);
	    	parentState.children.add(this);
	    	state.article = parentState.article;
		}
	    
	    triggerChange(this);
	},
	connectedCallbackEnd: function() {
		const state = namespace(this);
		WebElement.setAttribute(this,"padding-left-factor---",state.article.paddingLeftFactor);
		const parent = state.parent;
		WebElement.setAttribute(this,"list-depth---",(Utilities.hasType(parent,"article") ? 1 : Number.parseInt(WebElement.getAttribute(parent,"list-depth---"))+1));
	},
	disconnectedCallback: function() {
		const state = namespace(this);
		const parent = state.parent;
		const parentState = (Utilities.hasType(parent,"article") ? articleNamespace : namespace)(parent);
		parentState.children.delete(this);
	    triggerChange(this);
	},
	changedCallback: function(name,value) {
		if(webStyleBuilder("title-children-").observedAttributes.includes(name)) {
			const base = name.substring(15,name.length);
			
			for(const e of namespace(this).children) {
	    		e[`title-${base}`] = e[`title-${base}`];
	    	}
		} else if(webStyleBuilder("title-").observedAttributes.includes(name)) {
			const base = name.substring(6,name.length);

			const {children,parent} = namespace(this);
			
			if(value === "inherit") {
				const parentTitleChildren = parent[`title-children-${base}`];
				WebElement.setAttribute(this,`effective-${base}---`,parentTitleChildren === "inherit" ? WebElement.getAttribute(parent,`effective-${base}---`) : parentTitleChildren);
			} else {
				WebElement.setAttribute(this,`effective-${base}---`,value);
			}
			
			if(this[`title-children-${base}`] === "inherit") {
				for(const e of children) {
		    		e[`title-${base}`] = e[`title-${base}`];
		    	}
			}
		} else {
			switch(name) {
				case "anchor-id-effective": {
					triggerChange(this);
					break;
				}
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
build.type = WebArticlePart;
WebElement.build(build);

export {namespace};