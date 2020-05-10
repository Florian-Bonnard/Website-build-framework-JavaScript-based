import {Utilities} from "./import.js"
import {ExtendedMap} from "./../parser/export.js";
import WebElement from "./webElement.class.js";

const observedAttributes = ["color","font-family","font-size","font-style","font-weight"];

const builds = new ExtendedMap();

function builder(begin = "",withBaseValue = false) {
	if(Utilities.DEBUG) {
		if(!Utilities.instanceOf(begin,"string")) {
			Utilities.error("builder",1,begin,"string");
		}
		if(!Utilities.instanceOf(withBaseValue,"boolean")) {
			Utilities.error("builder",2,withBaseValue,"boolean");
		}
	}
	
	if(!builds.has(begin)) {
		const newObservedAttributes = [];
		const newDefaultValue = {};
		const newDefaultValueWithBase = {};
		const baseDefaultValue = WebElement.baseDefaultValue;
		for(const e of observedAttributes) {
			newObservedAttributes.push(`${begin}${e}`);
			newDefaultValue[`${begin}${e}`] = "inherit";
			newDefaultValueWithBase[`${begin}${e}`] = baseDefaultValue.get(e);
		}
		
		builds.set(begin,{
			withoutBase: {
				observedAttributes: newObservedAttributes,
				defaultValue: newDefaultValue
			},
			withBase: {
				observedAttributes: newObservedAttributes,
				defaultValue: newDefaultValueWithBase
			}
		});
	}
	
	return builds.get(begin)[withBaseValue ? "withBase" : "withoutBase"];
}

const build = builder();

export {builder,build};