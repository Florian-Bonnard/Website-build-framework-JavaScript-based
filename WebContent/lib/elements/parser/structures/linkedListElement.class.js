import {Utilities} from "./import.js";

const namespace = Utilities.buildNamespace();

export default class LinkedListElement {
	constructor(value) {
		const state = namespace(this);
		state.value = Utilities.defaultIfUndefined(value,null);
		state.next = null;
	}
	
	get next() {
		return namespace(this).next;
	}
	set next(next) {
		namespace(this).next = next;
 	}
	hasNext() {
		return namespace(this).next !== null;
	}
	
	get value() {
		return namespace(this).value;
	}
}