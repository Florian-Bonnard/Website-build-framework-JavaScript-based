import {Utilities} from "./import.js";
import {SerialUtilities,UniqueClassFactory} from "./../structures/export.js";
import SPPFNodeChild from "./SPPFNodeChild.class.js";

const namespace = Utilities.buildNamespace();

export default class SPPFNode {
	constructor(value,start,end,isRule = false) {
		const state = namespace(this);
		state.children = new UniqueClassFactory(SPPFNodeChild);
		state.end = end;
		state.isRule = isRule;
		state.value = value;
		state.serial = SerialUtilities.serialBuilder(isRule ? value.toSerial() : value,start,end);
		state.serialUnique = state.serial;
		state.start = start;
	}
	
	get children() {
		return namespace(this).children;
	}
	
	get end() {
		return namespace(this).end;
	}
	
	get isRule() {
		return namespace(this).isRule;
	}
	
	get start() {
		return namespace(this).start;
	}
	
	get value() {
		return namespace(this).value;
	}
	
	toSerial() {
		return namespace(this).serial;
	}
	
	toSerialUnique() {
		return namespace(this).serialUnique;
	}
}