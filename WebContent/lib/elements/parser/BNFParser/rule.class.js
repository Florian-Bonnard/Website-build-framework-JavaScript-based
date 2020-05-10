import {Utilities} from "./import.js";

const namespace = Utilities.buildNamespace();

export default class Rule {
	constructor(left,right) {
		const state = namespace(this);
		state.left = left;
		state.right = right;
	}
	
	get left() {
		return namespace(this).left;
	}
	
	get right() {
		return namespace(this).right;
	}
}