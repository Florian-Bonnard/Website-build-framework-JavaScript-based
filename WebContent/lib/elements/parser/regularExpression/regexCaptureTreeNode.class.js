import {Utilities} from "./import.js";

const namespace = Utilities.buildNamespace();

export default class RegexCaptureTreeNode {
	constructor(captureId,start,end,children = []) {
		const state = namespace(this);
		state.captureId = captureId;
		state.children = children;
		state.end = end;
		state.start = start;
	}
	
	get captureId() {
		return namespace(this).captureId;
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
}

export {RegexCaptureTreeNode};