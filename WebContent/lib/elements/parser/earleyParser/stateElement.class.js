import {Utilities} from "./import.js";
import {SerialUtilities} from "./../structures/export.js";

const namespace = Utilities.buildNamespace();

export default class StateElement {
	constructor(ruleElement,symbolIndex,node = null) {
		const state = namespace(this);
		state.node = node;
		state.ruleElement = ruleElement;
		state.symbolIndex = symbolIndex;
		state.serial = SerialUtilities.serialBuilder(ruleElement.toSerial(),symbolIndex,node !== null ? node.toSerial() : "");
		state.serialUnique = state.serial;
	}
	
	get node() {
		return namespace(this).node;
	}
	
	get ruleElement() {
		return namespace(this).ruleElement;
	}
	
	get symbolIndex() {
		return namespace(this).symbolIndex;
	}
	
	toSerial() {
		return namespace(this).serial;
	}
	
	toSerialUnique() {
		return namespace(this).serialUnique;
	}
}