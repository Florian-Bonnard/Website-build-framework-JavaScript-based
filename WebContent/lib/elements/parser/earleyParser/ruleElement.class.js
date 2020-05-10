import {Utilities} from "./import.js";
import {SerialUtilities} from "./../structures/export.js";

const namespace = Utilities.buildNamespace();

export default class RuleElement {
	constructor(ruleIndex,dotIndex) {
		const state = namespace(this);
		state.dotIndex = dotIndex;
		state.ruleIndex = ruleIndex;
		state.serial = SerialUtilities.serialBuilder(ruleIndex,dotIndex);
		state.serialUnique = state.serial;
	}
	
	get dotIndex() {
		return namespace(this).dotIndex;
	}
	
	get ruleIndex() {
		return namespace(this).ruleIndex;
	}
	
	toSerial() {
		return namespace(this).serial;
	}
	
	toSerialUnique() {
		return namespace(this).serialUnique;
	}
}