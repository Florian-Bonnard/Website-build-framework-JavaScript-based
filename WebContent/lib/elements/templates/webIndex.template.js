import {Utilities} from "./import.js";
import WebElement from "./../abstracts/webElement.class.js";
import {build as state} from "./state.build.js";
import {namespace as articleNamespace} from "./../webArticle.class.js";
import {namespace as articlePartNamespace} from "./../webArticlePart.class.js";

const template = `
	<web-text-block id="id">
		<web-style id=id1>
		<web-style>
	<web-text-block>
`;

function build(top,anchorNamespace,state) {
	top.innerHTML = "";
	
	const anchors = anchorNamespace.split("::");
	
	for(const e of anchors) {
		const tmp = window.document.createElement("web-anchor-namespace");
		tmp.anchorId = e;
		top.appendChild(tmp);
		top = tmp;
	}
	
	const targets = window.document.querySelectorAll(`*[anchor-id-effective---=${anchorNamespace}]`);
	
	for(const e of targets) {
    	if(Utilities.hasType(e,"article")) {
    		const list = window.document.createElement("web-list");
    		
    		if(Utilities.hasProperty(state,"line-height")) {
    			list.lineHeight = state["line-height"].value;
    		}
    		
    		list.listType = e.listType;
    		top.appendChild(list);
    		makeList(list,e);
    	    break;
    	}
    }
}

function makeList(top,elem) {
	const children = (Utilities.hasType(elem,"article") ? articleNamespace : articlePartNamespace)(elem).children;
	
	for(const e of children) {
		const anchor = window.document.createElement("web-anchor");
		anchor.anchorId = e.anchorId;
		top.appendChild(anchor);
		const listElem = window.document.createElement("web-list-element");
		anchor.appendChild(listElem);
		Utilities.transferChildren(listElem,e.querySelector(":scope > *[slot=title]").cloneNode(true));
		const newTop = window.document.createElement("web-list");
		
		if(makeList(newTop,e)) {
			newTop.listType = e.listType;
			const anchorNamespace = window.document.createElement("web-anchor-namespace");
			anchorNamespace.anchorId = e.anchorId;
			top.appendChild(anchorNamespace);
			anchorNamespace.appendChild(newTop);
		}
	}
	
	return children.size;
}

function update(shadowDocument) {
	const id = shadowDocument.querySelector("#id");
	const id1 = shadowDocument.querySelector("#id1");
	
	return state((name,value,state) => {
		switch(name) {
			case "anchor-id-effective":
			case "line-height": {
				if(Utilities.hasProperty(state,"anchor-id-effective")) {
					build(id,state["anchor-id-effective"].value,state);
				}
				
				break;
			}
			case "font-size": {
				id1[name] = value;
				break;
			}
		}
	});
}

export {template,update};