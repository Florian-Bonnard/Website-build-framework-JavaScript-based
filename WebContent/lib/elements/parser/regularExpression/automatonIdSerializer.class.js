import {Utilities} from "./import.js";
import {SerialUtilities} from "./../structures/export.js";

const namespace = Utilities.buildNamespace();

export default class AutomatonIdSerializer {
	constructor(id) {
		const state = namespace(this);
		state.id = id;
		if(Utilities.isObj(id) && Symbol.iterator in id) {
			const build = [];
			for(const e of id) {
				build.push(toSerial(e));
			}
			state.serial = SerialUtilities.serialBuilder(...(build.sort()));
		} else {
			state.serial = toSerial(id);
		}
	}
	
	get id() {
		return namespace(this).id;
	}
	
	toSerial() {
		return namespace(this).serial;
	}
}

function toSerial(e) {
	return e[Utilities.instanceOf(e,["boolean","number","string"]) ? "toString" : "toSerial"]();
}