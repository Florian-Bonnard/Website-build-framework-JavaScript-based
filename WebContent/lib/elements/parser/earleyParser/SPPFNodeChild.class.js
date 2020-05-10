import {Utilities} from "./import.js";
import {SerialUtilities} from "./../structures/export.js";

const namespace = Utilities.buildNamespace();

export default class SPPFNodeChild {
	constructor(first = null,second = null) {
		const state = namespace(this);
		state.first = first;
		state.second = second;
		state.serial = SerialUtilities.serialBuilder(first !== null ? first.toSerial() : "",second !== null ? second.toSerial() : "");
		state.serialUnique = state.serial;
	}
	
	get first() {
		return namespace(this).first;
	}
	
	get second() {
		return namespace(this).second;
	}

	toSerial() {
		return namespace(this).serial;
	}
	
	toSerialUnique() {
		return namespace(this).serialUnique;
	}
}