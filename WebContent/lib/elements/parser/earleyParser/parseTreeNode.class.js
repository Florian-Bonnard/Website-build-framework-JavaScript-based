import {Utilities} from "./import.js";

const namespace = Utilities.buildNamespace();

export default class ParseTreeNode {
	constructor(value,start,end) {
		const state = namespace(this);
		state.children = [];
		state.end = end;
		state.start = start;
		state.value = value;
	}
	
	get children() {
		return namespace(this).children;
	}
	
	get end() {
		return namespace(this).end;
	}
	
	get start() {
		return namespace(this).start;
	}
	
	get value() {
		return namespace(this).value;
	}
}