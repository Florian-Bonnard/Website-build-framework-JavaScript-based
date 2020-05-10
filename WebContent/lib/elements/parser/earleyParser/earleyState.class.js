import {Utilities} from "./import.js";
import {ExtendedMap,SerialSet} from "./../structures/export.js";

const namespace = Utilities.buildNamespace();

export default class EarleyState {
	constructor() {
		const state = namespace(this);
		state.set = new SerialSet();
		state.setGroups = new ExtendedMap();
	}

	get set() {
		return namespace(this).set;
	}

	get setGroups() {
		return namespace(this).setGroups;
	}
}