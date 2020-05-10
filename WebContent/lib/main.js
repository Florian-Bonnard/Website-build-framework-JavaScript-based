import {Utilities} from "./import.js";

(() => {
	const style = window.document.body.style;
	style["display"] = "none";
	style["margin"] = "0px";
	style["overflow-y"] = "scroll";
})();

window.addEventListener("webBodyLoad",async (event) => {
	function resize(event,first = false) {
		const doc = window.document.documentElement;
		
		const website = doc.querySelector("web-core");
		
		website.width = `${doc.clientWidth}px`;
		
		if(first) {
			const resizeEvent = new Event("resize",{
				bubbles: false,
				cancelable: false,
				composed: false
			});
			window.setTimeout(() => {window.dispatchEvent(resizeEvent)},1000);
		}
	}
	window.addEventListener("resize",resize);
	

	const content = window.document.body;
	window.document.body = window.document.createElement("body");
	

	const base = (new RegExp("^(.*)/[^/]*$")).exec(import.meta.url)[1];
	

	await (await import(`${base}/elements/templates/buildTemplates.function.js`)).default();
	

	async function addCustomElement(name,folder = "") {
		const elem = (await import(`${base}/elements${folder}/${name}.class.js`)).default;
		window.customElements.define(Utilities.fromCameltoCSSCase(name),elem);
	}
	
	
	const list = [
		"webAnchor",
		"webAnchorNamespace",
		"webAnchorTarget",
		"webArticle",
		"webArticlePart",
		"webBlock",
		"webCopyright",
		"webCore",
		"webFooter",
		"webGrid",
		"webGridItem",
		"webHeader",
		"webHeaderTitle",
		"webImage",
		"webIndex",
		"webInline",
		"webInlineBlock",
		"webLayout",
		"webLayoutBlock",
		"webLink",
		"webList",
		"webListElement",
		"webListElementStructure",
		"webMain",
		"webMenuItem",
		"webMouseoverIncreaseSize",
		"webPage",
		"webSlot",
		"webStyle",
		"webSub",
		"webSup",
		"webTable",
		"webTableCell",
		"webTableRow",
		"webTextBlock",
		"webTitle",
		"webTopPage",
		"webVariables",
		"webVideo"
	];
	for(const e of list) {
		await addCustomElement(e);
	}
	
	window.customElements.upgrade(content);
	window.document.body = content;
	window.document.body.style["display"] = "block";
	resize(null,true);
});