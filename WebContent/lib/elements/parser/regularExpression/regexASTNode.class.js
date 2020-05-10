import {Utilities} from "./import.js";

const namespace = Utilities.buildNamespace();

class RegexASTNode {
	constructor(nodeType) {
		const state = namespace(this);
		state.nodeType = nodeType;
	}
	
	get nodeType() {
		return namespace(this).nodeType;
	}
}

class RegexASTNodeLetter extends RegexASTNode {
	constructor(value) {
		super("letter");
		const state = namespace(this);
		state.value = value;
	}

	get value() {
		return namespace(this).value;
	}
}

class RegexASTNodeClass extends RegexASTNode {
	constructor(elements,negative = false) {
		super("class");
		const state = namespace(this);
		state.elements = elements;
		state.negative = negative;
	}
	
	get elements() {
		return namespace(this).elements;
	}
	
	get negative() {
		return namespace(this).negative;
	}
}

class RegexASTNodeEpsilon extends RegexASTNode {
	constructor() {
		super("epsilon");
	}
}

class RegexASTNodeSingle extends RegexASTNode {
	constructor(nodeType,child) {
		super(nodeType);
		const state = namespace(this);
		state.child = child;
	}
	
	get child() {
		return namespace(this).child;
	}
}

class RegexASTNodeDouble extends RegexASTNode {
	constructor(nodeType,first,second) {
		super(nodeType);
		const state = namespace(this);
		state.first = first;
		state.second = second;
	}

	get first() {
		return namespace(this).first;
	}
	
	get second() {
		return namespace(this).second;
	}
}

class RegexASTNodeCapture extends RegexASTNode {
	constructor(child,captureGroupId) {
		super("capturing group");
		const state = namespace(this);
		state.child = child;
		state.captureGroupId = captureGroupId;
	}

	get child() {
		return namespace(this).child;
	}

	get captureGroupId() {
		return namespace(this).captureGroupId;
	}
}

export {RegexASTNodeLetter,RegexASTNodeClass,RegexASTNodeEpsilon,RegexASTNodeSingle,RegexASTNodeDouble,RegexASTNodeCapture};